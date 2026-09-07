# Wet Whiskers — Build 27: The neighbourhood

## Play this download

The downloadable bundle contains **wet-whiskers-build-27.html**, which can be opened in a browser. It contains Three.js r128, the GLTF loader, the original Fat Rat GLB and the original `bigrat.mp3` recording. The neighbour and voice no longer depend on separate files beside this HTML. Tap Begin / Come on home before playing sound. Some phone file-preview apps do not run WebGL; use a browser when available.

For GitHub Pages, `index.html` is the smaller source version. Keep `GLTFLoader.js`, `fat-rat.glb` and `bigrat.mp3` alongside it. Build 27 is published on the main branch. Play at https://shenoply.github.io/Gabagool/.

## What changed

- The existing big rat and voice recording are embedded unchanged in the portable HTML. Recorded dialogue begins from a user interaction, avoids overlapping device speech, and stops when muted. A temporary procedural neighbour appears while the original model loads.
- The workbench groups 20 recipes into furniture, lighting and decoration, lists missing parts, puts affordable recipes first, and lets you pin a shopping list.
- Crafting now puts a finished item in Furniture. Place it when ready. Cancelling placement does not lose it. Tap existing furniture to move, store or recycle it; recycling returns the original parts.
- Tap the floor to position a placement ghost; toggle a quarter-unit grid; rotate before confirming. Wall items snap and reject overlaps. Old version-1 saves remain supported; finished furniture is saved in `home.storage`.
- New pieces: spool sofa, teacup fern, button pendant and matchbox bookcase. New finishes: honey oak, woven linen, sage plaster and rose plaster. Cloth gets weave detail; garden soil gets a separate procedural texture. The home has timber details and Pip's nameplate.
- Two playable areas: Laundry Courtyard (cloth, thread, buttons, paper and household parts) and Rain Garden (sticks, cork, teacups, coins and shed finds). Use Areas or the alley's right-hand exit. Both have loot and routes back. Loot refreshes on re-entry, matching the existing endless scavenging loop.
- The sitting cat watches from a fence and swishes its hanging tail. The crow looks around, lifts off when Pip approaches and returns to its perch. The original roaming predator cat remains a separate NPC.
- Existing cutscene, controls, audio station, home decoration and photo mode are retained. Light quality disables shadows and motes; the usual 1.5 pixel-ratio cap and 1024 sun shadows remain.

## Cat and crow assets

| File | Triangles | Animation clips |
|---|---:|---|
| `fence-cat.glb` | 2,811 | Idle |
| `crow.glb` | 2,252 | Idle, Flap |

Original procedural models made for Wet Whiskers. No third-party animal model, texture or recording was added. Both use a colour palette, Y-up, +Z forward, and a feet/perch origin. The cat's tail intentionally hangs below that origin. The GLBs retain named part hierarchies and transform animation clips, not skin/skeleton rigs. The crow's flight path is implemented in the game; its GLB contains the flap animation. The fence/post in the model preview is a display prop, not part of either GLB.

`animal-models.js` contains reusable Three.js r128 constructors (`makeFenceCat`, `makeCrow`). Their returned groups have `.animate(dt)` / `.animate(dt, flying)` methods. The game's copies are inline to preserve the single-file source architecture.

## Credits

- Original neighbour: **The Fat Rat**, Ryan Honey / Raditsys, [creator page](https://sketchfab.com/Raditsys), CC-BY 4.0. The existing project recording `bigrat.mp3` is retained byte-for-byte.
- Three.js r128 and GLTFLoader: Three.js contributors, MIT.
- Pip, procedural environments, new cat and crow: built in code for this project.
- The optional Quaternius rat is not used.

## Validation and limits

20 logic integration checks passed using actual Three.js r128 scene/geometry classes with stubbed DOM, renderer and audio. Covered startup, cutscene transition, neighbour fallback, pickups, distinct area loot, old-save migration, finished crafting, cancellation, placement, moving, storing, recycling, wall overlap, all recipe geometry, shopping lists, animal animation, climbing, exploration photo/map controls, mute and light quality.

All three scripts in the portable HTML parse. Embedded neighbour/audio bytes match the existing files. Exported GLB buffer bounds and animation targets validate. The model preview was rendered directly from the exported mesh geometry with a software depth buffer; it is not a game screenshot.

The session's browser policy prevented local game preview. GPU rendering, actual audio playback, mobile touch layout and browser photo downloads have not been visually/end-to-end verified. Existing browser save data is scoped to the URL/origin used to open the game.

## Next ideas

A crow that trades shiny coins for rare parts; neighbour visits after the home has seating; a dry pantry alcove unlocked by repair materials; small ambient events such as laundry blowing loose. These are ideas, not implemented features, and would keep the game open-ended without compulsory missions.
