"""Clay laptop storefront and shopping bag for the FLEXI-CASA case study."""
from __future__ import annotations

import math
import sys
from pathlib import Path

import bpy

sys.path.insert(0, str(Path(__file__).resolve().parent))
from clay_kit import (
    BLEND_DIR, CLAY_DIR, CONCEPTS, add_cube, add_ico, clay_mat,
    clear_scene, export_and_render, flat_shade, parent_all, setup_camera,
    setup_cycles, setup_world_and_light, soft_bevel,
)


def main():
    clear_scene()
    parts = []
    mats = {key: clay_mat('storefront_' + key, color) for key, color in {
        'shell': '#DFD5C3', 'edge': '#B9B3AA', 'screen': '#6A7882',
        'paper': '#F4EFE3', 'mint': '#9FC9B5', 'coral': '#D99C78',
        'keys': '#B6B5AC', 'ink': '#839591', 'bag': '#E7B88D',
    }.items()}

    def box(name, size, pos, material, bevel=0.015):
        obj = add_cube(name, size=size, location=pos, mat=mats[material])
        if bevel:
            soft_bevel(obj, width=bevel, segments=2 if bevel > 0.02 else 1)
        parts.append(obj)
        return obj

    # Open laptop: the display faces -Y, matching the shared studio camera.
    box('LaptopBase', (1.18, 0.76, 0.09), (-0.16, -0.02, 0.07), 'shell', 0.035)
    box('LaptopLid', (1.18, 0.09, 0.83), (-0.16, 0.30, 0.51), 'shell', 0.03)
    box('DisplayInset', (1.05, 0.022, 0.70), (-0.16, 0.245, 0.51), 'screen', 0.012)
    box('BrowserPage', (0.98, 0.012, 0.62), (-0.16, 0.226, 0.51), 'paper', 0.01)
    box('BrowserBrand', (0.23, 0.012, 0.028), (-0.45, 0.211, 0.76), 'ink', 0.004)
    for i in range(3):
        box(f'BrowserNav{i}', (0.075, 0.012, 0.012), (0.04 + i * 0.10, 0.211, 0.76), 'ink', 0.002)

    # A physical, layered product detail page rather than a baked screenshot.
    box('ProductTile', (0.48, 0.014, 0.40), (-0.37, 0.209, 0.49), 'mint', 0.015)
    paddle = add_ico('ProductPaddle', radius=0.13, location=(-0.37, 0.178, 0.53), mat=mats['coral'], subdivisions=1, scale=(0.8, 0.16, 1.0))
    parts.append(paddle)
    box('ProductGrip', (0.038, 0.036, 0.14), (-0.37, 0.178, 0.39), 'paper', 0.008)
    for i, width in enumerate((0.28, 0.21, 0.25)):
        box(f'ProductCopy{i}', (width, 0.014, 0.024 if i == 0 else 0.014), (0.07, 0.208, 0.64 - i * 0.065), 'ink', 0.003)
    box('AddToCart', (0.29, 0.018, 0.085), (0.075, 0.205, 0.37), 'coral', 0.013)
    box('CartButtonMark', (0.15, 0.012, 0.012), (0.075, 0.190, 0.37), 'paper', 0.002)

    # Large, simple keys remain readable at thumbnail size.
    for row in range(3):
        for col in range(6):
            box(f'Key{row}_{col}', (0.12, 0.065, 0.012), (-0.55 + col * 0.155, 0.13 - row * 0.10, 0.123), 'keys', 0.004)
    box('Trackpad', (0.30, 0.15, 0.008), (-0.16, -0.245, 0.12), 'edge', 0.012)

    # Bag pieces share a naming convention for the runtime hover rig.
    box('Bag_Body', (0.40, 0.29, 0.45), (0.65, -0.08, 0.32), 'bag', 0.03)
    box('Bag_FrontLabel', (0.23, 0.018, 0.17), (0.65, -0.235, 0.33), 'paper', 0.018)
    box('Bag_LabelMark', (0.10, 0.012, 0.065), (0.65, -0.251, 0.33), 'mint', 0.008)
    for name, y in (('Front', -0.16), ('Back', 0.0)):
        bpy.ops.mesh.primitive_torus_add(
            major_radius=0.105, minor_radius=0.019, major_segments=12,
            minor_segments=5, location=(0.65, y, 0.57),
            rotation=(math.pi / 2, 0, 0),
        )
        handle = bpy.context.active_object
        handle.name = f'Bag_Handle{name}'
        handle.data.materials.append(mats['ink'])
        flat_shade(handle)
        parts.append(handle)

    root = parent_all(parts, 'Storefront_Root')
    setup_world_and_light(intensity=1.0)
    setup_camera(ortho_scale=2.4)
    setup_cycles(exposure=-0.2)
    return export_and_render(
        root, parts,
        blend_path=BLEND_DIR / 'storefront_prototype.blend',
        glb_path=CLAY_DIR / 'storefront.glb',
        png_path=CONCEPTS / 'storefront-blender-proto.png',
    )


if __name__ == '__main__':
    print(main())
