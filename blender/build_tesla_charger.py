"""Tesla charging clay — pedestal charger on Isleo-style three-layer cake base."""
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
    add_circle_slab,
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

OUT_BLEND = BLEND_DIR / "tesla_charger_prototype.blend"
OUT_GLB = CLAY_DIR / "tesla-charging.glb"
OUT_PNG = CONCEPTS / "tesla-blender-proto.png"

# BuyaHabit kit palette — bone body, teal glow, terracotta handle, slate dark
PALETTE = {
    "body": "#E6E1D5",
    "dark": "#4C565F",
    "cable": "#B3B9C6",
    "handle": "#DE9866",
    "glow": "#8FD0DE",
    "accent": "#75828C",
}


def add_charger(parts: list[bpy.types.Object]) -> None:
    # Free-floating like the pastel car reference — no cake plinth;
    # the round ChargePad stays as the charger's own ground disc.
    z0 = 0.0
    body_m = clay_mat("tesla_body", PALETTE["body"])
    dark_m = clay_mat("tesla_dark", PALETTE["dark"])
    cable_m = clay_mat("tesla_cable", PALETTE["cable"])
    handle_m = clay_mat("tesla_handle", PALETTE["handle"])
    glow_m = clay_mat("tesla_glow", PALETTE["glow"], emission=0.85, roughness=0.6)
    accent_m = clay_mat("tesla_accent", PALETTE["accent"])

    # Mid circular pad on cake (Tesla concept tier)
    pad = add_circle_slab(
        "ChargePad",
        z_top=z0 + 0.06,
        height=0.06,
        radius=0.42,
        mat=body_m,
        vertices=20,
    )
    soft_bevel(pad, width=0.02, segments=2)
    parts.append(pad)

    # Glow ring
    glow = add_circle_slab(
        "GlowRing",
        z_top=z0 + 0.075,
        height=0.02,
        radius=0.30,
        mat=glow_m,
        vertices=20,
    )
    parts.append(glow)

    # Main body — tall rounded wedge
    body = add_cube(
        "ChargerBody",
        size=(0.38, 0.28, 0.95),
        location=(0.0, 0.0, z0 + 0.55),
        mat=body_m,
    )
    soft_bevel(body, width=0.045, segments=2)
    parts.append(body)

    # Tapered top cap
    cap = add_cube(
        "ChargerCap",
        size=(0.32, 0.24, 0.12),
        location=(0.0, 0.0, z0 + 1.08),
        mat=body_m,
    )
    soft_bevel(cap, width=0.03, segments=2)
    parts.append(cap)

    # Screen inset
    screen = add_cube(
        "Screen",
        size=(0.26, 0.04, 0.42),
        location=(0.0, -0.14, z0 + 0.62),
        mat=dark_m,
    )
    soft_bevel(screen, width=0.015, segments=1)
    parts.append(screen)

    # Charge bars on screen
    for i, z in enumerate((0.52, 0.62, 0.72)):
        bar = add_cube(
            f"Bar{i}",
            size=(0.14 - i * 0.02, 0.02, 0.05),
            location=(0.0, -0.16, z0 + z),
            mat=glow_m,
        )
        parts.append(bar)

    # Handle docked on right
    handle = add_cube(
        "Handle",
        size=(0.10, 0.12, 0.28),
        location=(0.24, -0.02, z0 + 0.55),
        mat=handle_m,
    )
    soft_bevel(handle, width=0.025, segments=2)
    parts.append(handle)
    tip = add_cylinder(
        "HandleTip",
        radius=0.05,
        depth=0.08,
        location=(0.24, -0.08, z0 + 0.42),
        mat=accent_m,
        vertices=10,
        rotation=(math.radians(90), 0.0, 0.0),
    )
    parts.append(tip)

    # Cable loop: body side → down → up into handle
    # Use a curve for a clean clay hose
    curve_data = bpy.data.curves.new("CableCurve", type="CURVE")
    curve_data.dimensions = "3D"
    curve_data.bevel_depth = 0.032
    curve_data.bevel_resolution = 2
    curve_data.resolution_u = 12
    spline = curve_data.splines.new("NURBS")
    pts = [
        (0.16, 0.08, z0 + 0.45),
        (0.34, 0.22, z0 + 0.28),
        (0.42, 0.10, z0 + 0.12),
        (0.36, -0.10, z0 + 0.18),
        (0.26, -0.06, z0 + 0.40),
    ]
    spline.points.add(len(pts) - 1)
    for p, (x, y, z) in zip(spline.points, pts):
        p.co = (x, y, z, 1.0)
    spline.use_endpoint_u = True
    cable_obj = bpy.data.objects.new("Cable", curve_data)
    bpy.context.collection.objects.link(cable_obj)
    mat_slot = cable_obj.data.materials
    cable_obj.data.materials.append(cable_m)
    del mat_slot
    # Convert curve to mesh for GLB
    bpy.context.view_layer.objects.active = cable_obj
    cable_obj.select_set(True)
    bpy.ops.object.convert(target="MESH")
    flat_shade(cable_obj)
    cable_obj.select_set(False)
    parts.append(cable_obj)


def main() -> dict:
    clear_scene()
    parts: list[bpy.types.Object] = []
    add_charger(parts)
    root = parent_all(parts, "Tesla_Root")
    setup_world_and_light(intensity=1.12)
    setup_camera(ortho_scale=2.7)
    cam = bpy.context.scene.camera
    aim = Vector((0.05, 0.0, 0.55))
    view_dir = Euler(CAM_ROT).to_matrix() @ Vector((0.0, 0.0, -1.0))
    cam.location = aim - view_dir * 8.0
    setup_cycles(exposure=-0.2)
    return export_and_render(
        root,
        parts,
        blend_path=OUT_BLEND,
        glb_path=OUT_GLB,
        png_path=OUT_PNG,
    )


if __name__ == "__main__":
    print(main())
