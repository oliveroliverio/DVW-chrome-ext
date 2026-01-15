# Chrome Extension for Tabs

**User:**

help me write a chrome extension that does the following
- for all tabs open on a browser window: save as list

- open group in new tabs
- google keep like interface where I view grouped tabs as cards and sort

---

**ChatGPT:**

Below is a solid **Manifest V3** starter extension that does exactly what you described:

* **Save all tabs in the current window** as a named “group” (a list of URLs + titles)
* **Re-open a saved group** (opens all links in new tabs)
* A **Google Keep–like “cards board”** (saved groups as cards) with **sorting + drag & drop reorder**
* Uses `chrome.storage.local` so it persists

## 1) Project structure

Create a folder like:

```
tab-keep/
  manifest.json
  service_worker.js
  popup.html
  popup.js
  newtab.html
  newtab.js
  styles.css
  icon128.png   (optional)
```

## 2) `manifest.json`

This overrides the New Tab page with your board (the “Keep-like interface”) and includes a popup for quick save.

```json
{
  "manifest_version": 3,
  "name": "Tab Keep",
  "version": "0.1.0",
  "description": "Save all tabs as groups and manage them like cards.",
  "permissions": ["tabs", "storage"],
  "action": {
    "default_title": "Tab Keep",
    "default_popup": "popup.html"
  },
  "background": {
    "service_worker": "service_worker.js"
  },
  "chrome_url_overrides": {
    "newtab": "newtab.html"
  },
  "icons": {
    "128": "icon128.png"
  }
}
```

## 3) Data model (what gets stored)

We’ll store:

```js
{
  groups: [
    {
      id: "g_1700000000000_ab12",
      title: "Morning research",
      createdAt: 1700000000000,
      updatedAt: 1700000000000,
      order: 0,
      tabs: [{ url, title, favIconUrl }]
    }
  ]
}
```

## 4) `service_worker.js` (optional helper utilities)

You can keep logic in UI files, but having helpers here is nice if you later add context menus / commands.

```js
chrome.runtime.onInstalled.addListener(async () => {
  const data = await chrome.storage.local.get(["groups"]);
  if (!data.groups) {
    await chrome.storage.local.set({ groups: [] });
  }
});
```

## 5) Popup: quick “Save current window tabs”

### `popup.html`

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body class="popup">
    <div class="popup-header">
      <div class="title">Tab Keep</div>
      <a class="link" href="newtab.html" target="_blank">Open Board</a>
    </div>

    <div class="row">
      <input id="groupTitle" class="input" placeholder="Group name (e.g., 'Research')" />
    </div>

    <div class="row">
      <button id="saveBtn" class="btn primary">Save all tabs in this window</button>
    </div>

    <div class="row">
      <div id="status" class="status"></div>
    </div>

    <script src="popup.js"></script>
  </body>
</html>
```

### `popup.js`

```js
const $ = (sel) => document.querySelector(sel);

function uid() {
  return "g_" + Date.now() + "_" + Math.random().toString(16).slice(2, 6);
}

async function getGroups() {
  const { groups = [] } = await chrome.storage.local.get(["groups"]);
  return groups;
}

async function setGroups(groups) {
  await chrome.storage.local.set({ groups });
}

async function saveCurrentWindowTabs(title) {
  const [win] = await chrome.windows.getAll({ populate: true, windowTypes: ["normal"] });
  // In popup context, you can just query current window directly:
  const tabs = await chrome.tabs.query({ currentWindow: true });

  const safeTabs = tabs
    .filter((t) => t.url && !t.url.startsWith("chrome://") && !t.url.startsWith("edge://"))
    .map((t) => ({
      url: t.url,
      title: t.title || t.url,
      favIconUrl: t.favIconUrl || ""
    }));

  const groups = await getGroups();
  const maxOrder = groups.reduce((m, g) => Math.max(m, g.order ?? 0), -1);

  const now = Date.now();
  const group = {
    id: uid(),
    title: (title || "").trim() || `Group ${new Date(now).toLocaleString()}`,
    createdAt: now,
    updatedAt: now,
    order: maxOrder + 1,
    tabs: safeTabs
  };

  groups.push(group);
  await setGroups(groups);
  return group;
}

$("#saveBtn").addEventListener("click", async () => {
  $("#status").textContent = "Saving…";
  try {
    const groupTitle = $("#groupTitle").value;
    const g = await saveCurrentWindowTabs(groupTitle);
    $("#status").textContent = `Saved "${g.title}" (${g.tabs.length} tabs). Open the Board to view.`;
    $("#groupTitle").value = "";
  } catch (e) {
    console.error(e);
    $("#status").textContent = "Error saving tabs (see console).";
  }
});
```

## 6) Keep-like Board (New Tab page)

### `newtab.html`

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <link rel="stylesheet" href="styles.css" />
    <title>Tab Keep</title>
  </head>

  <body class="board">
    <header class="topbar">
      <div class="brand">
        <div class="logo">🗂️</div>
        <div>
          <div class="brand-title">Tab Keep</div>
          <div class="brand-sub">Save tab groups as cards, open anytime.</div>
        </div>
      </div>

      <div class="controls">
        <input id="search" class="input" placeholder="Search groups…" />
        <select id="sort" class="select">
          <option value="manual">Manual (drag cards)</option>
          <option value="updatedDesc">Recently updated</option>
          <option value="createdDesc">Recently created</option>
          <option value="titleAsc">Title A→Z</option>
        </select>
        <button id="saveWindowBtn" class="btn primary">Save Current Window</button>
      </div>
    </header>

    <main>
      <div id="grid" class="grid"></div>
      <div id="empty" class="empty hidden">
        No groups yet. Click <b>Save Current Window</b> or use the extension popup.
      </div>
    </main>

    <template id="cardTpl">
      <div class="card" draggable="true">
        <div class="card-head">
          <div class="card-title"></div>
          <div class="card-meta"></div>
        </div>

        <div class="card-actions">
          <button class="btn small open">Open</button>
          <button class="btn small openNewWindow">Open in New Window</button>
          <button class="btn small danger del">Delete</button>
        </div>

        <div class="card-list"></div>
      </div>
    </template>

    <script src="newtab.js"></script>
  </body>
</html>
```

### `newtab.js`

```js
const $ = (sel) => document.querySelector(sel);

function uid() {
  return "g_" + Date.now() + "_" + Math.random().toString(16).slice(2, 6);
}

async function getGroups() {
  const { groups = [] } = await chrome.storage.local.get(["groups"]);
  return groups;
}

async function setGroups(groups) {
  await chrome.storage.local.set({ groups });
}

function normalizeUrl(url) {
  try {
    return new URL(url).toString();
  } catch {
    return url;
  }
}

function sortGroups(groups, mode) {
  const copy = [...groups];
  switch (mode) {
    case "updatedDesc":
      return copy.sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
    case "createdDesc":
      return copy.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
    case "titleAsc":
      return copy.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    case "manual":
    default:
      return copy.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }
}

async function saveCurrentWindowTabs() {
  const tabs = await chrome.tabs.query({ currentWindow: true });

  const safeTabs = tabs
    .filter((t) => t.url && !t.url.startsWith("chrome://") && !t.url.startsWith("edge://"))
    .map((t) => ({
      url: normalizeUrl(t.url),
      title: t.title || t.url,
      favIconUrl: t.favIconUrl || ""
    }));

  const groups = await getGroups();
  const maxOrder = groups.reduce((m, g) => Math.max(m, g.order ?? 0), -1);

  const now = Date.now();
  groups.push({
    id: uid(),
    title: `Group ${new Date(now).toLocaleString()}`,
    createdAt: now,
    updatedAt: now,
    order: maxOrder + 1,
    tabs: safeTabs
  });

  await setGroups(groups);
}

async function openGroup(group, { newWindow = false } = {}) {
  if (!group?.tabs?.length) return;

  if (newWindow) {
    const first = group.tabs[0];
    const win = await chrome.windows.create({ url: first.url });
    const winId = win.id;

    for (let i = 1; i < group.tabs.length; i++) {
      await chrome.tabs.create({ windowId: winId, url: group.tabs[i].url, active: false });
    }
    return;
  }

  // Open in current window as background tabs, last tab active:
  for (let i = 0; i < group.tabs.length; i++) {
    await chrome.tabs.create({ url: group.tabs[i].url, active: i === group.tabs.length - 1 });
  }
}

function renderListPreview(listEl, tabs) {
  listEl.innerHTML = "";
  const max = 5;

  tabs.slice(0, max).forEach((t) => {
    const row = document.createElement("div");
    row.className = "tab-row";

    const ico = document.createElement("img");
    ico.className = "favicon";
    ico.src = t.favIconUrl || "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

    const txt = document.createElement("div");
    txt.className = "tab-title";
    txt.textContent = t.title || t.url;

    row.appendChild(ico);
    row.appendChild(txt);
    listEl.appendChild(row);
  });

  if (tabs.length > max) {
    const more = document.createElement("div");
    more.className = "tab-more";
    more.textContent = `+ ${tabs.length - max} more…`;
    listEl.appendChild(more);
  }
}

// ---- Drag & drop ordering (manual mode) ----
let dragId = null;

function attachDnD(cardEl, groupId) {
  cardEl.addEventListener("dragstart", () => {
    dragId = groupId;
    cardEl.classList.add("dragging");
  });
  cardEl.addEventListener("dragend", () => {
    dragId = null;
    cardEl.classList.remove("dragging");
  });

  cardEl.addEventListener("dragover", (e) => {
    e.preventDefault();
    cardEl.classList.add("dragover");
  });

  cardEl.addEventListener("dragleave", () => {
    cardEl.classList.remove("dragover");
  });

  cardEl.addEventListener("drop", async (e) => {
    e.preventDefault();
    cardEl.classList.remove("dragover");
    const targetId = groupId;
    if (!dragId || dragId === targetId) return;

    const sortMode = $("#sort").value;
    if (sortMode !== "manual") return; // Only reorder in manual mode

    const groups = await getGroups();
    const ordered = groups.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    const fromIdx = ordered.findIndex((g) => g.id === dragId);
    const toIdx = ordered.findIndex((g) => g.id === targetId);
    if (fromIdx < 0 || toIdx < 0) return;

    const [moved] = ordered.splice(fromIdx, 1);
    ordered.splice(toIdx, 0, moved);

    // Re-assign order values
    ordered.forEach((g, i) => (g.order = i));
    await setGroups(ordered);
    await refresh();
  });
}

async function deleteGroup(id) {
  const groups = await getGroups();
  const next = groups.filter((g) => g.id !== id);
  // normalize manual order
  next.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).forEach((g, i) => (g.order = i));
  await setGroups(next);
}

async function refresh() {
  const grid = $("#grid");
  const empty = $("#empty");
  const tpl = $("#cardTpl");

  const search = ($("#search").value || "").trim().toLowerCase();
  const sortMode = $("#sort").value;

  let groups = await getGroups();

  if (search) {
    groups = groups.filter((g) => (g.title || "").toLowerCase().includes(search));
  }

  const sorted = sortGroups(groups, sortMode);

  grid.innerHTML = "";
  empty.classList.toggle("hidden", sorted.length > 0);

  sorted.forEach((g) => {
    const node = tpl.content.firstElementChild.cloneNode(true);
    node.dataset.id = g.id;

    node.querySelector(".card-title").textContent = g.title || "Untitled";
    node.querySelector(".card-meta").textContent = `${g.tabs?.length ?? 0} tabs • ${new Date(
      g.updatedAt ?? g.createdAt ?? Date.now()
    ).toLocaleString()}`;

    renderListPreview(node.querySelector(".card-list"), g.tabs || []);

    node.querySelector(".open").addEventListener("click", async () => openGroup(g, { newWindow: false }));
    node.querySelector(".openNewWindow").addEventListener("click", async () => openGroup(g, { newWindow: true }));
    node.querySelector(".del").addEventListener("click", async () => {
      if (!confirm(`Delete "${g.title}"?`)) return;
      await deleteGroup(g.id);
      await refresh();
    });

    attachDnD(node, g.id);
    grid.appendChild(node);
  });
}

// Wire controls
$("#saveWindowBtn").addEventListener("click", async () => {
  await saveCurrentWindowTabs();
  await refresh();
});

$("#search").addEventListener("input", refresh);
$("#sort").addEventListener("change", refresh);

// Initial load
refresh();
```

## 7) `styles.css` (simple Keep-ish vibe)

```css
:root {
  --bg: #0b0c10;
  --panel: #12141b;
  --card: #171a22;
  --text: #e9e9ee;
  --muted: #a8adbd;
  --border: rgba(255, 255, 255, 0.08);
  --shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
  --radius: 16px;
}

* { box-sizing: border-box; }
html, body { height: 100%; }
body {
  margin: 0;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
  background: radial-gradient(1200px 600px at 20% 0%, #1a1e2b, var(--bg));
  color: var(--text);
}

/* Popup */
body.popup {
  width: 340px;
  padding: 12px;
  background: var(--panel);
}
.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.title { font-weight: 700; }
.link { color: var(--muted); text-decoration: none; }
.link:hover { text-decoration: underline; }

.row { margin: 10px 0; }

/* Board */
.topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: rgba(18, 20, 27, 0.85);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}
.logo { font-size: 22px; }
.brand-title { font-weight: 800; }
.brand-sub { color: var(--muted); font-size: 12px; margin-top: 2px; }

.controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

.input, .select {
  background: var(--card);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px 12px;
  outline: none;
}
.input { width: 260px; }
.select { padding: 10px 10px; }

.btn {
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--text);
  border-radius: 12px;
  padding: 10px 12px;
  cursor: pointer;
}
.btn:hover { filter: brightness(1.1); }
.btn.primary { background: #2a2f45; }
.btn.danger { background: #3a1f25; }
.btn.small { padding: 8px 10px; border-radius: 10px; font-size: 12px; }

main { padding: 18px; }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 14px;
}

.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card-head { display: flex; flex-direction: column; gap: 4px; }
.card-title { font-weight: 800; font-size: 16px; }
.card-meta { color: var(--muted); font-size: 12px; }

.card-actions { display: flex; gap: 8px; flex-wrap: wrap; }

.card-list { display: flex; flex-direction: column; gap: 6px; margin-top: 4px; }
.tab-row { display: flex; gap: 8px; align-items: center; }
.favicon { width: 16px; height: 16px; border-radius: 4px; }
.tab-title {
  font-size: 12px;
  color: var(--muted);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.tab-more { color: var(--muted); font-size: 12px; margin-top: 4px; }

.empty {
  margin-top: 40px;
  color: var(--muted);
  text-align: center;
  font-size: 14px;
}
.hidden { display: none; }

/* DnD states */
.card.dragover { outline: 2px dashed rgba(255,255,255,0.25); }
.card.dragging { opacity: 0.55; }
```

## 8) Load it in Chrome

1. Go to `chrome://extensions`
2. Enable **Developer mode**
3. **Load unpacked**
4. Select the `tab-keep/` folder
5. Open a **New Tab** → you should see your board

## 9) Notes + next upgrades (worth doing)

**Why some tabs don’t save:** Chrome blocks URLs like `chrome://extensions` from being opened by extensions. (We filter those out.)
Easy upgrades you probably want next:

* **Edit group title** (inline rename)
* **Card “pinning”** (pinned at top)
* **Tags / colors** (Keep style)
* **Open as a Tab Group** using `chrome.tabGroups` (Chrome supports real tab groups now)
* **Import/export** as JSON (backup + sync)
* **“Save only this tab group / only selected tabs”** (multi-select UI)

If you tell me one preference, I’ll steer the next iteration without asking a bunch of questions:
**Do you want the “board” to be:**

1. **New Tab override** (what I implemented), or
2. a normal extension page you open from the toolbar (safer if you don’t want to replace New Tab)?

---

