#!/usr/bin/env python3
"""Compose Facebook OG image (1200×630) as a comic page on clean paper."""

from __future__ import annotations

import random
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "og-share.png"
FONT_DIR = ROOT / "scripts" / "fonts"
WIDTH, HEIGHT = 1200, 630

TYPES = [
    "typ-woodland.png",
    "typ-smahus.png",
    "typ-klassisk.png",
    "typ-lamellhus.png",
    "typ-hoghus.png",
    "typ-tata.png",
    "typ-mycket.png",
]

HEADLINE = "UTFORMA DITT EGET SYDÖSTRA UPPSALA"

PAPER = (252, 250, 245)
INK = (18, 16, 14)
CAPTION_FILL = (255, 254, 250)


def ensure_comic_font() -> Path:
    FONT_DIR.mkdir(parents=True, exist_ok=True)
    dest = FONT_DIR / "Bangers-Regular.ttf"
    if dest.exists() and dest.stat().st_size > 1000:
        return dest
    url = "https://github.com/googlefonts/bangers/raw/main/fonts/ttf/Bangers-Regular.ttf"
    urllib.request.urlretrieve(url, dest)
    return dest


def load_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    try:
        return ImageFont.truetype(str(ensure_comic_font()), size=size)
    except OSError:
        pass
    for path in (
        "/System/Library/Fonts/Supplemental/Impact.ttf",
        "/System/Library/Fonts/Supplemental/Arial Black.ttf",
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    ):
        try:
            return ImageFont.truetype(path, size=size)
        except OSError:
            continue
    return ImageFont.load_default()


def cover_crop(img: Image.Image, tw: int, th: int) -> Image.Image:
    src = img.convert("RGBA")
    scale = max(tw / src.width, th / src.height)
    nw, nh = max(1, int(src.width * scale)), max(1, int(src.height * scale))
    resized = src.resize((nw, nh), Image.Resampling.LANCZOS)
    left = (nw - tw) // 2
    top = max(0, (nh - th) // 2 - th // 10)
    top = min(top, nh - th)
    return resized.crop((left, top, left + tw, top + th))


def paper_background(size: tuple[int, int], rng: random.Random) -> Image.Image:
    w, h = size
    base = Image.new("RGB", size, PAPER)
    px = base.load()
    for y in range(0, h, 4):
        for x in range(0, w, 4):
            n = rng.randint(-1, 1)
            c = (
                max(0, min(255, PAPER[0] + n)),
                max(0, min(255, PAPER[1] + n)),
                max(0, min(255, PAPER[2] + n)),
            )
            for dy in range(4):
                for dx in range(4):
                    if x + dx < w and y + dy < h:
                        px[x + dx, y + dy] = c
    return base


def panel_geometry() -> list[tuple[int, int, int, int]]:
    margin = 24
    gutter = 16
    usable_w = WIDTH - margin * 2
    n = len(TYPES)

    weights = [0.95, 1.05, 0.92, 1.08, 1.0, 1.12, 0.98]
    total = sum(weights)
    widths = [int(round(usable_w * w / total)) for w in weights]
    widths[-1] += usable_w - sum(widths) - gutter * (n - 1)

    top_jitters = [8, 28, 4, 36, 12, 44, 18]
    bottom_jitters = [40, 12, 48, 8, 52, 16, 32]

    panels = []
    x = margin
    for i in range(n):
        top = margin + top_jitters[i]
        bottom = HEIGHT - margin - bottom_jitters[i]
        panels.append((x, top, widths[i], bottom - top))
        x += widths[i] + gutter
    return panels


def paste_panel(
    page: Image.Image,
    art: Image.Image,
    box: tuple[int, int, int, int],
    border: int = 3,
) -> None:
    """Straight ruler-drawn comic panel frame."""
    x, y, w, h = box
    inner_w = max(1, w - border * 2)
    inner_h = max(1, h - border * 2)
    cropped = cover_crop(art, inner_w, inner_h).convert("RGB")
    cropped = ImageEnhance.Contrast(cropped).enhance(1.04)
    page.paste(cropped, (x + border, y + border))

    draw = ImageDraw.Draw(page)
    # Clean straight ink rectangle — as if drawn with a ruler
    draw.rectangle((x, y, x + w - 1, y + h - 1), outline=INK, width=2)


def wrap_text(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.ImageFont, max_width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        trial = f"{current} {word}".strip()
        if draw.textlength(trial, font=font) <= max_width:
            current = trial
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines or [text]


def draw_caption(page: Image.Image) -> None:
    """Small 1950s comic caption box, left-aligned (~100px from edge)."""
    draw = ImageDraw.Draw(page)
    font = load_font(24)
    # Fixed comic-caption line breaks for a compact box
    lines = ["UTFORMA DITT EGET", "SYDÖSTRA UPPSALA"]

    line_gap = 2
    pad_x, pad_y = 10, 7
    heights = [font.getbbox(l)[3] - font.getbbox(l)[1] for l in lines]
    content_h = sum(heights) + line_gap * (len(lines) - 1)
    content_w = max(draw.textlength(l, font=font) for l in lines)

    card_w = int(content_w + pad_x * 2)
    card_h = int(content_h + pad_y * 2)
    card_x = 100
    card_y = 34

    print(f"caption box x={card_x} w={card_w} h={card_h}")

    draw.rectangle(
        (card_x + 2, card_y + 2, card_x + card_w + 2, card_y + card_h + 2),
        fill=INK,
    )
    draw.rectangle(
        (card_x, card_y, card_x + card_w, card_y + card_h),
        fill=CAPTION_FILL,
        outline=INK,
        width=2,
    )

    y = card_y + pad_y
    for i, line in enumerate(lines):
        x = card_x + pad_x
        draw.text((x, y), line, font=font, fill=INK)
        y += heights[i] + line_gap


def main() -> None:
    rng = random.Random(47)
    page = paper_background((WIDTH, HEIGHT), rng)

    for name, box in zip(TYPES, panel_geometry()):
        paste_panel(page, Image.open(ROOT / name), box)

    draw_caption(page)

    final = page.convert("RGB")
    final.save(OUT, "PNG", optimize=True)
    print(f"Wrote {OUT} ({final.size[0]}x{final.size[1]})")


if __name__ == "__main__":
    main()
