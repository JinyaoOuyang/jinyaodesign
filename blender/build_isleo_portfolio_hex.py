"""Portfolio Isleo hex — rebuilt from the proven Isleo live-kit pipeline.

Source of truth for look: Desktop/isleo/tools/blender/build_live_tile_layers.py
Layout target: public/work/clay/concepts/clay-concept-isleo.png
"""
from __future__ import annotations

import math
import os
import random
from pathlib import Path

import bpy
from mathutils import Euler, Vector

OUT_BLEND = Path("/Users/katherine/jinyaodesign/blender/isleo_hex_prototype.blend")
OUT_GLB = Path("/Users/katherine/jinyaodesign/public/work/clay/isleo.glb")
OUT_PNG = Path("/Users/katherine/jinyaodesign/public/work/clay/concepts/isleo-blender-proto.png")

RENDER = 1024
# Live-kit framing, slightly pulled back so the whole island breathes
ORTHO_SCALE = 2.45
CAM_ROT = (math.radians(54.0), 0.0, math.radians(45.0))
CAM_AIM = Vector((0.0, 0.0, 0.0))

HEX_R = 1.0
TOP_Z = 0.30
# Equal cake layers — concept reads as three clear bands
GRASS_H = 0.21
CREAM_H = 0.20
BROWN_H = 0.21

# BuyaHabit kit palette — gouache mid-tones: sage, bone, teal, terracotta
PALETTE = {
    "grass": "#9BB380",
    "cream": "#EAE1CB",
    "brown": "#C9AC85",
    "water": "#8FD0DE",
    "trunk": "#CE8B5B",
    "foliage": "#9AB694",
    "foliage_dark": "#7FA07F",
    "bush": "#A6BE9D",
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
    # Cycles-only: softens hard silhouette creases that read as black cracks
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


def ring(
    radii: list[float],
    z: float,
    cx: float = 0.0,
    cy: float = 0.0,
    angle0: float = -30.0,
) -> list[tuple[float, float, float]]:
    n = len(radii)
    return [
        (
            cx + radii[i] * math.cos(math.radians(360.0 * i / n + angle0)),
            cy + radii[i] * math.sin(math.radians(360.0 * i / n + angle0)),
            z,
        )
        for i in range(n)
    ]


def hex_ring(radius: float, z: float) -> list[tuple[float, float, float]]:
    return ring([radius] * 6, z, angle0=-30.0)


def add_prism(
    name: str,
    top: list[tuple[float, float, float]],
    bottom: list[tuple[float, float, float]],
    mat: bpy.types.Material,
    *,
    cap_top: bool = True,
    cap_bottom: bool = True,
) -> bpy.types.Object:
    n = len(top)
    mesh = bpy.data.meshes.new(name)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    verts = top + bottom
    faces = [(i, (i + 1) % n, (i + 1) % n + n, i + n) for i in range(n)]
    if cap_top:
        faces.append(tuple(range(n)))
    if cap_bottom:
        faces.append(tuple(range(2 * n - 1, n - 1, -1)))
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj.data.materials.append(mat)
    flat_shade(obj)
    return obj


def add_hex_slab(name: str, z_top: float, height: float, radius: float, mat: bpy.types.Material) -> bpy.types.Object:
    return add_prism(name, hex_ring(radius, z_top), hex_ring(radius, z_top - height), mat)


def ray_poly_r(theta_deg: float, pts: list[tuple[float, ...]]) -> float:
    dx = math.cos(math.radians(theta_deg))
    dy = math.sin(math.radians(theta_deg))
    n = len(pts)
    best = None
    for i in range(n):
        x1, y1 = pts[i][0], pts[i][1]
        x2, y2 = pts[(i + 1) % n][0], pts[(i + 1) % n][1]
        denom = dx * (y2 - y1) - dy * (x2 - x1)
        if abs(denom) < 1e-12:
            continue
        t = (x1 * (y2 - y1) - y1 * (x2 - x1)) / denom
        if t <= 0:
            continue
        if abs(x2 - x1) > abs(y2 - y1):
            s = (t * dx - x1) / (x2 - x1)
        else:
            s = (t * dy - y1) / (y2 - y1)
        if -1e-6 <= s <= 1 + 1e-6:
            best = t if best is None else min(best, t)
    if best is None:
        raise ValueError(f"ray at {theta_deg}° missed polygon")
    return best


# Plan-view corner fillet — large enough to read, small enough to leave flat sides
HEX_CORNER_R = 0.12
HEX_CORNER_SEGS = 5


def rounded_hex_ring(
    radius: float,
    z: float,
    *,
    corner_r: float = HEX_CORNER_R,
    segs_per_corner: int = HEX_CORNER_SEGS,
) -> list[tuple[float, float, float]]:
    """Plan hex with filleted corners: flat sides + round fold-angles only."""
    pts: list[tuple[float, float, float]] = []
    inset = corner_r / math.sin(math.radians(60.0))
    for i in range(6):
        ang = math.radians(-30.0 + 60.0 * i)
        cx = (radius - inset) * math.cos(ang)
        cy = (radius - inset) * math.sin(ang)
        a0 = ang - math.radians(30.0)
        a1 = ang + math.radians(30.0)
        for k in range(segs_per_corner + 1):
            if i > 0 and k == 0:
                continue
            t = k / segs_per_corner
            a = a0 + (a1 - a0) * t
            pts.append((cx + corner_r * math.cos(a), cy + corner_r * math.sin(a), z))
    return pts


def add_rounded_hex_slab(
    name: str,
    z_top: float,
    height: float,
    radius: float,
    mat: bpy.types.Material,
    *,
    cap_top: bool = True,
) -> bpy.types.Object:
    """Extrude rounded-hex: vertical flat sides, only the 6 corners are round."""
    top = rounded_hex_ring(radius, z_top)
    bot = rounded_hex_ring(radius, z_top - height)
    return add_prism(name, top, bot, mat, cap_top=cap_top, cap_bottom=True)


def _scale_ring_xy(
    pts: list[tuple[float, float, float]], scale: float, z: float
) -> list[tuple[float, float, float]]:
    return [(x * scale, y * scale, z) for x, y, _z in pts]


def add_grass_and_pond(
    rng: random.Random,
    pond_radius: float = 0.40,
) -> tuple[list[bpy.types.Object], list[float]]:
    """Grass hex + deep faceted pond dish (no cream insert).

    Concept fold: lip → stepped green bank → sunken water. Steep inset +
    flat-shaded bank faces so the bowl reads as concave, not a painted sticker.
    """
    grass_m = clay_mat("grass", PALETTE["grass"])
    water_m = clay_mat("pond_water", PALETTE["water"], roughness=0.55, specular=0.0)

    z_top = TOP_Z
    chamfer = 0.028
    z_lip = z_top - chamfer
    z_bot = TOP_Z - GRASS_H - 0.004
    # Steep cup (not a wide funnel): tall green walls read in iso as a real sink
    z1 = TOP_Z - 0.055
    z2 = TOP_Z - 0.110
    z_floor = TOP_Z - 0.165

    wall_top = rounded_hex_ring(HEX_R, z_lip)
    wall_bot = rounded_hex_ring(HEX_R, z_bot)
    n = len(wall_top)
    top_outer = _scale_ring_xy(wall_top, (HEX_R - chamfer) / HEX_R, z_top)

    # Concept pond: soft irregular octagon
    outline = pond_radii(rng, 8, pond_radius)
    pond_poly = ring(outline, 0.0, angle0=-30.0)

    def sample_pond(scale: float, z: float) -> list[tuple[float, float, float]]:
        pts: list[tuple[float, float, float]] = []
        for x, y, _z in wall_top:
            a = math.atan2(y, x)
            r = ray_poly_r(math.degrees(a), pond_poly) * scale
            pts.append((r * math.cos(a), r * math.sin(a), z))
        return pts

    # Nearly vertical folds first, then a short shelf into the water floor
    lip = sample_pond(1.0, z_top)
    ring1 = sample_pond(0.97, z1)
    ring2 = sample_pond(0.93, z2)
    floor = sample_pond(0.88, z_floor)

    g_verts = top_outer + wall_top + wall_bot + lip + ring1 + ring2 + floor
    t0, w0, w1 = 0, n, 2 * n
    p0, p1, p2, p3 = 3 * n, 4 * n, 5 * n, 6 * n
    g_faces: list[tuple[int, ...]] = []
    for i in range(n):
        j = (i + 1) % n
        g_faces.append((t0 + i, t0 + j, w0 + j, w0 + i))
        g_faces.append((w0 + i, w0 + j, w1 + j, w1 + i))
        g_faces.append((t0 + i, t0 + j, p0 + j, p0 + i))
        g_faces.append((p0 + i, p0 + j, p1 + j, p1 + i))  # upper wall
        g_faces.append((p1 + i, p1 + j, p2 + j, p2 + i))  # mid wall
        g_faces.append((p2 + i, p2 + j, p3 + j, p3 + i))  # lower shelf
    g_faces.append(tuple(range(w1 + n - 1, w1 - 1, -1)))
    g_faces.append(tuple(range(p3, p3 + n)))  # grass floor under water

    g_mesh = bpy.data.meshes.new("HEX_grass")
    grass = bpy.data.objects.new("HEX_grass", g_mesh)
    bpy.context.collection.objects.link(grass)
    g_mesh.from_pydata(g_verts, [], g_faces)
    g_mesh.update()
    import bmesh

    bm = bmesh.new()
    bm.from_mesh(g_mesh)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    bm.to_mesh(g_mesh)
    bm.free()
    grass.data.materials.append(grass_m)
    # Flat bank facets = readable clay folds (auto-smooth washed them out)
    flat_shade(grass)

    # Water low in the cup — tall green walls stay visible above
    water_top = [(x * 1.02, y * 1.02, z_floor + 0.018) for x, y, _z in floor]
    water_bot = [(x * 1.02, y * 1.02, z_floor + 0.002) for x, y, _z in floor]
    water = add_prism("POND_water", water_top, water_bot, water_m)
    return [grass, water], outline


def add_hex_base(rng: random.Random, pond_radius: float = 0.40) -> list[bpy.types.Object]:
    """Sealed cake layers; grass+pond dish fused in add_grass_and_pond."""
    cream_m = clay_mat("cream", PALETTE["cream"])
    brown_m = clay_mat("brown", PALETTE["brown"])
    overlap = 0.004
    land, _outline = add_grass_and_pond(rng, pond_radius)
    cream = add_rounded_hex_slab(
        "HEX_cream",
        TOP_Z - GRASS_H + overlap,
        CREAM_H + 2 * overlap,
        HEX_R,
        cream_m,
    )
    brown = add_rounded_hex_slab(
        "HEX_brown",
        TOP_Z - GRASS_H - CREAM_H + overlap,
        BROWN_H + overlap,
        HEX_R,
        brown_m,
    )
    return land + [cream, brown]


def add_grass_top(pond_pts: list[tuple[float, ...]], rng: random.Random, mat: bpy.types.Material) -> bpy.types.Object:
    """Faceted grass ring — outer boundary matches rounded-hex sides."""
    hex_pts = rounded_hex_ring(HEX_R, 0.0)
    n = 36
    angles = [-30.0 + 360.0 * k / n for k in range(n)]
    r_out = [ray_poly_r(a, hex_pts) for a in angles]
    r_in = [ray_poly_r(a, pond_pts) for a in angles]

    rings: list[list[tuple[float, float, float]]] = []
    for mix, jitter in ((0.0, 0.0), (0.4, 0.006), (0.75, 0.006), (1.0, 0.0)):
        ring_pts = []
        for k, a in enumerate(angles):
            r = r_out[k] * (1 - mix) + r_in[k] * mix
            if jitter:
                r *= 1 + rng.uniform(-0.04, 0.04)
            z = TOP_Z + (rng.uniform(-jitter, jitter) if jitter else 0.0)
            ring_pts.append((r * math.cos(math.radians(a)), r * math.sin(math.radians(a)), z))
        rings.append(ring_pts)

    verts: list[tuple[float, float, float]] = []
    for ring_pts in rings:
        verts.extend(ring_pts)
    faces: list[tuple[int, int, int]] = []
    for s in range(len(rings) - 1):
        a0, b0 = s * n, (s + 1) * n
        for k in range(n):
            k1 = (k + 1) % n
            if (k + s) % 2 == 0:
                faces.append((a0 + k, a0 + k1, b0 + k1))
                faces.append((a0 + k, b0 + k1, b0 + k))
            else:
                faces.append((a0 + k, a0 + k1, b0 + k))
                faces.append((a0 + k1, b0 + k1, b0 + k))

    mesh = bpy.data.meshes.new("GRASS_top")
    obj = bpy.data.objects.new("GRASS_top", mesh)
    bpy.context.collection.objects.link(obj)
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj.data.materials.append(mat)
    flat_shade(obj)
    return obj


def pond_radii(rng: random.Random, n: int, base: float) -> list[float]:
    return [base * (1.0 + rng.uniform(-0.06, 0.06)) for _ in range(n)]


def soft_bevel(obj: bpy.types.Object, width: float = 0.04, segments: int = 3) -> None:
    """Gentle clay edge — concept 圆钝感 without wrecking the silhouette."""
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


def soft_bevel_top_only(obj: bpy.types.Object, width: float = 0.035, segments: int = 3) -> None:
    """Bevel only edges of the upward-facing top — keeps walls vertical, no bottom flare."""
    import bmesh

    if bpy.context.mode != "OBJECT":
        bpy.ops.object.mode_set(mode="OBJECT")
    bm = bmesh.new()
    bm.from_mesh(obj.data)
    bm.faces.ensure_lookup_table()
    bm.edges.ensure_lookup_table()
    for e in bm.edges:
        e.select = False
        if len(e.link_faces) != 2:
            continue
        n0 = e.link_faces[0].normal
        n1 = e.link_faces[1].normal
        # Must touch a face pointing UP (top cap), not the bottom cap
        has_up = n0.z > 0.7 or n1.z > 0.7
        has_down = n0.z < -0.7 or n1.z < -0.7
        has_side = abs(n0.z) < 0.35 or abs(n1.z) < 0.35
        if has_up and has_side and not has_down:
            e.select = True
    geom = [e for e in bm.edges if e.select]
    if geom:
        bmesh.ops.bevel(
            bm,
            geom=geom,
            offset=width,
            segments=segments,
            affect="EDGES",
            profile=0.5,
        )
    bm.to_mesh(obj.data)
    bm.free()
    obj.data.update()
    flat_shade(obj)


def add_round_tree(name: str, x: float, y: float, scale: float = 1.0, *, dark: bool = False) -> list[bpy.types.Object]:
    """Round tree — live-kit / concept proportions (trunk ~1/3–1/4 of crown width)."""
    objs: list[bpy.types.Object] = []
    trunk_m = clay_mat(f"{name}_trunk", PALETTE["trunk"])
    leaf_m = clay_mat(f"{name}_leaf", PALETTE["foliage_dark"] if dark else PALETTE["foliage"])
    outward = 1.0 if x >= 0 else -1.0

    # Match Isleo live-kit: r=0.055 trunk, r=0.21 crown (see build_live_tile_layers.py)
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=8,
        radius=0.055 * scale,
        depth=0.22 * scale,
        location=(x, y, TOP_Z + 0.11 * scale),
    )
    trunk = bpy.context.active_object
    trunk.name = f"{name}_trunk"
    trunk.data.materials.append(trunk_m)
    flat_shade(trunk)
    objs.append(trunk)

    # Concept root flare — modest, not a fat stump
    bpy.ops.mesh.primitive_cone_add(
        vertices=8,
        radius1=0.078 * scale,
        radius2=0.050 * scale,
        depth=0.05 * scale,
        location=(x, y, TOP_Z + 0.022 * scale),
    )
    flare = bpy.context.active_object
    flare.name = f"{name}_flare"
    flare.data.materials.append(trunk_m)
    flat_shade(flare)
    objs.append(flare)

    bpy.ops.mesh.primitive_ico_sphere_add(
        subdivisions=2,
        radius=0.21 * scale,
        location=(x, y, TOP_Z + (0.22 + 0.16) * scale),
    )
    crown = bpy.context.active_object
    crown.name = f"{name}_crown"
    crown.scale = (1.0, 1.0, 0.96)
    bpy.ops.object.transform_apply(scale=True)
    crown.data.materials.append(leaf_m)
    flat_shade(crown)
    objs.append(crown)

    bpy.ops.mesh.primitive_ico_sphere_add(
        subdivisions=1,
        radius=0.10 * scale,
        location=(x + outward * 0.13 * scale, y - 0.06 * scale, TOP_Z + 0.30 * scale),
    )
    tuft = bpy.context.active_object
    tuft.name = f"{name}_tuft"
    tuft.data.materials.append(leaf_m)
    flat_shade(tuft)
    objs.append(tuft)
    return objs


def add_pine_tree(name: str, x: float, y: float, scale: float = 1.0) -> list[bpy.types.Object]:
    objs: list[bpy.types.Object] = []
    trunk_m = clay_mat(f"{name}_trunk", PALETTE["trunk"])
    leaf_m = clay_mat(f"{name}_leaf", PALETTE["foliage"])

    bpy.ops.mesh.primitive_cylinder_add(
        vertices=8,
        radius=0.045 * scale,
        depth=0.16 * scale,
        location=(x, y, TOP_Z + 0.08 * scale),
    )
    trunk = bpy.context.active_object
    trunk.name = f"{name}_trunk"
    trunk.data.materials.append(trunk_m)
    flat_shade(trunk)
    objs.append(trunk)

    for i, (z, r, h) in enumerate([(0.24, 0.155, 0.20), (0.37, 0.115, 0.17), (0.48, 0.075, 0.14)]):
        bpy.ops.mesh.primitive_cone_add(
            vertices=7,
            radius1=r * scale,
            depth=h * scale,
            location=(x, y, TOP_Z + z * scale),
        )
        layer = bpy.context.active_object
        layer.name = f"{name}_tier_{i}"
        layer.data.materials.append(leaf_m)
        flat_shade(layer)
        objs.append(layer)
    return objs


def add_bush(name: str, x: float, y: float, scale: float = 1.0) -> bpy.types.Object:
    leaf_m = clay_mat(name, PALETTE["bush"])
    bpy.ops.mesh.primitive_ico_sphere_add(
        subdivisions=2,
        radius=0.12 * scale,
        location=(x, y, TOP_Z + 0.055 * scale),
    )
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = (1.15, 1.05, 0.68)
    bpy.ops.object.transform_apply(scale=True)
    obj.data.materials.append(leaf_m)
    flat_shade(obj)
    soft_bevel(obj, width=0.012 * scale, segments=2)
    return obj


def add_grass_tuft(name: str, x: float, y: float, scale: float = 1.0) -> list[bpy.types.Object]:
    mat = clay_mat(name, PALETTE["bush"])
    parts = []
    for i, ang in enumerate((-20, 0, 20)):
        bpy.ops.mesh.primitive_cone_add(
            vertices=5,
            radius1=0.014 * scale,
            depth=0.08 * scale,
            location=(x, y, TOP_Z + 0.04 * scale),
        )
        blade = bpy.context.active_object
        blade.name = f"{name}_{i}"
        blade.rotation_euler = (math.radians(14), 0, math.radians(ang))
        blade.data.materials.append(mat)
        flat_shade(blade)
        parts.append(blade)
    return parts


def setup_world_and_light() -> None:
    world = bpy.context.scene.world or bpy.data.worlds.new("World")
    bpy.context.scene.world = world
    world.use_nodes = True
    bg = world.node_tree.nodes.get("Background")
    if bg:
        # Site cream — opaque preview avoids transparent-film black fringes on rims
        bg.inputs["Color"].default_value = (245 / 255, 243 / 255, 238 / 255, 1.0)
        bg.inputs["Strength"].default_value = 0.85

    sun_data = bpy.data.lights.new("SUN", "SUN")
    sun = bpy.data.objects.new("SUN", sun_data)
    bpy.context.collection.objects.link(sun)
    sun.rotation_euler = (math.radians(45), 0, math.radians(-15))
    sun_data.energy = 2.6
    sun_data.angle = math.radians(24)

    fill_data = bpy.data.lights.new("FILL", "AREA")
    fill = bpy.data.objects.new("FILL", fill_data)
    bpy.context.collection.objects.link(fill)
    fill.location = (-0.6, -2.4, 2.4)
    fill_dir = Vector((0.6, 2.4, -2.4)).normalized()
    fill.rotation_euler = fill_dir.to_track_quat("-Z", "Y").to_euler()
    fill_data.energy = 9
    fill_data.size = 3.0
    try:
        fill_data.use_shadow = False
    except AttributeError:
        fill_data.cycles.cast_shadow = False


def setup_camera() -> bpy.types.Object:
    cam_data = bpy.data.cameras.new("CAM")
    cam = bpy.data.objects.new("CAM", cam_data)
    bpy.context.collection.objects.link(cam)
    view_dir = Euler(CAM_ROT).to_matrix() @ Vector((0.0, 0.0, -1.0))
    cam.location = CAM_AIM - view_dir * 8.0
    cam.rotation_euler = CAM_ROT
    cam.data.type = "ORTHO"
    cam.data.ortho_scale = ORTHO_SCALE
    bpy.context.scene.camera = cam
    return cam


def setup_cycles() -> None:
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.cycles.samples = 128
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
    scene.view_settings.exposure = 0.0


def parent_all(objs: list[bpy.types.Object]) -> bpy.types.Object:
    root = bpy.data.objects.new("Isleo_Root", None)
    bpy.context.collection.objects.link(root)
    for o in objs:
        mw = o.matrix_world.copy()
        o.parent = root
        o.matrix_parent_inverse = root.matrix_world.inverted()
        o.matrix_world = mw
    return root


def main() -> dict:
    clear_scene()
    rng = random.Random(11)  # stable seed
    parts: list[bpy.types.Object] = []

    # Concept pond fused into grass (irregular octagon + green bank, no cream plug)
    parts += add_hex_base(rng, pond_radius=0.40)

    # Concept layout: live-kit tree proportions (trunk ~1/4 of crown width)
    parts += add_pine_tree("Pine", -0.18, 0.58, scale=0.95)
    parts += add_round_tree("TreeL", -0.68, 0.08, scale=0.95, dark=False)
    parts += add_round_tree("TreeR", 0.68, 0.18, scale=0.90, dark=False)
    parts.append(add_bush("Bush1", -0.62, 0.38, 0.9))
    parts.append(add_bush("Bush2", 0.55, -0.42, 0.85))
    parts.append(add_bush("Bush3", 0.65, -0.12, 0.8))
    parts.append(add_bush("Bush4", -0.55, -0.42, 0.8))
    parts.append(add_bush("Bush5", 0.22, 0.58, 0.75))
    parts += add_grass_tuft("Tuft1", -0.42, 0.28, 0.9)
    parts += add_grass_tuft("Tuft2", 0.40, -0.35, 0.85)

    root = parent_all(parts)
    setup_world_and_light()
    setup_camera()
    setup_cycles()

    OUT_BLEND.parent.mkdir(parents=True, exist_ok=True)
    OUT_GLB.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=str(OUT_BLEND))

    for o in bpy.data.objects:
        o.select_set(False)
    root.select_set(True)
    for o in parts:
        o.select_set(True)
    bpy.context.view_layer.objects.active = root
    bpy.ops.export_scene.gltf(
        filepath=str(OUT_GLB),
        export_format="GLB",
        use_selection=True,
        export_apply=True,
        export_animations=False,
    )

    if not os.environ.get("CLAY_SKIP_RENDER"):
        scene = bpy.context.scene
        scene.render.filepath = str(OUT_PNG)
        bpy.ops.render.render(write_still=True)

    tris = 0
    for o in parts:
        if o.type == "MESH":
            o.data.calc_loop_triangles()
            tris += len(o.data.loop_triangles)

    return {"tris": tris, "parts": len(parts), "png": str(OUT_PNG), "glb": str(OUT_GLB)}


if __name__ == "__main__":
    print(main())
