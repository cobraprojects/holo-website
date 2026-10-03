import { createHoloRenderer } from "./world-renderer.js";

let world;
self.onmessage = async ({ data }) => {
  try {
    if (data.type === "init") {
      world = await createHoloRenderer(data.canvas, data.viewport);
      if (!world) throw new Error("WebGL unavailable");
      data.canvas.addEventListener("webglcontextlost", (event) => {
        event.preventDefault();
        self.postMessage({ type: "error" });
      });
      self.postMessage({ type: "ready" });
    } else if (data.type === "resize") {
      world.resize(data.viewport);
    } else if (data.type === "prepare") {
      await world.prepareModules();
    } else if (data.type === "render") {
      world.render(data.pose);
      self.postMessage({ type: "drawn" });
    }
  } catch {
    self.postMessage({ type: "error" });
  }
};
