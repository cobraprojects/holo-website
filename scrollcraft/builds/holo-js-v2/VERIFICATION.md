# Final launch verification

Verified the built Vite output at http://localhost:4173, not only the development server. Build passed on 2026-10-03.

## Visual evidence

- `evidence/final-desktop.jpg`: reviewed desktop contact sheet, viewport 1440×900.
- `evidence/final-mobile.jpg`: reviewed mobile contact sheet, viewport 390×844.
- `evidence/final-shots.json`: 47 screenshot records, including six positions each for assembly, workflow and lateral modules; opening and +200 px application states, a cross-section handoff frame; framework, comparison and final CTA frames. Screenshot originals reside in the local browser-artifacts directory.
- Also inspected the 360×640 composition and motion-off hero.

The frame review led to corrections: reduce scattered-object spread to keep all modules on screen; lower lighting intensity to retain the brand orange; reserve the application slot and align the object to its actual geometry; keep the object above mobile workflow copy on taller screens; remove simultaneous headline crossfade; constrain mobile workflow grid columns; keep comparison diagrams side by side.

The Three.js scene is one persistent object, rather than swapped illustrations. Hero assembly, application handoff and active workflow-module highlight were observed. The object disappears after those story beats. Module inventory, comparisons and starter remain normal DOM content.

## Behavior

Framework tabs update the actual code sample, accessible panel labeling and starter choice. Native select changes update framework/database flags. Package-manager and optional-module choices produce the corresponding command. Verified a Nuxt/PostgreSQL/pnpm command with events and a SvelteKit/MySQL/bun command after removing auth. Comparison selection and ArrowRight keyboard navigation changed the active panel. API disclosure opened with the relevant documented snippet. Copy failure is truthful: the automation browser denied clipboard access and the site displayed instructions to select and copy. Successful OS clipboard writing was not verified.

Motion-off removes pinned heights and horizontal rail transform, hides the WebGL layer, and displays static locally authored visuals. The native OS media-query preference was not emulated; the explicit motion-off path was verified. No page-wide horizontal overflow was observed at the inspected sizes. Resources in the inspected production page were all local.

## Feel check

Cold-scroll words: assembly, fit, connection, familiarity, choice, clarity, start. Compared with the intended recognition → relief → clarity → confidence → freedom → agency → conviction → momentum: the flow now makes the promised ownership and connected-backend benefits visible, while the API-heavy details are optional. Hero assembly remains the peak and largest span. The closing screen contains the selected command and actionable links rather than fading out.

## Performance and limits

The visual module is dynamically loaded; the main script is about 5.7 KB gzip and the Three.js/model chunk about 143.7 KB gzip. Vite reports a 500 KB uncompressed chunk-size advisory for the 3D chunk. No idle render loop in the custom scene; capped 1.5 pixel ratio; shared block, screw and contact geometry; render only on scheduled scroll/resize changes; static fallback on WebGL failure; reduced-motion startup skips the 3D import.

Desktop collaborative-browser and mobile viewport inspection do not replace a physical phone test. No deployed hosting, real-device GPU or native touch behavior was verified. A recording attempt exceeded the browser evaluation limit and the recording host disconnected; no recording artifact was transferred or claimed. The screenshots above are the visual evidence.

Scrollcraft's engine files were copied unchanged. Bespoke behavior lives in `main.js` and `world.js`. Original rejected-build evidence remains separately retained.

## Wide-screen scrolling and section-order revision

Production build passed after removing the comparison section and making the module pin conditional on measured overflow. At 1920×900, the module section was 788 px tall, the stage position was relative, the rail transform was none, and scrolling 300 px moved the stage by -300 px. Resizing the same page to 1440×900 and 390×900 restored the sticky stage and horizontal rail translation. Resizing back to 1920×900 restored natural flow and cleared the previous rail transform. The module section's immediate next sibling is now `#start`; no broken internal anchors were found. Motion-off and module-to-command updates were rechecked. Earlier comparison screenshots above describe the superseded launch layout.

## Interactive module-tour verification

Production build passed after adding the tour. Reviewed seven desktop and seven mobile form states in `evidence/module-tour-desktop.jpg` and `evidence/module-tour-mobile.jpg`; individual screenshot paths are in `evidence/module-tour-shots.json`. Mobile example and motion-off frames are saved separately. The final storage headline is “Different disks. Same file API.” Older contact frames retain the prior headline.

Verified all nine driver selections: local/public/S3 storage, SQLite/PostgreSQL/MySQL database, sync/database/Redis queue. Each configuration line changed and each displayed application code or migration stayed byte-for-byte unchanged. These are source-backed illustrations, not backend integration tests. Basic local auth, Clerk and WorkOS all remained in one panel and produced the appropriate hosted/local user-to-session path. Realtime updated both browser cards; notifications activated all three channel indicators; mail opened a local preview; the queue progressed to completion. ArrowRight moved both tab selection and keyboard focus. Motion-off hid the shared WebGL layer and exposed the corresponding local SVG. Mobile controls remain reachable while reading through the panel. No global horizontal overflow or broken internal anchors was observed. At 1920 px, the module picker still used natural flow and its next sibling remained `#start`.

All models, fallback vectors and demo logic are local. Seven sculptural groups reuse the existing renderer and share common geometry and per-form materials. Shape transitions use a bounded 420 ms render pass, not an idle animation. Main bundle is about 6.8 KB gzip and the asynchronously loaded Three.js/model chunk about 149.2 KB gzip. The existing uncompressed 500 KB chunk-size advisory remains. No physical phone or native OS reduced-motion emulation was performed.

Portability language follows the local framework docs: database driver changes require driver/connection setup; existing data is not automatically moved. Portable schema methods are shown rather than database-specific SQL. Async database and Redis queues require workers, and database queues require the queue-table migration. Supported queue drivers were verified as sync, database and Redis, with custom driver contracts; no memory/session queue driver was advertised.

## Workflow model alignment correction

The workflow now has an explicit visual column alongside its controls. Model position and size come from that column's measured rectangle, with the vertical anchor relative to the pinned stage. Removed viewport-percentage workflow coordinates and fixed world scale. On mobile, the visual stays beside the stage controls and the explanation spans both columns below them. A static local mark occupies the visual column in motion-off/WebGL fallback mode.

Built production output passed. Reviewed rendered workflow frames at 1920×1200, 2560×1440, 1440×900, 390×844 and 360×640. The H model stayed inside its visual column and aligned with the workflow controls; no page-wide horizontal overflow was observed. Evidence paths are in `evidence/workflow-alignment-shots.json`.

## Framework-fit section revision

Replaced the generic enclosure with a dimensional web deck, arriving H circuit, and backend foundation. Locally drawn SVG Next.js, Nuxt, and Svelte marks appear as selectable controls. All three choices verified: diagram brand, pressed state, native route path, and generated CLI framework match. Exactly one choice remains pressed.

Visual inspection: 1920×1200 desktop, 1440×900 laptop, 390×844 mobile (copy and visual scroll positions), and desktop motion-off. 360×800 also measured with all controls fitting and no page overflow. Evidence saved as framework-fit-*.png. H fits the measured visual slot; motion-off shows the local H logo. Section remains native flow without new pinning. Production build and git diff --check pass. Existing dynamically loaded Three.js chunk warning remains.

## Configured H ending and left-hand return

The same scene object returns at the workflow exit's left-hand position. Final section clipping conceals it behind the inventory; it reveals on the left, moves visibly across, then grows and settles into the right-hand slot. The return uses natural scroll with no added pin or duration. Desktop screenshots show left reveal, crossing, and settled states at 1440×900. 1920×1200 was also inspected with complete arrival reachable at maximum scroll. Mobile 390×844 final state and motion-off fallback verified without overflow. Evidence: starter-h-*.png.

Selection checks: default auth/queue/storage plus foundation models highlighted; removing auth removes its highlight and CLI package; security and forms selections activate their tiles; removing every optional package leaves only the foundation selected. The existing scene materials are reused, final orientation matches workflow ending, and ending UI/fallback use the established dark surface, muted green and orange palette. Build passes; git diff --check passes.

## Shared workflow turn in the final return

The workflow and starter now share one rotation definition. After the left-hand reveal, the starter H visibly turns across the same yaw and roll range as the workflow while traveling right. Earlier hidden exit orientation blends into the initial workflow angle before the reveal. Screenshots at 1440×900 show initial yaw -0.40, crossing +0.10, and settled +0.30; the movement reverses with scroll. Evidence: starter-turn-*.png. Build and whitespace checks pass.

## Final clarified starter motion (supersedes prior rotation passes)

Removed the final pin, stage wrapper, and added scroll span. #start is data-sc-act=flow with a natural measured height of 839px at 1920×1200. Rotation happens during the left-to-right travel: captured mid-return yaw +0.27 and settled yaw -0.25. Final pitch -0.6, yaw -0.25 and roll -0.22 come from the same heroRotation constant as the hero. No rotation continues after arrival. The earlier exit's angles are retained at left reveal, then interpolate during visible travel. Selected faces and command remain synchronized. Screenshots: starter-final-moving.png and starter-final-settled.png. No overflow; build and git diff --check pass.

## Realtime and notification sculpture refinement

Replaced the abstract realtime node cage with three solid browser windows at distinct depths, connected to one orange update block. Beveled frames, inset screens, raised status bars and thick connections make occlusion and thickness visible. Generic Live query labels remain consistent with the separate interactive Draft/Published demonstration. Replaced the faceted closed bell with smooth curved lathe shell geometry, a matching dark inner surface, rolled lip, metal hanging loop, attached clapper and raised three-channel badge. No external asset service or downloaded models. Updated local SVG motion-off counterparts.

Inspected full-motion desktop 1440×1000 and mobile 390×844, plus motion-off mobile versions of both objects. No overflow. Existing material-crossfade transitions remain. Production build and whitespace checks pass. Evidence: module-refinement-*.png.

## Hero vertical centering

Changed desktop heading positioning from top:30% to top:50% with independent translate:0 -50%, preserving the existing scroll transform. Both promise and resolved headings share centering. Mobile and motion-off compositions explicitly reset translate. Browser measurements at 1920×1333: heading and stage centers both 666.5px, delta 0. At 1440×900: heading center 450px. Mobile 390×844 retains top 105px with no overflow. Build and whitespace checks pass. Screenshot: hero-centered-wide.png.

## Hero scroll speed

Halved the active hero animation distance by changing its span from 3.4 to 2.2 viewports: span includes one viewport for the sticky stage, so active travel changes from 2.4 to 1.2 viewports. Browser measured 3199px before and 1600px afterward at 1333px viewport height (integer rounding). Timeline anchors remain derived from section geometry. Build and whitespace checks pass.

## Motion-off hero alignment

The desktop fallback H now shares the hero heading’s vertical center and sits in the right column. Verified at 1920 × 1333 and 1024 × 900: both anchors center at 450px in the 900px static hero. The 390 × 844 mobile composition remains stacked with no horizontal overflow. Production build and `git diff --check` pass.

## Consistent motion-off scenes

Moved the existing hero caption beneath its text when motion is disabled; toggling motion back on restores its animated-scene position. Framework and workflow scenes reuse the starter’s dimensional H markup, preserving its palette and geometry. Workflow card clicks update the matching orange tile (verified Dispatch → QUEUE). Checked 1920 × 1333 and 390 × 844 layouts without horizontal overflow; build and diff checks pass.

## Mobile vertical centering

Mobile hero uses a centered grid for copy, model slot and actions, with the animated H anchored to that slot instead of a fixed 450px position. Workflow content centers vertically with its footer anchored below. Verified full and reduced motion at 390 × 844 and compact 375 × 667; no horizontal overflow or overlapping actions. Build and diff checks pass.
