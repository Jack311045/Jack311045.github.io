import fs from "node:fs";
import path from "node:path";

const requiredProjects = ["ChessLens", "Sustentra", "Recipe Discovery"];
const requiredEmployers = ["Sustentra", "GigaCloud", "CITIC Securities"];

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
  const resume = readJson(path.join(dataDir, "resume.json"));

  validateOrderedItems(projects.items, requiredProjects, "Projects");
  validateOrderedItems(experience.items, requiredEmployers, "Experience");
  if (!Array.isArray(skills.groups) || !Array.isArray(skills.coursework)) {
    throw new Error("Skills data must include groups and coursework lists.");
  }
  for (const course of skills.coursework) {
    if (!course.name || !["Completed", "In progress"].includes(course.status)) {
      throw new Error("Each course needs a name and a Completed or In progress status.");
    }
  }
  eleventyConfig.addGlobalData("hasCareerSkills", skills.groups.some((group) => group.items?.length));
  for (const item of [...projects.items, ...experience.items]) {
    if (!Number.isInteger(item.order)) {
      throw new Error(`"${item.name}" must have a numeric order.`);
    }
  }

  if (resume.path) {
    const resumeFile = path.resolve("src", resume.path.replace(/^\/+/, ""));
    if (!fs.existsSync(resumeFile)) {
      throw new Error(`Configured resume PDF does not exist: ${resume.path}`);
    }
    if (!resume.path.toLowerCase().endsWith(".pdf")) {
      throw new Error("The configured resume path must point to a PDF.");
    }
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
