"""Trail clay — desk compass on Isleo-style three-layer cake base."""
from __future__ import annotations

import math
import sys
from pathlib import Path

import bpy
from mathutils import Euler, Vector

sys.path.insert(0, str(Path(__file__).resolve().parent))
from clay_kit import (  # noqa: E402
    BLEND_DIR,
    CAM_ROT,
    CLAY_DIR,
    CONCEPTS,
    add_cube,
    add_cylinder,
    clay_mat,
    clear_scene,
    export_and_render,
    flat_shade,
    parent_all,
    setup_camera,
    setup_cycles,
    setup_world_and_light,
    soft_bevel,
)

OUT_BLEND = BLEND_DIR / "trail_compass_prototype.blend"
OUT_GLB = CLAY_DIR / "trail.glb"
OUT_PNG = CONCEPTS / "trail-blender-proto.png"

# BuyaHabit kit palette — bone body, slate bezel, terracotta/teal needles
PALETTE = {
    "body": "#EAE2D0",
    "bezel": "#4C565F",
    "face": "#F1EADA",
    "needle_rose": "#DE9866",
    "needle_mint": "#8FD0DE",
    "pin": "#DEBC84",
    "bracket": "#4C565F",
    "rose": "#D9C9AB",
}


def add_compass(parts: list[bpy.types.Object]) -> list[bpy.types.Object]:
    # Free-floating like the pastel car reference — no cake plinth
    z0 = 0.0
    body_m = clay_mat("trail_body", PALETTE["body"])
    bezel_m = clay_mat("trail_bezel", PALETTE["bezel"])
    face_m = clay_mat("trail_face", PALETTE["face"])
    rose_m = clay_mat("trail_rose", PALETTE["needle_rose"])
    mint_m = clay_mat("trail_mint", PALETTE["needle_mint"])
    pin_m = clay_mat("trail_pin", PALETTE["pin"])
    bracket_m = clay_mat("trail_bracket", PALETTE["bracket"])

    for name, x in (("BracketL", -0.28), ("BracketR", 0.28)):
        post = add_cube(
            name,
            size=(0.10, 0.18, 0.32),
            location=(x, 0.0, z0 + 0.16),
            mat=bracket_m,
        )
        soft_bevel(post, width=0.022, segments=2)
        parts.append(post)

    # Pivot starts identity; children use local coords; tip afterward
    pivot = bpy.data.objects.new("CompassPivot", None)
    bpy.context.collection.objects.link(pivot)
    pivot.location = (0.0, 0.0, z0 + 0.36)

    def child(
        obj: bpy.types.Object,
        local: tuple[float, float, float],
        rot: tuple[float, float, float] = (0.0, 0.0, 0.0),
    ) -> None:
        obj.parent = pivot
        obj.location = local
        obj.rotation_euler = rot
        parts.append(obj)

    # Create at origin, then re-home as pivot children (local space)
    body = add_cylinder(
        "CompassBody",
        radius=0.36,
        depth=0.15,
        location=(0.0, 0.0, 0.0),
        mat=body_m,
        vertices=24,
    )
    soft_bevel(body, width=0.028, segments=2)
    child(body, (0.0, 0.0, 0.0))

    bezel = add_cylinder(
        "CompassBezel",
        radius=0.31,
        depth=0.05,
        location=(0.0, 0.0, 0.0),
        mat=bezel_m,
        vertices=24,
    )
    child(bezel, (0.0, 0.0, 0.09))

    face = add_cylinder(
        "CompassFace",
        radius=0.265,
        depth=0.02,
        location=(0.0, 0.0, 0.0),
        mat=face_m,
        vertices=24,
    )
    child(face, (0.0, 0.0, 0.115))

    for name, mat, yaw in (("NeedleN", rose_m, 0.0), ("NeedleS", mint_m, math.pi)):
        bpy.ops.mesh.primitive_cone_add(
            vertices=4,
            radius1=0.075,
            depth=0.24,
            location=(0.0, 0.0, 0.0),
        )
        needle = bpy.context.active_object
        needle.name = name
        needle.scale = (0.45, 1.0, 0.12)
        bpy.ops.object.transform_apply(scale=True)
        needle.data.materials.append(mat)
        flat_shade(needle)
        # Lie flat on face, tip toward yaw
        child(
            needle,
            (math.sin(yaw) * 0.02, math.cos(yaw) * 0.02, 0.14),
            (math.radians(90), 0.0, yaw),
        )

    pin = add_cylinder(
        "NeedlePin",
        radius=0.04,
        depth=0.045,
        location=(0.0, 0.0, 0.0),
        mat=pin_m,
        vertices=10,
    )
    child(pin, (0.0, 0.0, 0.155))

    nmark = add_cube(
        "NMark",
        size=(0.09, 0.06, 0.035),
        location=(0.0, 0.0, 0.0),
        mat=bezel_m,
    )
    soft_bevel(nmark, width=0.008, segments=1)
    child(nmark, (0.0, 0.20, 0.14))

    for i in range(8):
        ang = math.radians(i * 45.0)
        tick = add_cube(
            f"Tick{i}",
            size=(0.028, 0.045, 0.018),
            location=(0.0, 0.0, 0.0),
            mat=bezel_m,
        )
        child(tick, (math.sin(ang) * 0.22, math.cos(ang) * 0.22, 0.135), (0.0, 0.0, ang))

    # Tip whole compass toward camera
    pivot.rotation_euler = (math.radians(-42), 0.0, 0.0)
    return [pivot]


def main() -> dict:
    clear_scene()
    parts: list[bpy.types.Object] = []
    pivots = add_compass(parts)
    export_parts = [o for o in parts if o.type == "MESH"]
    root = parent_all(export_parts + pivots, "Trail_Root")
    setup_world_and_light(intensity=1.12)
    setup_camera(ortho_scale=2.5)
    cam = bpy.context.scene.camera
    aim = Vector((0.0, 0.08, 0.45))
    view_dir = Euler(CAM_ROT).to_matrix() @ Vector((0.0, 0.0, -1.0))
    cam.location = aim - view_dir * 8.0
    setup_cycles(exposure=-0.2)
    return export_and_render(
        root,
        export_parts,
        blend_path=OUT_BLEND,
        glb_path=OUT_GLB,
        png_path=OUT_PNG,
    )


if __name__ == "__main__":
    print(main())
