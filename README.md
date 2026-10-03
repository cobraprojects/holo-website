# Holo-JS launch site

A visual developer launch page built with the Emil Design Engineering and Scrollcraft skills. One locally modeled 3D Holo circuit assembles, moves into the existing application, then highlights the backend pieces behind a publishing feature. Framework proof, an interactive driver-based module tour, visual module selection, a personalized starter command follow.

All model geometry, textures and SVG illustrations are authored locally. No external asset services, remote fonts or downloaded models.

```sh
npm install
npm run dev
```

Development: http://localhost:5173

```sh
npm run build
npm run preview -- --port 4173
```

Production preview: http://localhost:4173

Semantic HTML, CSS and Vite modules. The unmodified Scrollcraft engine handles pinned stages, entries and the horizontal module rail. A dynamically loaded Three.js scene provides the traveling object. Motion-off and WebGL failure have local static fallbacks.

The framework, database, package manager and selected modules determine the real CLI command. The publishing flow illustrates documented APIs; it does not execute a backend in the browser. Module selection leads directly into installation. The module rail scrolls normally when all cards fit, and pans only when its content overflows.

Current brief, screenshot contact sheets and verification limits: [scrollcraft/builds/holo-js-v2](scrollcraft/builds/holo-js-v2/). The earlier `holo-js` build was rejected and is retained only as history.

The module tour covers storage and its media library, database migrations, authentication (local, sessions/tokens, Clerk and WorkOS), realtime, notifications, mail and queues. Driver controls change configuration while keeping the displayed application code or portable migration unchanged. Seven local solid models share the existing renderer; local SVG fallbacks support motion-off and unavailable WebGL. The browser examples are labeled illustrations, not real backend execution.
