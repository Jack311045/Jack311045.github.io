import fs from "node:fs";
import path from "node:path";

const requiredProjects = ["ChessLens", "Sustentra", "Recipe Discovery & Semantic Search"];
const requiredEmployers = ["Sustentra", "GigaCloud Technology", "CITIC Securities"];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function validateOrderedItems(items, requiredNames, label) {
  if (!Array.isArray(items) || items.length < requiredNames.length) {
    throw new Error(`${label} must include its three required entries.`);
  }
  requiredNames.forEach((name, index) => {
    if (items[index]?.name !== name) {
      throw new Error(`${label} entry ${index + 1} must be "${name}".`);
    }
  });
  if (new Set(items.map((item) => item.name)).size !== items.length) {
    throw new Error(`${label} names must be unique.`);
  }
}

export default function (eleventyConfig) {
  eleventyConfig.on("eleventy.before", async () => {
    await fs.promises.rm(path.resolve("_site"), { recursive: true, force: true });
  });

  const dataDir = path.resolve("src/_data");
  const projects = readJson(path.join(dataDir, "projects.json"));
  const experience = readJson(path.join(dataDir, "experience.json"));
  const skills = readJson(path.join(dataDir, "skills.json"));
  const profile = readJson(path.join(dataDir, "profile.json"));
  const resume = readJson(path.join(dataDir, "resume.json"));

  validateOrderedItems(projects.items, requiredProjects, "Projects");
  validateOrderedItems(experience.items, requiredEmployers, "Experience");
  for (const project of projects.items) {
    if (!project.summary || !project.status || !Array.isArray(project.highlights) || project.highlights.length < 2 || !Array.isArray(project.technology) || !Array.isArray(project.links)) {
      throw new Error(`Project "${project.name}" needs a summary, status, highlights, technology list, and links list.`);
    }
  }
  for (const role of experience.items) {
    if (!role.role || !role.category || !Array.isArray(role.highlights) || role.highlights.length === 0 || !Array.isArray(role.links)) {
      throw new Error(`Experience "${role.name}" needs a role, category, highlights, and links list.`);
    }
  }
  for (const link of [...projects.items, ...experience.items].flatMap((item) => item.links)) {
    if (!link.label || !/^https:\/\/[^\s/$.?#].[^\s]*$/i.test(link.url)) {
      throw new Error("Career links must have labels and absolute HTTPS URLs.");
    }
  }
  if (!Array.isArray(skills.groups) || !skills.groups.length || !Array.isArray(skills.coursework) || skills.coursework.length !== 30) {
    throw new Error("Skills data must include groups and coursework lists.");
  }
  const courseCodes = new Set();
  let completedCourses = 0;
  let inProgressCourses = 0;
  for (const course of skills.coursework) {
    if (!course.term || !course.code || !course.name || !["Completed", "In progress"].includes(course.status) || !["technical", "additional"].includes(course.group)) {
      throw new Error("Each course needs a term, code, name, status, and technical/additional group.");
    }
    const identity = `${course.term}:${course.code}`;
    if (courseCodes.has(identity)) throw new Error(`Duplicate coursework entry: ${identity}`);
    courseCodes.add(identity);
    if (course.status === "Completed") completedCourses += 1;
    else inProgressCourses += 1;
  }
  if (completedCourses !== 26 || inProgressCourses !== 4) {
    throw new Error(`Expected 26 completed and 4 in-progress courses; found ${completedCourses} and ${inProgressCourses}.`);
  }
  if (!profile.education || !profile.location || !profile.introduction || profile.introduction.trim().split(/\s+/).length < 70 || profile.introduction.trim().split(/\s+/).length > 110) {
    throw new Error("Profile needs verified education and location details and a 70–110 word introduction.");
  }
  for (const item of [...projects.items, ...experience.items]) {
    if (!Number.isInteger(item.order)) {
      throw new Error(`"${item.name}" must have a numeric order.`);
    }
  }

  const resumeFile = path.resolve("src", resume.path.replace(/^\/+/, ""));
  if (!resume.path || !resume.path.toLowerCase().endsWith(".pdf") || !fs.existsSync(resumeFile)) {
    throw new Error(`Configured public resume PDF does not exist or is not a PDF: ${resume.path}`);
  }

  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addFilter("isExternalUrl", (value) => /^https?:\/\//i.test(value));

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    templateFormats: ["njk", "html", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
