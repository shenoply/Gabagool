# Build 219 — roadster controls and practice

- Reduced pointer camera sensitivity by about 30%; softened outside-car camera turns.
- Resized and repositioned the steering wheel, corrected the steering column, moved Pip's seated pelvis slightly forward, and aligned wrists to the moving rim. Mirror adjustment uses a reach across the bench and a bracing paw. The supplied rat rig has wrist joints, but no individual finger joints.
- Replaced instant target-speed motion with acceleration, rolling resistance, drag, service brakes, a short stop before reverse, speed-dependent steering, and a lateral-acceleration limit. The yaw calculation uses the [kinematic bicycle model](https://www.mathworks.com/help/robotics/ref/bicyclekinematics.html) and the model's actual 1.029-unit wheelbase. This is an accessible driving model, not a full suspension or tyre simulation.
- Cabin workshop: animated driver/passenger doors, rising side windows, folding canvas roof, opening hood and visible engine. Doors close after entering and open on exit. The hood, doors and moving roof interlock driving.
- Mirror sliders adjust both the visible mirror and its rendered view; positions persist with the save.
- Persistent oil, cooling water, temperature and engine condition. Three roadside supply crates respect bag capacity and save collected contents. Oil/water top-ups and repairs consume supplies; opening a hot coolant system is blocked. Engine, cooling, tyre and brake upgrades have actual driving effects and consume their listed parts.
- First-use contextual practice on foot, in the car and in the sewer; workshop service practice on first opening it outside the car. Progress requires the relevant action, then Next. Pause preserves unfinished progress. Menu → Tutorial provides the complete written guide and repeatable practice chapters.

Controls: car controls → Cabin → Roof · doors · mirrors · engine. On foot, Actions → Car workshop when nearby. Stop the engine and stand at the front with hood open for service.

Validation:
- `node tests/vehiclePhysics219.cjs`: acceleration, brake/reverse, coasting, cornering limit, interlock and 30/120Hz consistency.
- `WW_EXTRA_TEST=tests/vehicle219-runtime.js node tests/runtime215.cjs`: shipped Three.js and real character model, wheel contact at centre and both steering locks, mirror reach, hinges, roof/windows, maintenance consumption, upgrade effect, tutorial gating/resume, plus existing city and sewer integration checks.
- These are CPU scene/logic checks with a fake renderer. They do not replace a mobile WebGL visual or handling play-test.
