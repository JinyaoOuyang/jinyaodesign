"""Build Trail / Listing / Tesla clay prototypes sequentially."""
from __future__ import annotations

import importlib.util
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def _load(name: str):
    path = ROOT / f"{name}.py"
    spec = importlib.util.spec_from_file_location(name, path)
    mod = importlib.util.module_from_spec(spec)
    sys.modules[name] = mod
    assert spec.loader is not None
    spec.loader.exec_module(mod)
    return mod


def main() -> dict:
    results = {}
    for name in ("build_trail_compass", "build_listing_pipeline", "build_tesla_charger"):
        mod = _load(name)
        results[name] = mod.main()
    return results


if __name__ == "__main__":
    print(main())
