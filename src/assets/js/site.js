const fileTabs = [...document.querySelectorAll(".file-tab")];
const editorPanels = [...document.querySelectorAll(".editor-panel")];
const breadcrumbFile = document.querySelector("#breadcrumb-file");

function activateFileTab(name, updateHash = true, moveFocus = false) {
  const tab = fileTabs.find((item) => item.dataset.tab === name) || fileTabs[0];
  fileTabs.forEach((item) => {
    const active = item === tab;
    item.classList.toggle("is-active", active);
    item.setAttribute("aria-selected", String(active));
    item.tabIndex = active ? 0 : -1;
  });
  editorPanels.forEach((panel) => {
    const active = panel.id === tab.getAttribute("aria-controls");
    panel.hidden = !active;
    panel.classList.toggle("is-visible", active);
  });
  breadcrumbFile.textContent = tab.textContent.trim().replace(/^[A-Z]\s*/, "");
  if (updateHash) history.replaceState(null, "", `#${tab.dataset.tab}`);
  if (moveFocus) tab.focus();
}

fileTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateFileTab(tab.dataset.tab));
  tab.addEventListener("keydown", (event) => {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % fileTabs.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + fileTabs.length) % fileTabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = fileTabs.length - 1;
    else return;
    event.preventDefault();
    activateFileTab(fileTabs[next].dataset.tab, true, true);
  });
});
activateFileTab(location.hash.slice(1), false);
window.addEventListener("hashchange", () => activateFileTab(location.hash.slice(1), false));

document.querySelectorAll(".accordion-list").forEach((list) => {
  const button = list.nextElementSibling;
  const items = [...list.querySelectorAll(":scope > details")];
  if (!button?.matches(".show-more") || items.length <= 3) {
    if (button?.matches(".show-more")) button.hidden = true;
    return;
  }
  const extra = items.slice(3);
  extra.forEach((item) => list.querySelector(".extra-items").append(item));
  const container = list.querySelector(".extra-items");
  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") !== "true";
    container.hidden = !expanded;
    button.setAttribute("aria-expanded", String(expanded));
    button.innerHTML = expanded ? 'Show less <span aria-hidden="true">↑</span>' : 'Show more <span aria-hidden="true">↓</span>';
  });
});

const panelTabs = [...document.querySelectorAll(".panel-tabs [data-panel]")];
const panelContent = document.querySelector("#panel-content");
const panelMessages = {
  problems: "No problem list is configured for this static portfolio preview.",
  output: "No build output is displayed in this decorative panel.",
  debug: "No debugger is attached.",
  terminal: '<span class="prompt">PS C:\\jack311045\\jack311045&gt;</span> portfolio\nStatic portfolio preview. No shell commands are executed.',
  ports: "No development ports are configured.",
  jupyter: "No notebook runtime is attached.",
};

panelTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    panelTabs.forEach((item) => {
      const active = item === tab;
      item.setAttribute("aria-selected", String(active));
      item.classList.toggle("panel-active", active);
    });
    panelContent.innerHTML = `<pre>${panelMessages[tab.dataset.panel]}</pre>`;
  });
});

const collapseButton = document.querySelector(".panel-collapse");
collapseButton.addEventListener("click", () => {
  const expanded = collapseButton.getAttribute("aria-expanded") !== "true";
  collapseButton.setAttribute("aria-expanded", String(expanded));
  panelContent.hidden = !expanded;
  collapseButton.textContent = expanded ? "Collapse panel" : "Expand panel";
  if (window.matchMedia("(max-width: 680px)").matches && !expanded) {
    document.querySelector("#terminal-panel").scrollIntoView({ block: "nearest" });
  }
});
if (window.matchMedia("(max-width: 680px)").matches) collapseButton.click();
