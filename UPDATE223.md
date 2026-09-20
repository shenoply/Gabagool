Build 223

- One-time reset of saved car parts and fluids. Only essential removed components prevent driving; cosmetic cover ribs do not.
- Entry chooses the nearest door, pauses to open it, adds walking/step-over leg motion, seats Pip (across the bench for passenger-side entry), then closes the doors. Outside camera remains active.
- Cockpit uses filtered original Pip skinned meshes with original materials/UVs; removes the substitute cylinder arms. Restores natural bone lengths. Mirror reach begins with a bounded lean.
- Outside driving disables cabin touch interactions and reach gestures. Ignition, dedicated handbrake and existing drift remain visible.
- Lower, slimmer bonnet; thin arched canvas roof; narrow longitudinal wiper blades instead of thick T-shaped blades.

Validation: CPU full-game regression, both-side entry progression, original arm geometry/material identity, steering contact, post-entry acceleration, reset state and outside mirror lock. Portrait software geometry projection inspected; no mobile/WebGL playtest.
