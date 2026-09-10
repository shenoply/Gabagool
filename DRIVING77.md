Toy car driving — local draft, not published

The supplied Moskvich toy car is reduced to 18,739 triangles, retaining its materials with textures capped at 768px. It loads asynchronously after entering the backyard; it cannot block the Start button.

Approach the car near (4,26), use Drive, then use the existing joystick or WASD. Forward accelerates, backward brakes/reverses, sideways steers. Release to slow down. Horn/H produces an original synthesized two-tone horn; the engine pitch follows speed. Exit stops a moving car first; a second tap exits when a clear position is available. Sound respects mute and pauses when gameplay is inactive.

Four authored clips are embedded into rat-animation-pack67.glb, preserving previous clips and the skeleton: Drive_Idle, Drive_Steer_Left, Drive_Steer_Right, Drive_Honk. They trigger automatically. The controller includes a runtime fallback for an older cached rat pack. Build 78 places the driver in the open cockpit and aligns the hands to the steering wheel with the existing arm bones. Browser visual review remains outstanding.

Validation: complete inline JavaScript syntax check passed; Node tests using the game's actual Three.js version passed for driving, reverse, stopping, exit, restored character scale, clip generation and loop classification. Browser verification could not run: browser executable absent and download returned HTTP 502. No mobile performance or visual alignment claim is made. Collision probes reuse world geometry plus conservative car bounds; the full yard route still needs an in-browser playtest before publication.

Sources: driving77.js is embedded with tools/embed_driving77.py. tools/prepare_car77.py rebuilds the optimized supplied car when the original upload is available. tools/author_driving_clips77.py authors the animation clips on the actual rat rig. tools/test_driving77.cjs runs controller checks.
