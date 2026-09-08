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


## Build 33 — Zaytona follows Pip

Zaytona uses the owner-provided Meshy_AI_Zaytona_biped model and its Walking and Running animations. Both animations share one GLB mesh/texture set. A held pose supplies idle; the biped movement is retained from the supplied asset. Credit: owner-provided Meshy model and animations.

She spawns with Pip in the junkyard, courtyard and garden, follows at roughly two game units, catches up when farther away, and pauses facing Pip. Ground navigation routes around scenery and through gates; she stays on the ground while Pip climbs. The previous attacking cat loop is disabled. Indoor scenes retain their existing behaviour; Zaytona rejoins on returning outside. Existing saves and Fat Rat audio are unchanged.

Validation: actual Three.js r128 GLB parsing and animation evaluation, posed-skin scale measurement, finite skeleton transforms, obstacle/gate navigation and a simulated follow-and-stop sequence. Browser GPU gameplay was not available for verification.

## Build 34 — new Pip and ambient Zaytona

Pip now uses the owner's supplied Meshy merged-animation character. All 14 source clips remain in the asset. Gameplay selects idle, walk, run, sprint, jump and upward/downward climbing where appropriate; root travel is controlled by game physics. Roll and bite retain procedural action overlays because the supplied pack has no dedicated clips for those actions. Door, pushing and failed-climb clips are retained for future matching interactions rather than playing them at unrelated moments.

Zaytona now wanders between nearby camera-preferred destinations, completes her route and pauses for an activity. She uses Walking, Confident Walk, Confident Strut, Crawl and Look Back, and Don't You Dare, plus a held standing idle. There is no chase, attack or catch-up sprint. Sitting is omitted because the current routes have no validated seats. Shared geometry/textures keep the five-clip cat download near 8.2 MB.

Pip and Zaytona models and animation packs supplied by the project owner (Meshy). Existing Fat Rat creator credit and audio remain unchanged.

Validation: Three.js r128 parsed both GLBs; animated skinning, Pip grounding/scale and seven gameplay clips checked; a five-minute stationary-player simulation exercised all six Zaytona states without blocked-cell intersections. JavaScript syntax checked. Browser rendering and mobile performance were not verified in this environment.

## Build 35 — facing, contextual climbing and full animation mapping

Corrects the owner-reported inverted Pip facing by rotating the imported visual 180 degrees, retaining movement controls and physics direction.

Nearby junkyard surfaces and courtyard props offer Up, Down, Left, Right and Let go controls. Hold touch buttons, or attach with E and use movement keys/joystick. Jump releases the grip. Climbing supports sideways movement, descent, platform top-out and returning down from edges. Candidate positions and sideways paths reject overlapping props; very smooth refrigerator sides trigger the failed attempt animation. Climb controls pause with photo mode, hidden tabs and modals. Home transitions play the door animation.

All 13 substantive clips now have contextual mappings: Idle_4 (idle), Walking, Running, Run_03 (initial jog), Lean_Forward_Sprint_inplace (sustained sprint), Regular_Jump, climbing_up_wall, climbing_down_wall, both Climb_Left clips (traverse/grip adjustment), Climb_Attempt_and_Fall_5 (slippery failure), Push_and_Walk_Forward (blocked pushing), open_door_3 (door interaction). The one-frame clip0 reference pose is intentionally not played as an action. Movement remains physics-driven; root translation is removed from climbing clips. Native roll/bite clips were not supplied, so these remain procedural overlays.

Validation: JavaScript syntax, Three r128 parsing/skinning for all 13 mapped clips, outdoor scale and grounding, wall attach/up/sideways/down/top-out/descent/failure/photo-pause checks. Zaytona's existing ambient behavior remains. No browser GPU or mobile playtest was available; the facing correction follows the owner's live observation.

## Build 36 — pocket crafting and garden scavenging

Adds an original 3×3 shapeless crafting grid with manual ingredient selection/removal, recipe auto-fill, missing-material hints, batch crafting and shopping-list pinning. Grid slots are a preview: inventory is consumed only after a validated craft. Crafting is accessible from the top Craft button as well as the home recipe panel. Existing furniture recipes remain available; crafted furniture goes to home storage.

Adds plant fibre, leaf scraps, pebbles, sap, dew and acorn shells, plus braided twine, a permanent pebble-axe unlock, a placeable scrap workbench, leaf hammock, amber lantern, acorn seat and dew refreshment. Advanced garden furniture requires a workbench placed at home. Nature recipes become known through collecting their ingredients. Sap requires the axe; harvest nodes regrow after 75 active seconds. Dew refreshment provides a visible 60-second running boost. Oversized foliage and harvest nodes appear in the rain garden and outside the junkyard. All geometry is original procedural art; no Minecraft or Grounded assets are used.

Existing ww-save v1 inventories and homes migrate with empty discovery/tool fields; newly learned materials and tools autosave. Character models, climbing, Zaytona, Fat Rat and audio remain in place.

Validation: JS syntax; grid matching; batch accounting/output; permanent-tool and placed-workbench gates; legacy furniture crafting; discovery; procedural asset creation; harvest gating, yields, duplicate prevention and regrowth. Browser/mobile rendering has not been verified in this environment.

## Build 37 — camera, survival, useful home stations and wildlife

The owner's supplied rat photograph is now a framed collectible called **Working From Home**, highlighted beside Pip's normal starting position at (1.65, 28.55). It is within pickup distance immediately on entering the junkyard. Grab it once, then place it on any available home wall from Furniture. Its collected flag and storage/placement state autosave; recycling returns this unique picture to storage. Resuming an existing home save can find it by going outside.

Gameplay camera: drag empty scene space to orbit, pinch or scroll to zoom, or use +/− and Reset view. Movement follows the camera's horizontal direction. House taps still select/place furniture; dragging does not trigger those taps. Camera obstruction checks shorten the view against mapped walls/props. Touch controls remain independent, and camera buttons move above the climbing controls when those appear.

Survival: slowly declining hunger and thirst during active scavenging, a running/climbing energy meter, food/drink consumption through Supplies, gentle low-supply warnings and restricted running at very low needs. Needs pause at home, in menus/photo mode, during dialogue and when the tab is hidden. No offline depletion or inventory-loss death. Bread crumbs, seeds, berry pieces and dew are available close to the starting gate and in the other outdoor areas. All needs autosave in the existing ww-save v1 home data.

Useful home stations: a pantry stores food and raw materials and supplies crafting/finish purchases while home; a cooking station makes nourishing seed stew; a leaf collector accumulates up to six clean-water portions while exploring; a bed/hammock/sofa restores energy. The leaf backpack raises collecting capacity from 60 to 120 parts. Existing oversized inventories are retained. Crafting gains Tools/Furniture/Food/Materials categories, generated 3D recipe thumbnails using the existing renderer, station checks and pantry-aware ingredient counts and spending.

Wildlife: the supplied animated crow now perches on its own bin, plays its native take-off animation, flies a short route and occasionally uncovers a coin. **Crow** by Alexei Ostapenko: [original source](https://sketchfab.com/3d-models/crow-d5a9b0df4da3493688b63ce42c8a83e2), [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/). Runtime changes: scale normalization and root-translation removal for the game flight path. **Rowan** is an original procedural four-legged raccoon with eye mask, ringed tail and animated walking/resting/rummaging poses. He becomes active at dusk and trades two bread crumbs for two strings, with a one-minute restock. Lighting warms through the active-play day cycle. The owner-uploaded COTW-ripped raccoon was inspected but is not included. Existing Zaytona, Fat Rat and bigrat.mp3 remain.

Validation: full game script executed with actual Three r128 geometry/skinning and native asset parsing, a stub renderer and Canvas2D textures; tested startup pickup, unique collectible persistence, wall placement, food/drink, active/home survival, pantry/cooking transactions, menu construction, save reloads, wildlife loop, area/dumpster transitions, camera-relative movement, obstruction math, drag/pinch/cancel handlers. JavaScript syntax passed. This is logic/model verification: the cloud browser's WebGL context creation fails even on the prior live build, so GPU rendering, gesture feel and phone performance have not been visually playtested.

## Build 38 — clearer crafting, 100 finds and a larger playable dumpster

Removed Rowan the raccoon, his procedural model/behaviour and trading. Zaytona, the licensed crow, Fat Rat and the starting framed rat picture remain.

Crafting is redesigned as a searchable recipe browser with category tabs, selected-item preview, compact ingredient counts and a fixed action footer. Close is available in the footer and as a labelled top-right ×; Escape also closes menus. The 3×3 recipe is an optional view. The Your items tab lets owned finds be inspected, placed at home or reclaimed into crafting materials. New tool previews depict the axe, scissors and crowbar.

Adds exactly 100 named collectible salvage items across metal, glass, kitchen, paper, fabric, wood, toys, electronics, garden and stone families. Every find has a procedural model, can decorate the home and can be reclaimed into a useful existing material. All 100 appear in the enlarged dumpster, alongside 12 core supplies: 112 actual pickups, replacing the old non-collectible junk heaps. The exterior dumpster is scaled by 1.3; the interior expands from 9×6 to 20×14 units. Ramp height, lid entry, handles, body collision, camera lid obstruction and Zaytona's navigation footprint are updated accordingly.

Earlier ideas now implemented in this release: additional planters/flowers and findable objects around the map; picnic/toy/flowerpot scenes in the garden; axe/scissors/crowbar resource interactions; a crowbar-gated rain drain under the garden with 25 finds, a nest and an unlockable route home. Outdoor rain makes puddles grow, fills the water collector faster, wets Pip and sends animals toward shelter; home dries him. Zaytona rests between outings and the crow carries a shiny find during flight. Furniture styling supports size, height, tint and stacking on tables/shelves, persisted in saves. Packed lunches and garden broth provide distinct nutrition benefits.

**Little Whiskers Waltz** is a new original classical-style piano composition/performance synthesised in Web Audio. Toggle it with Piano at the top. It has bounded voices, pauses scheduling/cleans up while hidden or muted and yields to the radio. No third-party music recording is included: a public-domain composition does not automatically make every recording free to redistribute.

Validation: JS syntax; real Three r128 assets/geometry with a renderer stub and Canvas2D texture generation; full-game startup and save flow; 100 unique IDs; all 112 unique dumpster pickups; menu closing; reclaiming; tool-gated drain and home shortcut; wet/dry weather; furniture stack/scale; enlarged ramp ascent; camera gestures/collision; survival and station crafting regressions. A separate simulated audio-clock test checked one minute of piano scheduling, a peak of 33 simultaneous oscillators and cleanup on hide/off. The cloud browser's WebGL failure still prevents a rendered phone playtest; visual layout and feel need checking on a supported device.

## Build 39 — quiet home, lived-in salvage
- Home crafting/decoration panel has Hide menu and a persistent Decorate home toggle; it starts closed. Starting placement reopens the controls. Escape closes it and cancels placement safely.
- Dumpster pickups no longer rotate. 126 collectible pieces sit on the floor in seven irregular groups, including collectible cardboard liners and tipped cans, with walking gaps.
- Original canvas-painted, non-repeating ground for the junkyard, garden, courtyard and dumpster: dirt washes, worn paths, wheel ruts, cracks, broken paving and instanced leaf litter.
- Existing owner-supplied Pip and Zaytona models retained. Licensed crow flies between nearby perches using its native animation, lands before leaving shiny loot, and flies to rain shelter instead of teleporting.
- Discoverable picnic supplies and nests persist as searched in the save. Cooked meals and packed lunches reduce stamina use for three minutes of active exploration.
- Raccoon remains removed. Earlier tool interactions, rain drain, home shortcut, rain collector, home styling and original piano soundtrack retained.
- Validation: full Three.js/canvas logic harness including home hide/reopen and save, grounded non-spinning pickups, discoveries, meal benefit and crow travel. The browser environment has no WebGL context, so this is not a completed GPU/mobile visual playtest.

## Build 40 — picture-led workshop and planted map
- Crafting now has three clear screens: eight illustrated recipe cards per page; an ingredient detail screen with explicit Have/Need/Find more labels and gathering hints; then a success screen with Place it now for furniture made at home.
- One Make action, category/search/ready filters, a required-station link, recipe Back and Close controls. Removed the confusing 3×3 blueprint and the competing home recipe strip; the home panel now opens the same workshop.
- Found objects remain accessible in Supplies → Found treasures for placement or reclaiming materials.
- Added instanced swaying foliage, coloured flowers, collectible forage among vegetation, irregular stone footpaths, warmer ground pigments and three bottle lanterns at the junkyard gate. Existing animals, audio, save format and gameplay retained.
- Verified with the real Three.js/canvas logic harness, including browse/detail/craft/success and prior regression checks. GPU rendering is unavailable in the test browser, so mobile visual quality still requires an in-game check.
