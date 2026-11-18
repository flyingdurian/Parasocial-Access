"""Read-only alpha-contamination report for the game's authored sprite atlases.

Run with: python scripts/audit_sprite_cells.py
No images are modified. The report flags disconnected opaque islands in each
frame; a legitimate held prop or braid can be separate, so flags need review.
"""
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.ndimage import label


def inspect_sheet(path: Path, columns: int, rows: int):
    image = np.asarray(Image.open(path).convert("RGBA"))
    height, width = image.shape[:2]
    cell_w, cell_h = width // columns, height // rows
    findings = []
    for row in range(rows):
        for col in range(columns):
            alpha = image[row * cell_h:(row + 1) * cell_h, col * cell_w:(col + 1) * cell_w, 3]
            opaque = alpha > 150
            components, count = label(opaque, structure=np.ones((3, 3), dtype=np.uint8))
            if not count:
                continue
            sizes = np.bincount(components.ravel())[1:]
            major = int(np.argmax(sizes) + 1)
            other = []
            for cid, size in enumerate(sizes, start=1):
                if cid == major or size < 18:
                    continue
                yy, xx = np.nonzero(components == cid)
                other.append((int(size), int(xx.min()), int(yy.min()), int(xx.max()), int(yy.max())))
            if other:
                findings.append((row, col, int(sizes[major - 1]), sorted(other, reverse=True)[:5]))
    return findings


if __name__ == "__main__":
    for path in sorted(Path("assets").glob("irl-cast-*.webp")) + sorted(Path("assets").glob("irl-cosplay-six-*.webp")):
        if path.name in ("irl-cast-walk.webp", "irl-cast.webp"):
            cols, rows = 4, 3
        elif any(name in path.name for name in ("walk4", "back4", "react4", "stage", "cosplay")):
            cols, rows = 6, 4
        else:
            cols, rows = 6, 2
        findings = inspect_sheet(path, cols, rows)
        if findings:
            print(path.name, f"({len(findings)} cells with islands)")
            for row, col, main, islands in findings[:10]:
                print(f"  r{row}c{col} main={main}: {islands}")
