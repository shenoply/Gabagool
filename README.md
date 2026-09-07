# Wet Whiskers — Build 30: Pip comes home

Play at https://shenoply.github.io/Gabagool/?build=30

Single-file Three.js r128 game, with no build step. Serve `index.html` with `GLTFLoader.js`, `fat-rat.glb`, `bigrat.mp3`, and `opening-scene.webp` alongside it.

## Build 30 — approved animated Pip in game

- Loads the approved `pip-animated.glb` with Idle, Walk, Run and Jump clips. This is the reviewed 28-bone model, including its fur geometry, with no substitute or reshaping.
- One cached download and separate skeleton instances for each scene. Detailed meshes cast no shadows. The title shows download progress and enables Begin/New game when the approved asset is ready; Retry reloads after a download failure.
- Crossfades between idle/walk/run, removes the Jump root-position track so existing game physics control height, and preserves pickup, bite, roll, climbing, cutscene and save behavior. Roll, bite and climbing use small procedural additions to the approved rig.
- Shared model geometry survives scene disposal, and late downloads cannot attach to discarded scenes. Rendering uses sRGB output and painted colour textures are marked sRGB.
- Keep `pip-animated.glb` beside index.html, along with existing GLTFLoader.js, fat-rat.glb, bigrat.mp3 and opening-scene.webp. The model is approximately 13 MB; this release retains the approved detailed asset. Mobile optimization remains future work.

Validation: 24 existing logic/geometry checks plus 6 real-GLB integration checks pass under Three.js r128 with stubbed DOM/WebGL/audio. The reviewed animations were previously rendered after GLB import in Blender. Final live gameplay rendering and touch interaction have not been visually verified because the available browser cannot create a WebGL context.

## Build 29

- Pip's torso, neck, head and limbs now form one connected, smoothly shaded surface: 3,674 vertices / 7,312 triangles, weighted to 13 bones. Facial features, ears, scarf and paws remain attached details. Original mesh generated for this project, embedded directly in index.html; no external model service or download at runtime.
- A subtle procedural fur bump texture, blended colour markings and soft contact shadow. Distance-driven footsteps, reduced arm swing and gentler body bounce. Existing action poses deform the new skin.
- Alley paving uses lower-contrast irregular stones without repeated white highlights. Larger texture coverage plus a single non-repeating dirt/moss wash breaks up the surface. Added instanced wall plants, fallen leaves and dumpster contact shade.
- Cooler sky fill, gentler warm sunlight, and a closer, lower portrait camera.
- Smaller mobile joystick and action group, with at least 48px action targets and responsive joystick centring. Compact settings row.
- Existing opening artwork, neighbour/audio, inventory/save format, crafting and areas retained.

24 logic/geometry checks passed, including normalized skin weights, 13 real bones, connected surface topology checked separately, and CPU skin deformation through walk/run/jump/roll/bite/climb. GPU animation and phone touch interaction remain unverified: the available preview browser cannot create a WebGL context. The title illustration is pre-rendered artwork and does not represent gameplay graphics.

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

Approved GLB SHA-256: d94551a2d15b2d2549aed06038e8fee1c58a5acab29c2cce32ac71de0f190df7


## Build 31 — reference-led junkyard

The main scavenging area now uses an original 3D junkyard built from the owner’s supplied layout reference: teal perimeter fencing, a timber shed, three stepped platforms, crates, tyres, drums and scattered paving. The shed door returns to the existing decorated home; the right gate leads to the courtyard. Pip, dumpster access, Fat Rat and bigrat.mp3 dialogue remain in place.

`junkyard.glb` contains original geometry and procedural colour textures, with meshes combined by material for mobile rendering. Map collision is embedded in index.html. The reference-driven map asset was created for Wet Whiskers; no third-party models or music were added.


## Build 32 — scale, outside home and cartoon salvage

Pip now uses quarter scale outdoors, with the neighbour, cats, crow, boombox and loot resized to match. Outdoor cameras follow closer; pickup and bite ranges fit the smaller character. The yard uses a consistent design scale of one unit per half metre: the rat is about 25 cm upright, drums about 85 cm high. These are gameplay scale targets, not a biological simulation.

Pip’s rat-sized shelter is outside the front fence, connected by a paved path. The former shed site now holds discarded appliances. Added fridge, washing machine, wheelbarrow, cupboard, chair, cable spool, pipes, cones, bottles, tins and pots. Colours are brighter, major props have softened edges, and the loaded map uses Three.js toon materials. Existing saves, crafting and the Fat Rat recording are retained.

Verified JavaScript syntax, gate and fence collision, house approach, platform steps, spawn and fridge collision; inspected actual 3D asset renders. Browser GPU gameplay was not verified in this environment.
