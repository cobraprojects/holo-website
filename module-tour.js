export function initModuleTour(onChange) {
  const root = document.querySelector("#capabilities");
  const tabs = [...root.querySelectorAll("[data-capability]")];
  const examples = {
    database: ["Portable schema → configured database"],
    storage: ["read", "write"],
    auth: [
      "Your sign-in → local user → Holo session",
      "Clerk Account Portal → local user → Holo session",
      "WorkOS AuthKit → local user → Holo session",
    ],
    realtime: ["Draft → query result", "Published → updated query result"],
    notifications: [
      "Invoice paid → one notification",
      "Email + database + broadcast → one delivery definition",
    ],
    mail: [
      "Welcome, Ava. Your account is ready.",
      "Preview driver. Inspect the message before delivery.",
    ],
    queue: [
      "Report requested → queued",
      "Worker picks up the job → processing",
      "Report generated → complete",
    ],
  };
  const state = new Map();
  function select(key, focus = false) {
    tabs.forEach((tab) => {
      const active = tab.dataset.capability === key;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      root.querySelector(`#capability-${tab.dataset.capability}`).hidden =
        !active;
      if (active && focus) tab.focus();
    });
    root.dataset.active = key;
    root.querySelector(".sculpture-fallback").src =
      `/assets/${{ storage: "storage", database: "data", auth: "identity", realtime: "realtime", notifications: "notifications", mail: "delivery", queue: "queue" }[key]}.svg`;
    onChange(key);
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => select(tab.dataset.capability));
    tab.addEventListener("keydown", (event) => {
      const moves = {
        ArrowRight: (index + 1) % tabs.length,
        ArrowLeft: (index + tabs.length - 1) % tabs.length,
        Home: 0,
        End: tabs.length - 1,
      };
      if (!(event.key in moves)) return;
      event.preventDefault();
      select(tabs[moves[event.key]].dataset.capability, true);
    });
  });
  root.querySelectorAll("[data-example]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.example;
      const index = ((state.get(key) ?? 0) + 1) % examples[key].length;
      state.set(key, index);
      if (key === "realtime")
        root.querySelectorAll("[data-live-status]").forEach((label) => {
          label.textContent = index ? "Published" : "Draft";
        });
      if (key === "mail") {
        root.querySelector(".mail-preview").hidden = index === 0;
        button.firstChild.textContent = index
          ? "Close the preview "
          : "Preview the message ";
      }
      const result =
        key === "storage"
          ? `avatar.png → ${root.querySelector('[data-driver-for="storage"][aria-pressed="true"]').textContent} disk → ${index ? "write" : "read"}`
          : examples[key][index];
      root.querySelector(`#example-${key}`).textContent = result;
      root.querySelector(`#capability-${key}`).dataset.exampleState = index;
      onChange(key, true);
    });
  });
  root.querySelectorAll("[data-driver]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.driverFor;
      root
        .querySelectorAll(`[data-driver-for="${key}"]`)
        .forEach((item) =>
          item.setAttribute("aria-pressed", String(item === button)),
        );
      const config = {
        storage: "defaultDisk",
        database: "driver",
        queue: "default",
      }[key];
      root.querySelector(`#driver-${key}`).textContent =
        `${config}: '${button.dataset.driver}'`;
      root.querySelector(`#example-${key}`).textContent = {
        storage: `Same file API → ${button.textContent} disk`,
        database: `Same migration → ${button.textContent}`,
        queue: `Same job → ${button.textContent} connection`,
      }[key];
      onChange(key, true);
    });
  });
  root.querySelectorAll("[data-auth-provider]").forEach((button) => {
    button.addEventListener("click", () => {
      root
        .querySelectorAll("[data-auth-provider]")
        .forEach((item) =>
          item.setAttribute("aria-pressed", String(item === button)),
        );
      root.querySelector("#example-auth").textContent =
        examples.auth[Number(button.dataset.authProvider)];
      onChange("auth", true);
    });
  });
  select("storage");
}
