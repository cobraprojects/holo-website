import { initModuleTour } from "./module-tour.js";
document.documentElement.classList.add("js");
const examples = {
  next: {
    name: "Next.js",
    path: "app/api/posts/route.ts",
    code: "import Post from '@/server/models/Post'\n\nexport async function GET() {\n  const posts = await Post\n    .where('status', 'published')\n    .latest()\n    .paginate(15)\n\n  return Response.json(posts)\n}",
  },
  nuxt: {
    name: "Nuxt",
    path: "server/api/posts.get.ts",
    code: "import Post from '../models/Post'\n\nexport default defineEventHandler(async () => {\n  return await Post\n    .where('status', 'published')\n    .latest()\n    .paginate(15)\n})",
  },
  svelte: {
    name: "SvelteKit",
    path: "src/routes/api/posts/+server.ts",
    code: "import { json } from '@sveltejs/kit'\nimport Post from '../../../../server/models/Post'\n\nexport async function GET() {\n  const posts = await Post\n    .where('status', 'published')\n    .latest()\n    .paginate(15)\n\n  return json(posts)\n}",
  },
};
const workflow = [
  {
    tag: "AUTHORIZATION",
    title: "Permissions belong\nto your domain.",
    description:
      "Define an ability once. Reuse the same decision in routes, jobs, and services.",
    file: "server/abilities/publish-post.ts",
    link: "https://docs.holo-js.com/authorization/abilities",
    label: "Explore authorization",
    code: "import { defineAbility, allow, deny }\n  from '@holo-js/authorization'\n\nexport default defineAbility('posts.publish',\n  context => context.user?.role === 'editor'\n    ? allow()\n    : deny('Editor access required.')\n)",
  },
  {
    tag: "TYPED MODELS",
    title: "The domain reads\nlike the domain.",
    description:
      "Find the record. Apply the change. Let the model own persistence and lifecycle behavior.",
    file: "server/services/publish-post.ts",
    link: "https://docs.holo-js.com/orm/writes",
    label: "Explore models",
    code: "import Post from '../models/Post'\n\nexport async function publishPost(id: number) {\n  const post = await Post.findOrFail(id)\n\n  await post.update({\n    status: 'published',\n  })\n\n  return post\n}",
  },
  {
    tag: "BACKGROUND JOBS",
    title: "Respond now.\nDo the rest in a job.",
    description:
      "Dispatch a typed payload. Keep delivery work outside the request so it can run in a worker.",
    file: "server/services/notify-subscribers.ts",
    link: "https://docs.holo-js.com/queue/jobs",
    label: "Explore queues",
    code: "import NotifySubscribers\n  from '../jobs/notify-subscribers'\n\nexport async function notifySubscribers(\n  postId: number\n) {\n  await NotifySubscribers.dispatch({ postId })\n}",
  },
  {
    tag: "EXPLICIT RETRY POLICY",
    title: "Plan for the\nunhappy path.",
    description:
      "Declare attempts and backoff alongside the job. Delivery logic stays in your own application.",
    file: "server/jobs/notify-subscribers.ts",
    link: "https://docs.holo-js.com/queue/failed-jobs",
    label: "Explore job reliability",
    code: "import { defineJob } from '@holo-js/queue'\nimport { deliverPost } from '../services/delivery'\n\nexport default defineJob<{ postId: number }>({\n  queue: 'notifications',\n  tries: 3,\n  backoff: [5, 30, 120],\n  async handle({ postId }) {\n    await deliverPost(postId)\n  },\n})",
  },
];
const tabs = [...document.querySelectorAll("[data-framework]")];
const fitButtons = [...document.querySelectorAll("[data-fit-framework]")];
const moduleButtons = [...document.querySelectorAll("[data-module]")];
const startTiles = [...document.querySelectorAll("[data-start-modules]")];
// Reuse the starter's dimensional H for every static scene.
const fallbackShape = document.querySelector(".start-model-fallback");
const workflowTiles = [];
for (const selector of [".shell-fallback", ".workflow-object-fallback"]) {
  const slot = document.querySelector(selector);
  const shape = fallbackShape.cloneNode(true);
  const tiles = [...shape.children];
  for (const tile of tiles) {
    tile.removeAttribute("data-start-modules");
    tile.classList.toggle("is-selected", selector === ".shell-fallback");
  }
  if (selector === ".workflow-object-fallback") workflowTiles.push(...tiles);
  slot.append(shape);
}
const assemblyCaption = document.querySelector(".assembly-caption");
const assemblyWorld = document.querySelector(".component-world");
let selectedBlocks = [];
const modules = new Set(["auth", "queue", "storage"]);
const command = document.querySelector("#install-command");
let framework = "next";
let packageManager = "npm";
let activeStep = -1;
let statusTimer;

function highlight(element, code) {
  element.replaceChildren();
  const tokens = code.split(
    /('[^']*'|\b(?:import|from|export|default|async|function|const|await|return)\b|\b(?:GET|defineEventHandler|where|latest|paginate|json|defineAbility|allow|deny|findOrFail|update|dispatch|defineJob|deliverPost)\b|\b\d+\b)/g,
  );
  for (const token of tokens) {
    const span = document.createElement("span");
    span.textContent = token;
    if (token.startsWith("'")) span.className = "syntax-green";
    else if (
      /^(import|from|export|default|async|function|const|await|return)$/.test(
        token,
      )
    )
      span.className = "syntax-purple";
    else if (
      /^(GET|defineEventHandler|where|latest|paginate|json|defineAbility|allow|deny|findOrFail|update|dispatch|defineJob|deliverPost)$/.test(
        token,
      )
    )
      span.className = "syntax-yellow";
    else if (/^\d+$/.test(token)) span.className = "syntax-orange";
    element.append(span);
  }
}
function updateCommand() {
  const base =
    packageManager === "yarn"
      ? "yarn create holo-js my-app"
      : `${packageManager} create holo-js@latest my-app`;
  const separator = ["npm", "pnpm"].includes(packageManager) ? " --" : "";
  const database = document.querySelector("#starter-database").value;
  const optional = [...modules].sort();
  command.textContent = `${base}${separator} --framework ${framework === "svelte" ? "sveltekit" : framework} --database ${database}${optional.length ? ` --package ${optional.join(",")}` : ""}`;
  document.querySelector("#selected-count").textContent = modules.size;
  const selection = document.querySelector("#selected-modules");
  selection.replaceChildren();
  if (!optional.length) {
    const label = document.createElement("span");
    label.className = "empty-selection";
    label.textContent = "Foundation only. Add modules when you need them.";
    selection.append(label);
  }
  optional.forEach((name) => {
    const button = document.createElement("button");
    button.textContent = `${name} ×`;
    button.setAttribute("aria-label", `Remove ${name}`);
    button.addEventListener("click", () => toggleModule(name));
    selection.append(button);
  });
  moduleButtons.forEach((button) => {
    const selected = modules.has(button.dataset.module);
    button.setAttribute("aria-pressed", String(selected));
    button.querySelector("i").textContent = selected ? "✓" : "+";
  });
  selectedBlocks = startTiles.map((tile) => {
    const names = tile.dataset.startModules;
    const included = !names || names.split(" ").some((name) => modules.has(name));
    tile.classList.toggle("is-selected", included);
    return included;
  });
  queueMicrotask(scheduleScroll);
}
function toggleModule(name) {
  if (modules.has(name)) modules.delete(name);
  else modules.add(name);
  updateCommand();
}
function selectFramework(key) {
  framework = key;
  const example = examples[key];
  tabs.forEach((tab) => {
    const selected = tab.dataset.framework === key;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  fitButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.fitFramework === key));
  });
  document.querySelector("#fit-name").textContent = example.name;
  document.querySelector("#fit-logo").src = `/assets/${key}.svg`;
  document
    .querySelector("#route-panel")
    .setAttribute("aria-labelledby", `tab-${key}`);
  document.querySelector("#route-path").textContent = example.path;
  document.querySelector("#starter-framework").value = key;
  highlight(document.querySelector("#route-code"), example.code);
  updateCommand();
}
fitButtons.forEach((button) => {
  button.addEventListener("click", () => selectFramework(button.dataset.fitFramework));
});
tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectFramework(tab.dataset.framework));
  tab.addEventListener("keydown", (event) => {
    const moves = {
      ArrowRight: (index + 1) % tabs.length,
      ArrowDown: (index + 1) % tabs.length,
      ArrowLeft: (index + tabs.length - 1) % tabs.length,
      ArrowUp: (index + tabs.length - 1) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    const next = tabs[moves[event.key]];
    selectFramework(next.dataset.framework);
    next.focus();
  });
});
moduleButtons.forEach((button) =>
  button.addEventListener("click", () => toggleModule(button.dataset.module)),
);
document
  .querySelector("#starter-framework")
  .addEventListener("change", (event) => selectFramework(event.target.value));
document
  .querySelector("#starter-database")
  .addEventListener("change", updateCommand);
document.querySelectorAll("[data-pm]").forEach((button) =>
  button.addEventListener("click", () => {
    packageManager = button.dataset.pm;
    document
      .querySelectorAll("[data-pm]")
      .forEach((item) =>
        item.setAttribute("aria-pressed", String(item === button)),
      );
    updateCommand();
  }),
);
async function copy(text) {
  const status = document.querySelector("#copy-status");
  clearTimeout(statusTimer);
  try {
    await navigator.clipboard.writeText(text);
    status.textContent = "Copied to clipboard";
  } catch {
    status.textContent = "Clipboard unavailable. Select and copy the code.";
  }
  status.classList.add("visible");
  statusTimer = setTimeout(() => status.classList.remove("visible"), 2600);
}
document
  .querySelector("#copy-code")
  .addEventListener("click", () => copy(examples[framework].code));
document
  .querySelector("#copy-command")
  .addEventListener("click", () => copy(command.textContent));
function showStep(index) {
  if (index === activeStep) return;
  activeStep = index;
  const step = workflow[index];
  workflowTiles.forEach((tile, tileIndex) => {
    tile.classList.toggle("is-selected", tileIndex === [0, 1, 4, 11][index]);
  });
  document.querySelector("#detail-tag").textContent = step.tag;
  document.querySelector("#detail-title").textContent = step.title;
  document.querySelector("#detail-description").textContent = step.description;
  document.querySelector("#workflow-file").textContent = step.file;
  const link = document.querySelector("#detail-link");
  link.href = step.link;
  link.replaceChildren(document.createTextNode(`${step.label} →`));
  highlight(document.querySelector("#workflow-code"), step.code);
  document.querySelectorAll("[data-step]").forEach((button) => {
    const selected = Number(button.dataset.step) === index;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
}
document
  .querySelectorAll("[data-step]")
  .forEach((button) =>
    button.addEventListener("click", () =>
      showStep(Number(button.dataset.step)),
    ),
  );
selectFramework(framework);
showStep(0);
const moduleAct = document.querySelector("#modules");
const moduleStage = document.querySelector(".modules-stage");
const rail = document.querySelector(".modules-rail");
const scrollCraft = window.ScrollCraft.mount();

// Scroll is the assembly timeline. One scheduled read/write pass, no idle loop.
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const assembly = document.querySelector("#assembly");
const assemblyStage = document.querySelector(".assembly-stage");
const heroHeading = document.querySelector(".hero-heading");
const resolvedHeading = document.querySelector(".resolved-heading");
const pieces = [...document.querySelectorAll("[data-piece]")];
const destinations = [
  [-144, -144],
  [144, -144],
  [-144, -48],
  [-48, -48],
  [48, -48],
  [144, -48],
  [-144, 48],
  [-48, 48],
  [48, 48],
  [144, 48],
  [-144, 144],
  [144, 144],
];
const origins = [
  [-350, -180, 110, -15],
  [290, -190, 65, 25],
  [-280, -15, 80, -25],
  [-90, -210, 160, 20],
  [100, -130, 130, -15],
  [380, -20, 85, 30],
  [-380, 135, 60, 20],
  [-120, 190, 100, -15],
  [90, 160, 100, 20],
  [310, 175, 40, -20],
  [-210, 310, 90, 25],
  [250, 300, 80, -20],
];
const workflowAct = document.querySelector("#workflow");
const workflowStage = document.querySelector(".workflow-stage");
const workflowVisual = document.querySelector(".workflow-visual");
const signal = document.querySelector(".workflow-signal");
const dockLinks = [...document.querySelectorAll(".journey-dock a")];
const dockSections = dockLinks.map((link) =>
  document.querySelector(link.getAttribute("href")),
);
const holoTurn = {
  from: { rx: -0.38, ry: -0.4, rz: -0.14 },
  to: { rx: -0.38, ry: 0.3, rz: 0.08 },
};
const heroRotation = { rx: -0.6, ry: -0.25, rz: -0.22 };
let holoWorld;
const startSection = document.querySelector("#start");
const startModel = document.querySelector(".start-model");
const tour = document.querySelector("#capabilities");
const sculptureBox = tour.querySelector(".module-sculpture");
let selectedCapability = "storage";
let moduleTransitionStart = 0;
let changingShape = false;
let pending = false;
let scrollStep = -1;
const clamp = (value) => Math.min(1, Math.max(0, value));
const smooth = (value) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};
function progress(element) {
  const rect = element.getBoundingClientRect();
  return clamp(-rect.top / Math.max(1, rect.height - innerHeight));
}
function renderScroll() {
  pending = false;
  const p = progress(assembly);
  const reduced =
    reducedMotion.matches ||
    document.documentElement.dataset.motion === "reduce";
  const assemblyProgress = reduced ? 1 : p;
  pieces.forEach((piece, index) => {
    const start = origins[index];
    const end = destinations[index];
    const local = reduced
      ? 1
      : smooth((p - index * 0.009) / (0.98 - index * 0.009));
    const spread = innerWidth <= 760 ? 0.58 : 0.8;
    const x = start[0] * spread + (end[0] - start[0] * spread) * local;
    const y = start[1] * 0.4 + (end[1] - start[1] * 0.4) * local;
    const z = start[2] * 0.2 * (1 - local);
    piece.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,${z.toFixed(2)}px) rotateZ(${(start[3] * (1 - local)).toFixed(2)}deg)`;
  });
  const switchProgress = reduced ? 0 : smooth((p - 0.42) / 0.07);
  const switchOut = reduced ? 0 : smooth((p - 0.32) / 0.07);
  heroHeading.style.opacity = String(1 - switchOut);
  heroHeading.style.transform = reduced
    ? "none"
    : `translateY(${-switchOut * 15}px)`;
  resolvedHeading.style.opacity = String(switchProgress);
  resolvedHeading.style.transform = reduced
    ? "none"
    : `translateY(${(1 - switchProgress) * 15}px)`;
  assemblyStage.classList.toggle("connected", assemblyProgress > 0.6);
  assemblyStage.dataset.scVerifyState = `${assemblyProgress.toFixed(2)}:${switchProgress.toFixed(2)}`;
  document.querySelector("#assembly-caption").textContent =
    assemblyProgress > 0.9
      ? "One runtime. Shared conventions. Your application."
      : assemblyProgress > 0.4
        ? "Backend capabilities, becoming a connected system."
        : "The pieces are familiar. The wiring is your problem.";
  const workflowProgress = progress(workflowAct);
  const step = reduced ? 0 : Math.min(3, Math.floor(workflowProgress * 4));
  if (step !== scrollStep) {
    scrollStep = step;
    showStep(step);
  }
  signal.style.transform = `scaleX(${reduced ? 1 : workflowProgress})`;
  workflowStage.dataset.scVerifyState = `${step}:${workflowProgress.toFixed(2)}`;
  if (holoWorld && !reduced) {
    const mobile = innerWidth <= 760;
    const why = document.querySelector("#why");
    const heroEnd = assembly.offsetTop + assembly.offsetHeight - innerHeight;
    const slot = document
      .querySelector(".shell-brackets")
      .getBoundingClientRect();
    const slotCenter = slot.top + scrollY + slot.height / 2;
    const whyCenter = slotCenter - innerHeight / 2;
    const whyExit = Math.min(
      workflowAct.offsetTop - 100,
      slotCenter - innerHeight * 0.3,
    );
    const flowStart = workflowAct.offsetTop;
    const flowEnd = flowStart + workflowAct.offsetHeight - innerHeight;
    const visual = workflowVisual.getBoundingClientRect();
    const stage = workflowStage.getBoundingClientRect();
    const workflowPose = {
      x: (visual.left + visual.width / 2) / innerWidth,
      y: (visual.top - stage.top + visual.height / 2) / innerHeight,
      scale: (Math.min(visual.width, visual.height) / innerHeight) * 1.3,
    };
    const heroSlot = assemblyWorld.getBoundingClientRect();
    const heroStage = assemblyStage.getBoundingClientRect();
    const frames = [
      {
        at: heroEnd,
        x: mobile ? 0.5 : 0.75,
        y: mobile
          ? (heroSlot.top - heroStage.top + heroSlot.height / 2) / innerHeight
          : 0.52,
        scale: mobile ? 0.38 : 0.73,
        ...heroRotation,
        opacity: 1,
      },
      {
        at: whyCenter,
        x: (slot.left + slot.width / 2) / innerWidth,
        y: 0.5,
        scale: (Math.min(slot.width, slot.height) / innerHeight) * 1.3,
        rx: -0.35,
        ry: 0.22,
        rz: 0.12,
        opacity: 1,
      },
      {
        at: flowStart,
        ...workflowPose,
        ...holoTurn.from,
        opacity: 1,
      },
      {
        at: flowEnd,
        ...workflowPose,
        ...holoTurn.to,
        opacity: 1,
      },
      {
        at: flowEnd + innerHeight * 0.7,
        x: workflowPose.x,
        y: 0.15,
        scale: 0.18,
        rx: -0.5,
        ry: 0.6,
        rz: 0.2,
        opacity: 0,
      },
    ];
    frames.splice(2, 0, {
      ...frames[1],
      at: whyExit,
      y: (slotCenter - whyExit) / innerHeight,
    });
    if (mobile && whyCenter > why.offsetTop)
      frames.splice(1, 0, {
        ...frames[1],
        at: why.offsetTop,
        y: (slotCenter - why.offsetTop) / innerHeight,
      });
    let pose = { ...frames[0] };
    if (scrollY >= frames.at(-1).at) pose = { ...frames.at(-1) };
    else
      for (let i = 1; i < frames.length; i++) {
        if (scrollY > frames[i - 1].at && scrollY <= frames[i].at) {
          const t = smooth(
            (scrollY - frames[i - 1].at) / (frames[i].at - frames[i - 1].at),
          );
          for (const key of ["x", "y", "scale", "rx", "ry", "rz", "opacity"])
            pose[key] =
              frames[i - 1][key] + (frames[i][key] - frames[i - 1][key]) * t;
          break;
        }
      }
    if (scrollY >= whyCenter && scrollY <= whyExit)
      pose.y = (slotCenter - scrollY) / innerHeight;
    const tourRect = tour.getBoundingClientRect();
    const startRect = startSection.getBoundingClientRect();
    if (startRect.top < innerHeight && startRect.bottom > 0) {
      const box = startModel.getBoundingClientRect();
      const center = box.top + scrollY + box.height / 2;
      const returnEnd = Math.min(
        center - innerHeight * 0.58,
        document.documentElement.scrollHeight - innerHeight,
      );
      const returnStart = returnEnd - innerHeight * 0.6;
      const returnProgress = clamp((scrollY - returnStart) / (returnEnd - returnStart));
      const arrival = smooth(returnProgress);
      const target = {
        x: (box.left + box.width / 2) / innerWidth,
        y: (center - returnEnd) / innerHeight,
        scale: (Math.min(box.width, box.height) / innerHeight) * 1.3,
        ...heroRotation,
      };
      // Reveal the H at its previous left-hand exit before carrying it right.
      const origin = frames.at(-1);
      const revealAt = returnStart + (returnEnd - returnStart) * 0.3;
      const revealEdge = mobile ? box.top + scrollY : startSection.offsetTop;
      const revealY = (revealEdge - revealAt) / innerHeight + 0.06;
      const travel = smooth((returnProgress - 0.3) / 0.7);
      const returning = {};
      returning.x = origin.x + (target.x - origin.x) * travel;
      for (const key of ["rx", "ry", "rz"]) {
        returning[key] = origin[key] + (heroRotation[key] - origin[key]) * travel;
      }
      returning.y = returnProgress <= 0.3
        ? origin.y + (revealY - origin.y) * smooth(returnProgress / 0.3)
        : revealY + (target.y - revealY) * travel;
      returning.scale = origin.scale + (target.scale - origin.scale)
        * smooth((returnProgress - 0.55) / 0.45);
      if (scrollY >= returnEnd) returning.y = (box.top + box.height / 2) / innerHeight;
      holoWorld.render({
        ...returning,
        clipTop: mobile ? Math.max(startRect.top, box.top) : startRect.top,
        opacity: 1,
        assembly: 1,
        selected: selectedBlocks,
      });
      startModel.dataset.scVerifyState = `return:${arrival.toFixed(2)}:turn:${returning.ry.toFixed(2)}`;
    } else if (tourRect.top < innerHeight && tourRect.bottom > 0) {
      const box = sculptureBox.getBoundingClientRect();
      const t = clamp((performance.now() - moduleTransitionStart) / 420);
      holoWorld.render({
        x: (box.left + box.width / 2) / innerWidth,
        y: (box.top + box.height / 2) / innerHeight,
        scale:
          (Math.min(box.width, box.height) / innerHeight) *
          1.25 *
          (1 + Math.sin(t * Math.PI) * 0.035),
        rx: -0.2,
        ry: -0.35 + Math.sin(t * Math.PI) * 0.12,
        rz: -0.07,
        opacity: 1,
        assembly: 1,
        module: selectedCapability,
        phase: changingShape ? smooth(t) : 1,
      });
      if (t < 1) scheduleScroll();
    } else {
      holoWorld.render({
        ...pose,
        assembly: scrollY <= heroEnd ? p : 1,
        active: scrollY >= flowStart && scrollY <= flowEnd ? step : undefined,
      });
    }
  }
  let active = 0;
  dockSections.forEach((section, index) => {
    if (section.getBoundingClientRect().top < innerHeight * 0.5) active = index;
  });
  dockLinks.forEach((link, index) => {
    link.classList.toggle("active", index === active);
    if (index === active) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}
function scheduleScroll() {
  if (!pending) {
    pending = true;
    requestAnimationFrame(renderScroll);
  }
}
window.addEventListener("scroll", scheduleScroll, { passive: true });
window.addEventListener("resize", scheduleScroll);
reducedMotion.addEventListener("change", scheduleScroll);
scheduleScroll();

const motionToggle = document.querySelector("#motion-toggle");
function setMotion(reduce) {
  document.documentElement.dataset.motion = reduce ? "reduce" : "full";
  (reduce ? heroHeading : assemblyWorld).append(assemblyCaption);
  motionToggle.setAttribute("aria-pressed", String(reduce));
  document.querySelector("#motion-state").textContent = reduce ? "off" : "on";
  syncModuleScroll();
  scrollCraft.layout();
  scheduleScroll();
}
motionToggle.addEventListener("click", () =>
  setMotion(motionToggle.getAttribute("aria-pressed") !== "true"),
);
setMotion(reducedMotion.matches);
reducedMotion.addEventListener("change", (event) => setMotion(event.matches));

let keyboardNavigation = false;
window.addEventListener("keydown", (event) => {
  if (event.key === "Tab") keyboardNavigation = true;
});
window.addEventListener(
  "pointerdown",
  () => {
    keyboardNavigation = false;
  },
  { passive: true },
);
// Pin the inventory only when there is horizontal content to reveal.
function syncModuleScroll() {
  const fits = rail.scrollWidth <= moduleStage.clientWidth + 1;
  if (moduleAct.classList.contains("is-flow") === fits) return;
  moduleAct.classList.toggle("is-flow", fits);
  scrollCraft.layout();
  scheduleScroll();
}
window.addEventListener("resize", syncModuleScroll);
syncModuleScroll();

rail.addEventListener("focusin", (event) => {
  const sheet = event.target.closest(".module-sheet");
  if (
    !keyboardNavigation ||
    !sheet ||
    moduleAct.classList.contains("is-flow") ||
    reducedMotion.matches ||
    document.documentElement.dataset.motion === "reduce"
  )
    return;
  const overflow = rail.scrollWidth - innerWidth;
  const position = Math.min(
    1,
    Math.max(0, (sheet.offsetLeft - 45) / Math.max(1, overflow)),
  );
  window.scrollTo({
    top:
      moduleAct.offsetTop + (moduleAct.offsetHeight - innerHeight) * position,
    behavior: "instant",
  });
  requestAnimationFrame(() => {
    moduleStage.scrollLeft = 0;
  });
});

let worldLoading;
function loadWorld() {
  if (worldLoading) return;
  worldLoading = import("./world.js")
    .then(({ createHoloWorld }) => {
      holoWorld = createHoloWorld(document.querySelector("#holo-world"));
      if (!holoWorld) return;
      document.documentElement.classList.add("has-webgl");
      window.addEventListener("resize", () => {
        holoWorld.resize();
        scheduleScroll();
      });
      document.addEventListener("visibilitychange", scheduleScroll);
      scheduleScroll();
    })
    .catch(() => {
      /* The CSS object and static diagrams remain available. */
    });
}
if (!reducedMotion.matches) loadWorld();
motionToggle.addEventListener("click", () => {
  if (document.documentElement.dataset.motion !== "reduce") loadWorld();
});
reducedMotion.addEventListener("change", (event) => {
  if (!event.matches) loadWorld();
});

initModuleTour((key) => {
  changingShape = key !== selectedCapability;
  selectedCapability = key;
  moduleTransitionStart = performance.now();
  scrollCraft.layout();
  scheduleScroll();
});
