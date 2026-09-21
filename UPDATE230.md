# Wet Whiskers — build 230

- Twenty original mint charm silhouettes, hidden in yard clutter, along the city approach, and in remote sewer branches. Persistent collection, environmental clues, and an equip selection in the restoration journal. Found charms hang from the existing car mirror.
- Ten classical vinyls redistributed across surface and sewer locations. Removed exact record map pins and coordinate clues; shortened pickup range and added weathered cover clutter. Existing collection progress and recording licences preserved. Music remains opt-in.
- Car charm motion uses bounded, damped pendulum integration responding to actual acceleration and steering.
- Home floor increased from 12 × 9 to 16 × 12. Flood-damaged floor and wall boards, dark subfloor gaps, exposed framing and preserved doorway. Existing furniture and supplies retained.
- Sixty separately repaired boards, including thirty-six paintable wall boards. One plank and nail per repair; one paint dose per board. Four paint colours. Progress saved per board.
- Axe, hammer, saw and paintbrush recipes. Eight finite fallen-branch resources with nine harvesting actions each. One branch yields four planks at a workbench with a saw. Foil yields six fixings with a hammer. Water, sap and leaves yield six paint doses.
- Contextual working prompt and original-rat work animations with a hand-following tool. Grab remains available to doors, furniture and salvage. Craft/Home menus link to the restoration guide.

Design direction: Grounded's found-material survival crafting plus House Flipper 2's gradual renovation, using original designs rather than copied assets.

Validation: `WW_EXTRA_TEST=tests/homestead230-runtime.js node tests/runtime215.cjs` checks collection counts, reachable surface placements and valid sewer floors, tool prerequisites, harvesting, real workbench recipe output, individual repair/paint consumption and persistence. Baseline city/car/sewer round trips also execute. CPU scene/logic verification only; mobile WebGL appearance and frame rate require an actual device check.
