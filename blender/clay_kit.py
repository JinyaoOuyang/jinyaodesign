"""Shared clay kit for portfolio Selected Work dioramas.

Style lock: Isleo hex — matte Principled, equal three-layer cake bases,
ortho Cycles preview on cream site bg.
"""
from __future__ import annotations

import math
import os
from pathlib import Path

import bpy
from mathutils import Euler, Vector

REPO = Path("/Users/katherine/jinyaodesign")
CLAY_DIR = REPO / "public" / "work" / "clay"
CONCEPTS = CLAY_DIR / "concepts"
BLEND_DIR = REPO / "blender"

RENDER = 1024
CAM_ROT = (math.radians(54.0), 0.0, math.radians(45.0))
CAM_AIM = Vector((0.0, 0.0, 0.0))

# Isleo cake bands — shared silhouette language across all four objects
CAKE_TOP_H = 0.21
CAKE_MID_H = 0.20
CAKE_BOT_H = 0.21
CAKE_TOP_Z = 0.30

# Shared earth cake palette (Isleo lock)
CAKE = {
    "top": "#6A8E2C",
    "mid": "#C4A86E",
    "bot": "#5A3010",
}


def hex_to_rgba(hex_color: str, alpha: float = 1.0) -> tuple[float, float, float, float]:
    """Decode sRGB hex to LINEAR rgb — Base Color sockets and glTF export
    are linear, so skipping this washes every color out in the browser."""
    h = hex_color.lstrip("#")

    def lin(c: float) -> float:
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

    return tuple(lin(int(h[i : i + 2], 16) / 255.0) for i in (0, 2, 4)) + (alpha,)


def darken(hex_color: str, factor: float) -> str:
    h = hex_color.lstrip("#")
    rgb = tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))

    def lin(c: float) -> float:
        c /= 255.0
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

    def srgb(c: float) -> float:
        c = max(0.0, min(1.0, c))
        v = c * 12.92 if c <= 0.0031308 else 1.055 * c ** (1 / 2.4) - 0.055
        return max(0, min(255, round(v * 255)))

    return "#%02X%02X%02X" % tuple(srgb(lin(c) * factor) for c in rgb)


def clear_scene() -> None:
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for coll in (bpy.data.meshes, bpy.data.materials, bpy.data.cameras, bpy.data.lights):
        for block in list(coll):
            if block.users == 0:
                coll.remove(block)


def clay_mat(
    name: str,
    hex_color: str,
    *,
    roughness: float = 0.85,
    specular: float = 0.08,
    subsurface: float = 0.06,
    edge_bevel: float = 0.012,
    emission: float = 0.0,
) -> bpy.types.Material:
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    mat.diffuse_color = hex_to_rgba(hex_color)
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    bsdf = nodes.get("Principled BSDF")
    if not bsdf:
        return mat
    bsdf.inputs["Base Color"].default_value = hex_to_rgba(hex_color)
    bsdf.inputs["Roughness"].default_value = roughness
    if "Specular IOR Level" in bsdf.inputs:
        bsdf.inputs["Specular IOR Level"].default_value = specular
    elif "Specular" in bsdf.inputs:
        bsdf.inputs["Specular"].default_value = specular
    if "Subsurface Weight" in bsdf.inputs:
        bsdf.inputs["Subsurface Weight"].default_value = subsurface
        if "Subsurface Radius" in bsdf.inputs:
            bsdf.inputs["Subsurface Radius"].default_value = (0.4, 0.2, 0.1)
    elif "Subsurface" in bsdf.inputs:
        bsdf.inputs["Subsurface"].default_value = subsurface
    if emission > 0:
        key = "Emission Color" if "Emission Color" in bsdf.inputs else "Emission"
        if key in bsdf.inputs:
            bsdf.inputs[key].default_value = hex_to_rgba(hex_color)
        if "Emission Strength" in bsdf.inputs:
            bsdf.inputs["Emission Strength"].default_value = emission
    if edge_bevel > 0:
        bevel = nodes.new("ShaderNodeBevel")
        bevel.samples = 4
        bevel.inputs["Radius"].default_value = edge_bevel
        bevel.location = (-280, -120)
        links.new(bevel.outputs["Normal"], bsdf.inputs["Normal"])
    return mat


def flat_shade(obj: bpy.types.Object) -> None:
    for poly in obj.data.polygons:
        poly.use_smooth = False
    obj.data.update()


def soft_bevel(obj: bpy.types.Object, width: float = 0.03, segments: int = 2) -> None:
    if bpy.context.mode != "OBJECT":
        bpy.ops.object.mode_set(mode="OBJECT")
    for o in bpy.context.selected_objects:
        o.select_set(False)
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bev = obj.modifiers.new(name="Bevel", type="BEVEL")
    bev.width = width
    bev.segments = segments
    bev.limit_method = "ANGLE"
    bev.angle_limit = math.radians(40)
    bev.affect = "EDGES"
    bpy.ops.object.modifier_apply(modifier=bev.name)
    obj.select_set(False)
    flat_shade(obj)


def add_cylinder(
    name: str,
    *,
    radius: float,
    depth: float,
    location: tuple[float, float, float],
    mat: bpy.types.Material,
    vertices: int = 16,
    rotation: tuple[float, float, float] = (0.0, 0.0, 0.0),
) -> bpy.types.Object:
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=vertices,
        radius=radius,
        depth=depth,
        location=location,
        rotation=rotation,
    )
    obj = bpy.context.active_object
    obj.name = name
    obj.data.materials.append(mat)
    flat_shade(obj)
    return obj


def add_cube(
    name: str,
    *,
    size: tuple[float, float, float],
    location: tuple[float, float, float],
    mat: bpy.types.Material,
    rotation: tuple[float, float, float] = (0.0, 0.0, 0.0),
) -> bpy.types.Object:
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=location, rotation=rotation)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = size
    bpy.ops.object.transform_apply(scale=True)
    obj.data.materials.append(mat)
    flat_shade(obj)
    return obj


def add_ico(
    name: str,
    *,
    radius: float,
    location: tuple[float, float, float],
    mat: bpy.types.Material,
    subdivisions: int = 2,
    scale: tuple[float, float, float] = (1.0, 1.0, 1.0),
) -> bpy.types.Object:
    bpy.ops.mesh.primitive_ico_sphere_add(
        subdivisions=subdivisions,
        radius=radius,
        location=location,
    )
    obj = bpy.context.active_object
    obj.name = name
    if scale != (1.0, 1.0, 1.0):
        obj.scale = scale
        bpy.ops.object.transform_apply(scale=True)
    obj.data.materials.append(mat)
    flat_shade(obj)
    return obj


def add_circle_slab(
    name: str,
    *,
    z_top: float,
    height: float,
    radius: float,
    mat: bpy.types.Material,
    vertices: int = 24,
) -> bpy.types.Object:
    return add_cylinder(
        name,
        radius=radius,
        depth=height,
        location=(0.0, 0.0, z_top - height * 0.5),
        mat=mat,
        vertices=vertices,
    )


def add_rounded_box_slab(
    name: str,
    *,
    z_top: float,
    height: float,
    size_xy: tuple[float, float],
    mat: bpy.types.Material,
    bevel: float = 0.04,
) -> bpy.types.Object:
    obj = add_cube(
        name,
        size=(size_xy[0], size_xy[1], height),
        location=(0.0, 0.0, z_top - height * 0.5),
        mat=mat,
    )
    soft_bevel(obj, width=bevel, segments=2)
    return obj


def add_cake_circle(
    *,
    radius: float = 0.85,
    top_z: float = CAKE_TOP_Z,
    colors: dict[str, str] | None = None,
    prefix: str = "CAKE",
) -> list[bpy.types.Object]:
    """Three equal bands — circular footprint (Trail / Tesla pad)."""
    cols = colors or CAKE
    overlap = 0.004
    top_m = clay_mat(f"{prefix}_top", cols["top"])
    mid_m = clay_mat(f"{prefix}_mid", cols["mid"])
    bot_m = clay_mat(f"{prefix}_bot", cols["bot"])
    top = add_circle_slab(
        f"{prefix}_top",
        z_top=top_z,
        height=CAKE_TOP_H + overlap,
        radius=radius,
        mat=top_m,
    )
    mid = add_circle_slab(
        f"{prefix}_mid",
        z_top=top_z - CAKE_TOP_H + overlap,
        height=CAKE_MID_H + 2 * overlap,
        radius=radius,
        mat=mid_m,
    )
    bot = add_circle_slab(
        f"{prefix}_bot",
        z_top=top_z - CAKE_TOP_H - CAKE_MID_H + overlap,
        height=CAKE_BOT_H + overlap,
        radius=radius,
        mat=bot_m,
    )
    return [top, mid, bot]


def add_cake_rect(
    *,
    size_xy: tuple[float, float] = (1.5, 1.0),
    top_z: float = CAKE_TOP_Z,
    colors: dict[str, str] | None = None,
    prefix: str = "CAKE",
    bevel: float = 0.05,
) -> list[bpy.types.Object]:
    """Three equal bands — rounded-rect footprint (Listing / Tesla)."""
    cols = colors or CAKE
    overlap = 0.004
    top_m = clay_mat(f"{prefix}_top", cols["top"])
    mid_m = clay_mat(f"{prefix}_mid", cols["mid"])
    bot_m = clay_mat(f"{prefix}_bot", cols["bot"])
    top = add_rounded_box_slab(
        f"{prefix}_top",
        z_top=top_z,
        height=CAKE_TOP_H + overlap,
        size_xy=size_xy,
        mat=top_m,
        bevel=bevel,
    )
    mid = add_rounded_box_slab(
        f"{prefix}_mid",
        z_top=top_z - CAKE_TOP_H + overlap,
        height=CAKE_MID_H + 2 * overlap,
        size_xy=size_xy,
        mat=mid_m,
        bevel=bevel,
    )
    bot = add_rounded_box_slab(
        f"{prefix}_bot",
        z_top=top_z - CAKE_TOP_H - CAKE_MID_H + overlap,
        height=CAKE_BOT_H + overlap,
        size_xy=size_xy,
        mat=bot_m,
        bevel=bevel,
    )
    return [top, mid, bot]


def parent_all(objs: list[bpy.types.Object], root_name: str = "Root") -> bpy.types.Object:
    root = bpy.data.objects.new(root_name, None)
    bpy.context.collection.objects.link(root)
    for o in objs:
        mw = o.matrix_world.copy()
        o.parent = root
        o.matrix_parent_inverse = root.matrix_world.inverted()
        o.matrix_world = mw
    return root


def setup_world_and_light(*, intensity: float = 1.0) -> None:
    """Studio light — keep below concept midtones (default was washing pastels out)."""
    world = bpy.context.scene.world or bpy.data.worlds.new("World")
    bpy.context.scene.world = world
    world.use_nodes = True
    bg = world.node_tree.nodes.get("Background")
    if bg:
        bg.inputs["Color"].default_value = (245 / 255, 243 / 255, 238 / 255, 1.0)
        bg.inputs["Strength"].default_value = 0.42 * intensity

    sun_data = bpy.data.lights.new("SUN", "SUN")
    sun = bpy.data.objects.new("SUN", sun_data)
    bpy.context.collection.objects.link(sun)
    sun.rotation_euler = (math.radians(45), 0, math.radians(-15))
    sun_data.energy = 1.55 * intensity
    sun_data.angle = math.radians(28)

    fill_data = bpy.data.lights.new("FILL", "AREA")
    fill = bpy.data.objects.new("FILL", fill_data)
    bpy.context.collection.objects.link(fill)
    fill.location = (-0.6, -2.4, 2.4)
    fill_dir = Vector((0.6, 2.4, -2.4)).normalized()
    fill.rotation_euler = fill_dir.to_track_quat("-Z", "Y").to_euler()
    fill_data.energy = 4.2 * intensity
    fill_data.size = 3.2
    try:
        fill_data.use_shadow = False
    except AttributeError:
        fill_data.cycles.cast_shadow = False


def setup_camera(*, ortho_scale: float = 2.6, aim: Vector | None = None) -> bpy.types.Object:
    cam_data = bpy.data.cameras.new("CAM")
    cam = bpy.data.objects.new("CAM", cam_data)
    bpy.context.collection.objects.link(cam)
    target = aim or CAM_AIM
    view_dir = Euler(CAM_ROT).to_matrix() @ Vector((0.0, 0.0, -1.0))
    cam.location = target - view_dir * 8.0
    cam.rotation_euler = CAM_ROT
    cam.data.type = "ORTHO"
    cam.data.ortho_scale = ortho_scale
    bpy.context.scene.camera = cam
    return cam


def setup_cycles(*, exposure: float = -0.35) -> None:
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.cycles.samples = 96
    scene.cycles.use_denoising = True
    scene.cycles.use_adaptive_sampling = True
    scene.cycles.max_bounces = 4
    try:
        prefs = bpy.context.preferences.addons["cycles"].preferences
        prefs.compute_device_type = "METAL"
        for device in prefs.devices:
            device.use = True
        scene.cycles.device = "GPU"
    except Exception:
        scene.cycles.device = "CPU"
    scene.render.resolution_x = RENDER
    scene.render.resolution_y = RENDER
    scene.render.film_transparent = False
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGB"
    scene.view_settings.view_transform = "Standard"
    scene.view_settings.look = "None"
    scene.view_settings.exposure = exposure


def export_and_render(
    root: bpy.types.Object,
    parts: list[bpy.types.Object],
    *,
    blend_path: Path,
    glb_path: Path,
    png_path: Path,
) -> dict:
    blend_path.parent.mkdir(parents=True, exist_ok=True)
    glb_path.parent.mkdir(parents=True, exist_ok=True)
    png_path.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=str(blend_path))

    for o in bpy.data.objects:
        o.select_set(False)
    root.select_set(True)
    for o in parts:
        o.select_set(True)
    bpy.context.view_layer.objects.active = root
    bpy.ops.export_scene.gltf(
        filepath=str(glb_path),
        export_format="GLB",
        use_selection=True,
        export_apply=True,
        export_animations=False,
    )

    if os.environ.get("CLAY_SKIP_RENDER"):
        tris = 0
        for o in parts:
            if o.type == "MESH":
                o.data.calc_loop_triangles()
                tris += len(o.data.loop_triangles)
        return {"tris": tris, "parts": len(parts), "png": None, "glb": str(glb_path)}

    scene = bpy.context.scene
    scene.render.filepath = str(png_path)
    bpy.ops.render.render(write_still=True)

    # Cream twin for side-by-side review (render already on cream world)
    cream = png_path.with_name(png_path.stem + "-cream.png")
    if cream != png_path:
        import shutil

        shutil.copy(png_path, cream)

    tris = 0
    for o in parts:
        if o.type == "MESH":
            o.data.calc_loop_triangles()
            tris += len(o.data.loop_triangles)
    return {"tris": tris, "parts": len(parts), "png": str(png_path), "glb": str(glb_path)}
