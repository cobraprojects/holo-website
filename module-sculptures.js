import { createTextureCanvas } from "./texture-canvas.js";

// Locally authored solid models. Every form shares the Holo hardware palette.
export function createModuleSculptures(THREE) {
  const root = new THREE.Group();
  const orange = new THREE.MeshStandardMaterial({
    color: 0xe4572e,
    metalness: 0.35,
    roughness: 0.3,
  });
  const green = new THREE.MeshStandardMaterial({
    color: 0x647452,
    metalness: 0.5,
    roughness: 0.35,
  });
  const metal = new THREE.MeshStandardMaterial({
    color: 0xc0c5b5,
    metalness: 0.75,
    roughness: 0.27,
  });
  function solid(points, depth, material) {
    const shape = new THREE.Shape();
    shape.moveTo(...points[0]);
    points.slice(1).forEach((p) => shape.lineTo(...p));
    shape.closePath();
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth,
      steps: 1,
      bevelEnabled: true,
      bevelSize: 0.06,
      bevelThickness: 0.06,
      bevelSegments: 3,
    });
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  }
  function line(points, material, radius = 0.025) {
    const curve = new THREE.CatmullRomCurve3(
      points.map((p) => new THREE.Vector3(...p)),
    );
    return new THREE.Mesh(
      new THREE.TubeGeometry(curve, 32, radius, 8, false),
      material,
    );
  }
  const forms = {};
  for (const name of [
    "storage",
    "database",
    "auth",
    "realtime",
    "notifications",
    "mail",
    "queue",
  ]) {
    forms[name] = new THREE.Group();
    root.add(forms[name]);
  }
  const folder = [
    [-1.5, -0.9],
    [1.5, -0.9],
    [1.5, 0.9],
    [-0.3, 0.9],
    [-0.65, 1.2],
    [-1.5, 1.2],
  ];
  for (let i = 0; i < 3; i++) {
    const leaf = solid(folder, 0.12, i === 2 ? orange : green);
    leaf.position.set(0, i * 0.14, -0.45 + i * 0.32);
    leaf.rotation.x = -i * 0.1;
    forms.storage.add(leaf);
  }
  const label = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.055, 0.02), metal);
  label.position.set(-0.55, -0.38, 0.36);
  forms.storage.add(label);
  const cylinder = new THREE.CylinderGeometry(1.15, 1.15, 0.48, 48);
  for (let i = 0; i < 3; i++) {
    const disk = new THREE.Mesh(cylinder, i === 2 ? orange : green);
    disk.position.y = (i - 1) * 0.58;
    forms.database.add(disk);
  }
  const shield = solid(
    [
      [-1.3, 1],
      [0, 1.5],
      [1.3, 1],
      [1.18, -0.45],
      [0.65, -1.1],
      [0, -1.5],
      [-0.65, -1.1],
      [-1.18, -0.45],
    ],
    0.3,
    green,
  );
  forms.auth.add(shield);
  const lock = solid(
    [
      [-0.5, -0.6],
      [0.5, -0.6],
      [0.5, 0.2],
      [-0.5, 0.2],
    ],
    0.17,
    orange,
  );
  lock.position.z = 0.4;
  forms.auth.add(lock);
  forms.auth.add(
    line(
      [
        [-0.33, 0.15, 0.55],
        [-0.32, 0.7, 0.55],
        [0, 0.88, 0.55],
        [0.32, 0.7, 0.55],
        [0.33, 0.15, 0.55],
      ],
      metal,
      0.07,
    ),
  );
  function inscription(text, width, height, color = "#364731") {
    const canvas = createTextureCanvas(text.length === 1 ? 96 : 384, 96);
    const context = canvas.getContext("2d");
    context.fillStyle = color;
    context.font = `${text.length === 1 ? 80 : 42}px Arial`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, canvas.width / 2, 48);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false }),
    );
  }
  const screenFace = new THREE.MeshStandardMaterial({
    color: 0xd6dfc9,
    metalness: 0.08,
    roughness: 0.65,
  });
  const windowOutline = [[-0.68, -0.5], [0.68, -0.5], [0.68, 0.5], [-0.68, 0.5]];
  const clients = [[-1.12, 0.5, -0.2], [1.12, 0.65, -0.7], [0, -0.8, 0.8]];
  clients.forEach((position, index) => {
    const browser = new THREE.Group();
    browser.position.set(...position);
    browser.rotation.y = index === 1 ? -0.15 : 0.15;
    browser.add(solid(windowOutline, 0.22, green));
    const display = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 0.045), screenFace);
    display.position.z = 0.28;
    browser.add(display);
    const toolbar = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.18, 0.05), green);
    toolbar.position.set(0, 0.31, 0.29);
    browser.add(toolbar);
    for (let i = 0; i < 3; i++) {
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.025, 12, 8), metal);
      dot.position.set(-0.47 + i * 0.095, 0.31, 0.33);
      browser.add(dot);
    }
    const state = inscription("Live query", 0.87, 0.22);
    state.position.set(0, 0.03, 0.315);
    browser.add(state);
    const status = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.075, 0.055), orange);
    status.position.set(0, -0.23, 0.33);
    browser.add(status);
    forms.realtime.add(browser);
  });
  const commit = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.42, 0.42), orange);
  commit.position.set(0, 0.85, 0.65);
  commit.rotation.set(0.2, 0.45, 0.15);
  forms.realtime.add(commit);
  clients.forEach(([x, y, z]) => {
    forms.realtime.add(line([[0, 0.85, 0.4], [x * 0.45, y + 0.2, z], [x, y, z]], metal, 0.045));
  });

  // A rounded, hollow bell: a turned shell, a rolled lip, and an attached clapper.
  const bellCurve = new THREE.Path();
  bellCurve.moveTo(0, 1.12);
  bellCurve.bezierCurveTo(0.56, 1.12, 0.69, 0.7, 0.72, 0.3);
  bellCurve.bezierCurveTo(0.75, -0.3, 0.8, -0.6, 1.04, -0.8);
  bellCurve.quadraticCurveTo(1.13, -0.9, 1.04, -0.97);
  bellCurve.lineTo(0.92, -0.97);
  bellCurve.bezierCurveTo(0.66, -0.65, 0.63, -0.3, 0.59, 0.3);
  bellCurve.bezierCurveTo(0.56, 0.74, 0.44, 0.96, 0, 0.96);
  bellCurve.closePath();
  const bell = new THREE.Group();
  bell.add(new THREE.Mesh(new THREE.LatheGeometry(bellCurve.getPoints(64), 64), orange));
  const innerCurve = new THREE.Path();
  innerCurve.moveTo(0.91, -0.955);
  innerCurve.bezierCurveTo(0.65, -0.65, 0.62, -0.3, 0.58, 0.3);
  innerCurve.bezierCurveTo(0.55, 0.73, 0.43, 0.945, 0, 0.945);
  bell.add(new THREE.Mesh(
    new THREE.LatheGeometry(innerCurve.getPoints(48), 64),
    new THREE.MeshStandardMaterial({ color: 0x38432e, roughness: 0.7, side: THREE.DoubleSide }),
  ));
  const lip = new THREE.Mesh(new THREE.TorusGeometry(1.01, 0.075, 12, 64), orange);
  lip.rotation.x = Math.PI / 2;
  lip.position.y = -0.91;
  bell.add(lip);
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.065, 12, 32), metal);
  handle.position.y = 1.27;
  bell.add(handle);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.65, 16), metal);
  stem.position.y = -0.79;
  bell.add(stem);
  const clapper = new THREE.Mesh(new THREE.SphereGeometry(0.19, 32, 24), metal);
  clapper.position.y = -1.14;
  bell.add(clapper);
  const badge = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.12, 32), green);
  badge.rotation.x = Math.PI / 2;
  badge.position.set(0.76, 0.86, 0.57);
  bell.add(badge);
  const count = inscription("3", 0.2, 0.19, "#f0f0e9");
  count.position.set(0.76, 0.86, 0.64);
  bell.add(count);
  bell.rotation.set(-0.3, 0.15, 0.14);
  forms.notifications.add(bell);
  const envelope = solid(
    [
      [-1.5, -0.9],
      [1.5, -0.9],
      [1.5, 0.9],
      [-1.5, 0.9],
    ],
    0.24,
    orange,
  );
  forms.mail.add(envelope);
  forms.mail.add(
    line(
      [
        [-1.42, 0.84, 0.34],
        [0, -0.1, 0.36],
        [1.42, 0.84, 0.34],
      ],
      metal,
      0.035,
    ),
  );
  forms.mail.add(
    line(
      [
        [-1.42, -0.84, 0.34],
        [-0.35, -0.08, 0.36],
      ],
      green,
      0.025,
    ),
  );
  forms.mail.add(
    line(
      [
        [1.42, -0.84, 0.34],
        [0.35, -0.08, 0.36],
      ],
      green,
      0.025,
    ),
  );
  const box = new THREE.BoxGeometry(0.78, 0.78, 0.78);
  for (let i = 0; i < 3; i++) {
    const job = new THREE.Mesh(box, i === 1 ? orange : green);
    job.position.set((i - 1) * 1.12, 0.1, 0);
    job.rotation.y = 0.2;
    forms.queue.add(job);
  }
  for (const z of [-0.48, 0.48])
    forms.queue.add(
      line(
        [
          [-1.8, -0.5, z],
          [1.8, -0.5, z],
        ],
        metal,
        0.04,
      ),
    );
  // Clone materials per form so transitions never change the other models.
  Object.values(forms).forEach((form) => {
    const materials = new Map();
    form.traverse((mesh) => {
      if (!mesh.isMesh) return;
      if (!materials.has(mesh.material)) {
        const material = mesh.material.clone();
        material.transparent = true;
        materials.set(mesh.material, material);
      }
      mesh.material = materials.get(mesh.material);
    });
  });
  let current = "storage",
    previous = null;
  function render(name, phase) {
    if (name !== current) {
      previous = current;
      current = name;
    }
    for (const [key, form] of Object.entries(forms)) {
      const alpha = key === current ? phase : key === previous ? 1 - phase : 0;
      form.visible = alpha > 0;
      form.scale.setScalar(0.86 + 0.14 * alpha);
      form.rotation.y = (1 - alpha) * 0.45;
      form.traverse((mesh) => {
        if (mesh.isMesh) {
          mesh.material.opacity = alpha;
          mesh.material.depthWrite = alpha > 0.95;
        }
      });
    }
  }
  return { root, render };
}
