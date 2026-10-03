import { createModuleSculptures } from "./module-sculptures.js";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

// A locally modeled Holo H. One scene and one object travel through the first
// three story beats; there are no model swaps, remote textures, or asset calls.
export async function createHoloWorld(host) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.8;
  host.append(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 50);
  camera.position.set(0, 0, 10);
  const environment = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  // Prepare the room's shaders in the same linear target used by PMREM,
  // allowing parallel compilation instead of blocking its first render.
  const preparationTarget = new THREE.WebGLRenderTarget(1, 1, {
    type: THREE.HalfFloatType,
    colorSpace: THREE.LinearSRGBColorSpace,
  });
  renderer.setRenderTarget(preparationTarget);
  renderer.toneMapping = THREE.NoToneMapping;
  await renderer.compileAsync(room, camera);
  renderer.setRenderTarget(null);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  preparationTarget.dispose();
  const environmentMap = environment.fromScene(room, 0.04);
  scene.environment = environmentMap.texture;
  room.dispose();
  environment.dispose();
  scene.add(new THREE.HemisphereLight(0xfff1d6, 0x314324, 0.9));
  const key = new THREE.DirectionalLight(0xffddbb, 1.5);
  key.position.set(-3, 5, 7);
  scene.add(key);
  const edge = new THREE.DirectionalLight(0xffffff, 1);
  edge.position.set(4, -1, 3);
  scene.add(edge);
  const core = new THREE.Group();
  scene.add(core);
  const sculptures = createModuleSculptures(THREE);
  scene.add(sculptures.root);
  const face = new THREE.MeshPhysicalMaterial({
    color: 0xe4572e,
    roughness: 0.32,
    metalness: 0.34,
    clearcoat: 0.35,
    clearcoatRoughness: 0.3,
  });
  const edgeMaterial = new THREE.MeshStandardMaterial({
    color: 0x402f23,
    roughness: 0.42,
    metalness: 0.65,
  });
  const shape = new THREE.Shape();
  const r = 0.055,
    s = 0.79;
  shape.moveTo(-s / 2 + r, -s / 2);
  shape.lineTo(s / 2 - r, -s / 2);
  shape.quadraticCurveTo(s / 2, -s / 2, s / 2, -s / 2 + r);
  shape.lineTo(s / 2, s / 2 - r);
  shape.quadraticCurveTo(s / 2, s / 2, s / 2 - r, s / 2);
  shape.lineTo(-s / 2 + r, s / 2);
  shape.quadraticCurveTo(-s / 2, s / 2, -s / 2, s / 2 - r);
  shape.lineTo(-s / 2, -s / 2 + r);
  shape.quadraticCurveTo(-s / 2, -s / 2, -s / 2 + r, -s / 2);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.24,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.025,
    bevelThickness: 0.025,
    curveSegments: 8,
  });
  geometry.center();
  const positions = [
    [-1.26, 1.26],
    [1.26, 1.26],
    [-1.26, 0.42],
    [-0.42, 0.42],
    [0.42, 0.42],
    [1.26, 0.42],
    [-1.26, -0.42],
    [-0.42, -0.42],
    [0.42, -0.42],
    [1.26, -0.42],
    [-1.26, -1.26],
    [1.26, -1.26],
  ];
  const names = [
    "AUTH",
    "MODELS",
    "SECURITY",
    "EVENTS",
    "QUEUE",
    "STORAGE",
    "CACHE",
    "POLICIES",
    "MAIL",
    "VALIDATE / FORMS",
    "REALTIME",
    "NOTIFY",
  ];
  const screwMaterial = new THREE.MeshStandardMaterial({
    color: 0x4b3423,
    metalness: 0.8,
    roughness: 0.3,
  });
  const screwGeometry = new THREE.CylinderGeometry(0.019, 0.019, 0.012, 10);
  const blocks = positions.map((destination, index) => {
    const block = new THREE.Group();
    const blockFace = face.clone();
    const mesh = new THREE.Mesh(geometry, [blockFace, edgeMaterial]);
    block.add(mesh);
    const labelCanvas = document.createElement("canvas");
    labelCanvas.width = 256;
    labelCanvas.height = 128;
    const context = labelCanvas.getContext("2d");
    context.clearRect(0, 0, 256, 128);
    context.fillStyle = "#442719";
    context.textAlign = "center";
    context.font = `500 ${names[index].length > 10 ? 19 : 26}px Arial`;
    context.fillText(names[index], 128, 65);
    context.font = "14px monospace";
    context.fillStyle = "#713c28";
    context.fillText("@holo-js", 128, 91);
    const labelTexture = new THREE.CanvasTexture(labelCanvas);
    labelTexture.colorSpace = THREE.SRGBColorSpace;
    const label = new THREE.Mesh(
      new THREE.PlaneGeometry(0.64, 0.32),
      new THREE.MeshBasicMaterial({
        map: labelTexture,
        transparent: true,
        depthWrite: false,
      }),
    );
    label.position.z = 0.151;
    block.add(label);
    for (const x of [-0.31, 0.31])
      for (const y of [-0.31, 0.31]) {
        const screw = new THREE.Mesh(screwGeometry, screwMaterial);
        screw.rotation.x = Math.PI / 2;
        screw.position.set(x, y, 0.154);
        block.add(screw);
      }
    core.add(block);
    const start = [
      destination[0] * 1.35 + ((index % 3) - 1) * 0.2,
      destination[1] * 1.3 + (index % 2 ? 0.26 : -0.26),
      (index % 3) * 0.25,
    ];
    return { block, blockFace, destination, start, index };
  });
  // A thin circuit in the H's silhouette gives the modules a shared support.
  const substrateShape = new THREE.Shape();
  const points = [
    [-1.7, -1.7],
    [-0.86, -1.7],
    [-0.86, -0.82],
    [0.86, -0.82],
    [0.86, -1.7],
    [1.7, -1.7],
    [1.7, 1.7],
    [0.86, 1.7],
    [0.86, 0.82],
    [-0.86, 0.82],
    [-0.86, 1.7],
    [-1.7, 1.7],
  ];
  substrateShape.moveTo(...points[0]);
  points.slice(1).forEach((p) => substrateShape.lineTo(...p));
  substrateShape.closePath();
  const substrate = new THREE.Mesh(
    new THREE.ExtrudeGeometry(substrateShape, {
      depth: 0.075,
      bevelEnabled: true,
      bevelSize: 0.025,
      bevelThickness: 0.015,
      bevelSegments: 2,
    }),
    new THREE.MeshStandardMaterial({
      color: 0x273622,
      roughness: 0.65,
      metalness: 0.25,
    }),
  );
  substrate.position.z = -0.2;
  core.add(substrate);
  function resize() {
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  }
  resize();
  await renderer.compileAsync(scene, camera);
  function render(pose) {
    host.style.clipPath = pose.clipTop === undefined
      ? "none"
      : `inset(${Math.max(0, pose.clipTop)}px 0 0 0)`;
    if (document.hidden || pose.opacity <= 0) {
      host.style.opacity = "0";
      return;
    }
    host.style.opacity = String(pose.opacity);
    const visibleHeight =
      2 *
      Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) *
      camera.position.z;
    core.position.set(
      (pose.x - 0.5) * visibleHeight * camera.aspect,
      (0.5 - pose.y) * visibleHeight,
      0,
    );
    core.rotation.set(pose.rx, pose.ry, pose.rz);
    core.scale.setScalar(pose.scale);
    core.visible = !pose.module;
    sculptures.root.visible = Boolean(pose.module);
    if (pose.module) {
      sculptures.root.position.copy(core.position);
      sculptures.root.rotation.copy(core.rotation);
      sculptures.root.scale.copy(core.scale);
      sculptures.render(pose.module, pose.phase);
      renderer.render(scene, camera);
      return;
    }
    blocks.forEach(({ block, blockFace, destination, start, index }) => {
      const active =
        pose.selected
          ? pose.selected[index]
          : pose.active === undefined || index === [0, 1, 4, 11][pose.active];
      blockFace.color.setHex(active ? 0xe4572e : 0x6b7860);
      const t = Math.min(
        1,
        Math.max(0, (pose.assembly - index * 0.008) / (0.98 - index * 0.008)),
      );
      const eased = t * t * (3 - 2 * t);
      block.position.set(
        start[0] + (destination[0] - start[0]) * eased,
        start[1] + (destination[1] - start[1]) * eased,
        start[2] * (1 - eased),
      );
      block.rotation.z = (index % 2 ? 0.18 : -0.18) * (1 - eased);
    });
    substrate.visible = pose.assembly > 0.5;
    renderer.render(scene, camera);
  }
  renderer.domElement.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    document.documentElement.classList.remove("has-webgl");
    host.style.display = "none";
  });
  return { render, resize };
}
