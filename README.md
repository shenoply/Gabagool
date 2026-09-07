# Wet Whiskers — Build 28: A little place in the world

Play at https://shenoply.github.io/Gabagool/?build=28

Single-file Three.js r128 game, with no build step. Serve `index.html` with `GLTFLoader.js`, `fat-rat.glb`, `bigrat.mp3`, and `opening-scene.webp` alongside it.

## Build 28

- Rounded original Pip with sculpted body, expressive eyes, scarf, articulated legs and a continuous flexible tail. Distance-driven strides, eased movement, blinking, breathing and secondary ear/scarf motion. Existing jump, roll, bite and climbing actions remain.
- Smoother cat and crow surfaces, softer diffuse environment shading, rounded furnishings, an arched home doorway and a moonlit circular window.
- New original generated opening artwork on the title screen and a slow-moving prologue, fading into the playable 3D flood sequence. The full introduction lasts 32 seconds and can be skipped. The illustration is pre-rendered artwork; gameplay remains real-time Three.js.
- Existing neighbour model and recorded dialogue, crafting, storage, home placement, courtyard and garden are retained. Saves continue using `ww-save`.
- Phone rendering remains capped at 1.5 pixel ratio and 1024 sun shadows; detailed character meshes do not cast shadows.

The changes below describe the retained Build 27 systems. The separate exported cat/crow GLBs remain Build 27 assets; Build 28's smoother models are inline in the game.

## What changed

- The existing big rat and voice recording remain available in the Build 27 portable HTML; the live game loads the original local files. Recorded dialogue begins from a user interaction, avoids overlapping device speech, and stops when muted. A temporary procedural neighbour appears while the original model loads.
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

- Opening illustration: AI-generated original artwork for Wet Whiskers; no third-party character assets added.
- Original neighbour: **The Fat Rat**, Ryan Honey / Raditsys, [creator page](https://sketchfab.com/Raditsys), CC-BY 4.0. The existing project recording `bigrat.mp3` is retained byte-for-byte.
- Three.js r128 and GLTFLoader: Three.js contributors, MIT.
- Pip, procedural environments, new cat and crow: built in code for this project.
- The optional Quaternius rat is not used.

## Validation

22 logic and geometry checks passed using Three.js r128 with stubbed DOM, WebGL renderer and audio. Covers gameplay/save compatibility, the complete intro transition, character geometry and animated action transforms. These checks do not validate GPU rendering, actual sound playback or mobile touch interaction.
