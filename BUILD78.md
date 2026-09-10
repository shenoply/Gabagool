Build 78 — backyard integration review

Implemented
- Weathered grey-blue fencing and four patches of opaque, folded, instanced ivy leaves.
- Uploaded picnic table with climbable bench/table geometry, a rope approach and one-time crumbs.
- Uploaded log stack with climbable surfaces, three collectable sticks and a hidden token.
- Two supplied gnome landmarks, including a one-time hidden button.
- Supplied metallic gate attached to the existing hinge and mission unlock.
- Supplied inflatable pool shell, preserving swimming, ripples, submerged key, floating lid and exit route.
- Supplied stone paths and railing; contextual hanging, lateral movement and jump/drop.
- Imported herb bed, watering can, coiled hose and hollow pot tunnel from the editable design.
- One animated spider guarding a one-time stash. It patrols locally, notices exposed nearby movement, retreats after a tail strike or nearby car horn, and does not pursue across the yard. Rolling/hiding avoids detection.
- Toy car driving and reversing, engine sound, horn, safe exit, cockpit seating, steering-wheel hand contacts, and the four authored driving clips from build 77. Parked car has mesh collision and can be pushed with tail whip.
- Bag capacity enforced before collecting; one-time rewards are persisted.

Layout
The design is applied to the existing mission coordinates, rather than replacing the entire game with the separate 20x18m static concept model. Existing home, crafting, bird transport, pool missions and progression remain connected. Picnic area (14,26), logs (-18,21), pool (-15,33), garden tools (26,33), herb bed (27,29), pot tunnel (18,29), car (4,26). No live deployment has been made.

Asset preparation
See asset-report78.json. The 83 MB pool is approximately 2.5 MB and 20,914 triangles. The toy car is approximately 1.9 MB and 18,739 triangles. Both original spider uploads were identical; only one copy is included. Supplied animations and the spider skeleton are preserved. New scenery downloads are limited to two at a time and cannot block the base game's Start button.

Verification
The shipped Three.js and GLTFLoader loaded all nine scenery files and the car with no load failures in the CPU scene harness. Thirty gameplay ticks completed. Tests cover tabletop support over board seams, pool bottom below water, rail traversal/drop, car entry/travel/exit, one-time reward collection, spider retreat, opening gate, and finite scene transforms. Full JavaScript syntax and the separate driving controller tests pass. Results are in verification78.json.

Limitations
These are scene/logic checks, not WebGL rendering or an Android playtest. The available cloud browser could not reach the local preview (ERR_BLOCKED_BY_CLIENT). Visual finish, final driver posture and mobile frame rate still require browser review before a release claim. No claim is made that the main game has been published.

Rebuild
Run tools/prepare_assets78.py with the supplied uploads available to regenerate lightweight assets. After editing driving77.js or backyard78.js, run tools/embed_driving77.py followed by tools/embed_backyard78.py. The order matters. Run tools/verify_backyard78.cjs using Node with the game's existing Three.js file.
