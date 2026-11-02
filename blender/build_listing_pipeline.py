"""Listing pipeline clay — conveyor on Isleo-style three-layer cake base."""
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
    add_ico,
    clay_mat,
    clear_scene,
    export_and_render,
    parent_all,
    setup_camera,
    setup_cycles,
    setup_world_and_light,
    soft_bevel,
)

OUT_BLEND = BLEND_DIR / "listing_pipeline_prototype.blend"
OUT_GLB = CLAY_DIR / "listing-pipeline.glb"
OUT_PNG = CONCEPTS / "listing-blender-proto.png"

# BuyaHabit kit palette — sage machine, gray-lavender rollers, bone frames
PALETTE = {
    "machine": "#9AB694",
    "belt": "#4C565F",
    "roller": "#B3B9C6",
    "frame": "#EAE1CB",
    "rim": "#4C565F",
    "slot_a": "#DE9866",
    "slot_b": "#8FD0DE",
    "slot_c": "#DEBC84",
    "accent": "#DEBC84",
    "knob": "#B3B9C6",
}


def add_pipeline(parts: list[bpy.types.Object]) -> None:
    # Free-floating like the pastel car reference — no cake plinth
    z0 = 0.0
    machine_m = clay_mat("list_machine", PALETTE["machine"])
    belt_m = clay_mat("list_belt", PALETTE["belt"])
    roller_m = clay_mat("list_roller", PALETTE["roller"])
    frame_m = clay_mat("list_frame", PALETTE["frame"])
    rim_m = clay_mat("list_rim", PALETTE["rim"])
    accent_m = clay_mat("list_accent", PALETTE["accent"])
    knob_m = clay_mat("list_knob", PALETTE["knob"])
    slots = [
        clay_mat("list_slot_a", PALETTE["slot_a"]),
        clay_mat("list_slot_b", PALETTE["slot_b"]),
        clay_mat("list_slot_c", PALETTE["slot_c"]),
    ]

    # Side rails
    for name, y in (("RailL", 0.28), ("RailR", -0.28)):
        rail = add_cube(
            name,
            size=(1.35, 0.08, 0.12),
            location=(0.0, y, z0 + 0.08),
            mat=frame_m,
        )
        soft_bevel(rail, width=0.02, segments=2)
        parts.append(rail)

    # Rollers
    for name, x in (("RollerA", -0.55), ("RollerB", 0.55)):
        roller = add_cylinder(
            name,
            radius=0.14,
            depth=0.52,
            location=(x, 0.0, z0 + 0.12),
            mat=roller_m,
            vertices=14,
            rotation=(math.radians(90), 0.0, 0.0),
        )
        parts.append(roller)

    # Belt slab
    belt = add_cube(
        "Belt",
        size=(1.05, 0.42, 0.05),
        location=(0.0, 0.0, z0 + 0.14),
        mat=belt_m,
    )
    soft_bevel(belt, width=0.015, segments=1)
    parts.append(belt)

    # Belt segments (read as tiles)
    for i, x in enumerate((-0.35, -0.12, 0.12, 0.35)):
        seg = add_cube(
            f"BeltSeg{i}",
            size=(0.18, 0.38, 0.02),
            location=(x, 0.0, z0 + 0.17),
            mat=belt_m,
        )
        parts.append(seg)

    # Three picture frames on belt
    for i, (x, sm) in enumerate(((-0.32, slots[0]), (0.0, slots[1]), (0.32, slots[2]))):
        rim = add_cube(
            f"FrameRim{i}",
            size=(0.22, 0.22, 0.05),
            location=(x, 0.0, z0 + 0.22),
            mat=frame_m,
        )
        soft_bevel(rim, width=0.015, segments=1)
        parts.append(rim)
        slot = add_cube(
            f"FrameSlot{i}",
            size=(0.15, 0.15, 0.03),
            location=(x, 0.0, z0 + 0.25),
            mat=sm,
        )
        parts.append(slot)

    # Back housing (sage block)
    house = add_cube(
        "Housing",
        size=(0.45, 0.55, 0.55),
        location=(-0.35, 0.45, z0 + 0.35),
        mat=machine_m,
    )
    soft_bevel(house, width=0.05, segments=2)
    parts.append(house)

    # Vents
    for i, z in enumerate((0.28, 0.38, 0.48)):
        vent = add_cube(
            f"Vent{i}",
            size=(0.04, 0.18, 0.03),
            location=(-0.56, 0.45, z0 + z),
            mat=rim_m,
        )
        parts.append(vent)

    # Signal light
    lamp_base = add_cylinder(
        "LampBase",
        radius=0.08,
        depth=0.04,
        location=(-0.35, 0.45, z0 + 0.64),
        mat=frame_m,
        vertices=12,
    )
    parts.append(lamp_base)
    lamp = add_ico(
        "LampDome",
        radius=0.09,
        location=(-0.35, 0.45, z0 + 0.72),
        mat=accent_m,
        subdivisions=1,
        scale=(1.0, 1.0, 0.85),
    )
    parts.append(lamp)

    # Side control block + joystick
    ctrl = add_cube(
        "Control",
        size=(0.28, 0.28, 0.22),
        location=(0.45, -0.42, z0 + 0.18),
        mat=machine_m,
    )
    soft_bevel(ctrl, width=0.03, segments=2)
    parts.append(ctrl)
    stick_base = add_cube(
        "StickBase",
        size=(0.10, 0.10, 0.06),
        location=(0.45, -0.42, z0 + 0.32),
        mat=knob_m,
    )
    parts.append(stick_base)
    stick = add_cylinder(
        "Stick",
        radius=0.035,
        depth=0.12,
        location=(0.45, -0.42, z0 + 0.40),
        mat=frame_m,
        vertices=8,
    )
    parts.append(stick)
    knob = add_ico(
        "Knob",
        radius=0.07,
        location=(0.45, -0.42, z0 + 0.48),
        mat=frame_m,
        subdivisions=1,
        scale=(1.1, 1.1, 0.7),
    )
    parts.append(knob)

    # Dot accents
    for name, loc in (
        ("DotA", (-0.55, 0.55, z0 + 0.45)),
        ("DotB", (0.55, -0.42, z0 + 0.22)),
    ):
        parts.append(
            add_cylinder(
                name,
                radius=0.04,
                depth=0.03,
                location=loc,
                mat=knob_m,
                vertices=10,
                rotation=(0.0, math.radians(90), 0.0),
            )
        )


def main() -> dict:
    clear_scene()
    parts: list[bpy.types.Object] = []
    add_pipeline(parts)
    root = parent_all(parts, "Listing_Root")
    setup_world_and_light()
    setup_camera(ortho_scale=2.85)
    cam = bpy.context.scene.camera
    aim = Vector((0.0, 0.05, 0.40))
    view_dir = Euler(CAM_ROT).to_matrix() @ Vector((0.0, 0.0, -1.0))
    cam.location = aim - view_dir * 8.0
    setup_cycles()
    return export_and_render(
        root,
        parts,
        blend_path=OUT_BLEND,
        glb_path=OUT_GLB,
        png_path=OUT_PNG,
    )


if __name__ == "__main__":
    print(main())
