# Build 220 — interact with the car itself

Removed the covering workshop panel and its menu entries. Saved fluids, supplies and upgrades are retained.

- Walk to a door or the hood: a small nearby action appears. The surfaces also accept direct taps.
- Inside the car, Exit car remains visible. Looking at the driver door handle offers exit and a separate open/close action.
- Tap and drag a mirror to adjust it; camera orbit does not run during the gesture. Done dismisses adjustment. Mirror settings persist.
- Window cranks and the roof latch are actual cabin touch targets.
- With the hood open and engine off, tap a radiator, filter, spark-plug rail or belt to hold it. Carry it, drag within reach, put it down, or tap its outlined slot to refit. Wheels and a brake caliper can also be removed. Loose parts persist in the save. Missing parts interlock driving.
- Tap oil/water fillers to top up from supplies, or the engine block to repair. Upgrade actions appear only for a relevant part when the required supplies are available.
- Small visible parts have expanded touch hit areas, checked against opaque car surfaces for occlusion. Interaction requires proximity outside the car.
- Entering the car immediately selects its tutorial, including when an unfinished service lesson was active. The lesson card is smaller, with expandable instructions. Exiting completes the final car step automatically.
- Driving pose uses an analytic two-joint arm solve with elbows below the shoulders. The original textured paw mesh is reversibly curled into a smaller grip; wrist orientation follows the wheel and thumbs point upward. Normal geometry is restored on exit.

Validation: `WW_EXTRA_TEST=tests/carTouch220-runtime.js node tests/runtime215.cjs` checks tutorial switching, no workshop overlay, visible exit, door-handle targeting, curled-paw restoration, elbow direction, steering reach, holding/dropping/refitting and range gating. The existing build219 checks also pass for service consumption, upgrades, mirrors and cabin animations. An untextured software projection of the actual posed model was inspected; this is not a mobile WebGL screenshot or touch-device play-test.
