# Build 231 — mobile usability and guided tools

- Compact car HUD: engine and handbrake have 44px touch targets; one Cockpit button toggles hands cockpit/outside. Removed the separate Outside view button and obsolete camera tutorial tasks. Completed car lessons no longer reopen after the entry animation. Speed readout sits above the control cluster.
- Modal menus exclusively own interaction: unrelated HUD, joystick, actions, map, contextual prompts and tutorial overlays are hidden while the menu is open. Normal controls return on close.
- Repair/chop prompts use concise labels, system typography and a fixed compact position away from the right action pad.
- Eleven-step tools practice: finite starter supplies, actual axe recipe, marked fallen branches, hammer, existing yard workbench, saw, plank recipe, board repair, brush, paint, painting. Recipe links open directly; progress checks actual ownership/actions. Pause/resume/replay supported. The foot tutorial cannot interrupt it.
- Recipe descriptions explain each tool's concrete use. Starter supplies transfer only up to bag capacity and cannot be duplicated.
- Home grounded in a garden with stone foundation, soil, path, fence, trees and fogged horizon. Damaged boards use darker wood grain; repaired boards and paint retain their saved state.

Validation:
- CPU scene/logic tests: baseline city, car and sewer interactions; tools tutorial progression; finite supplies; axe crafting; home environment; menu state.
- Real Chromium with software WebGL at 412×820 and 360×740: page loads, no page errors, crafting menu isolation, car HUD viewport bounds, removed duplicate view button and axe crafting through the actual Make button.
- Inspected rendered home, car, tool tutorial and recipe screenshots. This caught an unsupported ground texture, a speed-label overlap and generic tool descriptions; all corrected.
- Headless testing does not establish Android device frame rate. Browser package and binary are test-environment dependencies, not shipped assets.
