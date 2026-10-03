const viewport = () => ({ width: innerWidth, height: innerHeight, pixelRatio: devicePixelRatio });

export async function createHoloWorld(host) {
  const canvas = document.createElement("canvas");
  host.append(canvas);
  let worker;
  let backend;
  let busy = false;
  let pendingPose;
  let failed = false;
  let modulesPrepared = false;
  function fail() {
    failed = true;
    worker?.terminate();
    canvas.remove();
    host.style.opacity = "0";
    document.documentElement.classList.remove("has-webgl");
  }
  function send(pose) {
    busy = true;
    worker.postMessage({ type: "render", pose });
  }
  try {
    if (typeof canvas.transferControlToOffscreen === "function") {
      worker = new Worker(new URL("./world-worker.js", import.meta.url), { type: "module" });
      const offscreen = canvas.transferControlToOffscreen();
      await new Promise((resolve, reject) => {
        worker.onerror = () => { fail(); reject(new Error("3D worker failed")); };
        worker.onmessage = ({ data }) => {
          if (data.type === "ready") resolve();
          else if (data.type === "error") { fail(); reject(new Error("3D rendering failed")); }
          else if (data.type === "drawn") {
            document.documentElement.classList.add("has-webgl");
            busy = false;
            if (pendingPose) {
              const next = pendingPose;
              pendingPose = undefined;
              send(next);
            }
          }
        };
        worker.postMessage({ type: "init", canvas: offscreen, viewport: viewport() }, [offscreen]);
      });
    } else {
      const { createHoloRenderer } = await import("./world-renderer.js");
      backend = await createHoloRenderer(canvas, viewport());
      if (!backend) throw new Error("WebGL unavailable");
      canvas.addEventListener("webglcontextlost", (event) => { event.preventDefault(); fail(); });
    }
  } catch {
    fail();
    return null;
  }
  return {
    prepareModules() {
      if (failed || modulesPrepared) return;
      modulesPrepared = true;
      if (worker) worker.postMessage({ type: "prepare" });
      else backend.prepareModules().catch(fail);
    },
    resize() {
      if (failed) return;
      const size = viewport();
      canvas.style.width = `${size.width}px`;
      canvas.style.height = `${size.height}px`;
      if (worker) worker.postMessage({ type: "resize", viewport: size });
      else backend.resize(size);
    },
    render(pose) {
      host.style.clipPath = pose.clipTop === undefined ? "none" : `inset(${Math.max(0, pose.clipTop)}px 0 0 0)`;
      host.style.opacity = document.hidden || failed ? "0" : String(pose.opacity);
      if (document.hidden || failed || pose.opacity <= 0) return;
      if (worker) {
        if (busy) pendingPose = pose;
        else send(pose);
      } else {
        backend.render(pose);
        document.documentElement.classList.add("has-webgl");
      }
    },
  };
}
