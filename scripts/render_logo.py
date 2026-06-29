"""Generate anywork4me logo files — square + landscape (light & dark) — in the live sea-blue brand."""
import os
from PIL import Image, ImageDraw, ImageFont

ACCENT = (79, 70, 229)     # #4f46e5 indigo
ACCENT2 = (124, 58, 237)   # #7c3aed violet
WHITE = (255, 255, 255)
GREY = (90, 95, 100)
LSUB = (196, 181, 253)     # light lavender
FB = "C:/Windows/Fonts/segoeuib.ttf"
F = "C:/Windows/Fonts/segoeui.ttf"
OUT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def font(bold, size):
    return ImageFont.truetype(FB if bold else F, size)


def grad(size, c1, c2):
    maxd = 2 * (size - 1)
    lut = [(round(c1[0] + (c2[0] - c1[0]) * d / maxd),
            round(c1[1] + (c2[1] - c1[1]) * d / maxd),
            round(c1[2] + (c2[2] - c1[2]) * d / maxd)) for d in range(maxd + 1)]
    img = Image.new("RGB", (size, size))
    img.putdata([lut[x + y] for y in range(size) for x in range(size)])
    return img


def grad_rect(w, h, c1, c2):
    maxd = (w - 1) + (h - 1)
    lut = [(round(c1[0] + (c2[0] - c1[0]) * d / maxd),
            round(c1[1] + (c2[1] - c1[1]) * d / maxd),
            round(c1[2] + (c2[2] - c1[2]) * d / maxd)) for d in range(maxd + 1)]
    img = Image.new("RGB", (w, h))
    img.putdata([lut[x + y] for y in range(h) for x in range(w)])
    return img


def rounded_alpha(img, radius):
    mask = Image.new("L", img.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, img.size[0] - 1, img.size[1] - 1], radius=radius, fill=255)
    img.putalpha(mask)
    return img


def draw_mark(d, cx, cy, box, color):
    s = box / 512 * 1.3
    sw = max(2, round(36 * s))

    def T(px, py):
        return (cx + (px - 253) * s, cy + (py - 253) * s)

    c = T(228, 228)
    R = 98 * s
    d.ellipse([c[0] - R, c[1] - R, c[0] + R, c[1] + R], outline=color, width=sw)
    a, b = T(300, 300), T(376, 376)
    d.line([a[0], a[1], b[0], b[1]], fill=color, width=sw)
    r = sw / 2
    for p in (a, b):
        d.ellipse([p[0] - r, p[1] - r, p[0] + r, p[1] + r], fill=color)


# ---- landscape (transparent bg) ----
tile = grad(360, ACCENT, ACCENT2).convert("RGBA")
draw_mark(ImageDraw.Draw(tile), 180, 180, 360, WHITE)
rounded_alpha(tile, 86)


def landscape(word_color, sub_color, name):
    c = Image.new("RGBA", (1600, 440), (0, 0, 0, 0))
    c.alpha_composite(tile, (40, 40))
    d = ImageDraw.Draw(c)
    d.text((470, 178), "anywork4me", font=font(True, 150), fill=word_color, anchor="lm")
    d.text((476, 300), "find people · services · opportunities nearby",
           font=font(False, 33), fill=sub_color, anchor="lm")
    p = os.path.join(OUT, name)
    c.save(p)
    return p


# ---- square (gradient tile) ----
sq = Image.new("RGBA", (1024, 1024), (0, 0, 0, 0))
tilefull = rounded_alpha(grad(1024, ACCENT, ACCENT2).convert("RGBA"), 200)
sq.alpha_composite(tilefull, (0, 0))
d = ImageDraw.Draw(sq)
draw_mark(d, 512, 402, 470, WHITE)
d.text((512, 772), "anywork4me", font=font(True, 116), fill=WHITE, anchor="mm")
sqp = os.path.join(OUT, "logo-square.png")
sq.save(sqp)

p1 = landscape(ACCENT, GREY, "logo-landscape-light.png")
p2 = landscape(WHITE, LSUB, "logo-landscape-dark.png")

# ---- og.png social-share card (1024x500), overwrites the old blue one ----
ogw, ogh = 1024, 500
og = grad_rect(ogw, ogh, ACCENT, ACCENT2).convert("RGBA")
od = ImageDraw.Draw(og)
wf = font(True, 84)
word = "anywork4me"
mbox, gap = 120, 26
ww = od.textlength(word, font=wf)
startx = (ogw - (mbox + gap + ww)) / 2
draw_mark(od, startx + mbox / 2, 205, mbox, WHITE)
od.text((startx + mbox + gap, 205), word, font=wf, fill=WHITE, anchor="lm")
od.text((ogw / 2, 312), "Find Work · Sell Products · Hire People Fast", font=font(True, 33),
        fill=(237, 233, 254), anchor="mm")
od.text((ogw / 2, 372), "find people · services · opportunities nearby", font=font(False, 27),
        fill=(199, 210, 254), anchor="mm")
ogp = os.path.join(OUT, "public", "og.png")
og.save(ogp)

for p in (sqp, p1, p2, ogp):
    print(os.path.basename(p), os.path.exists(p), round(os.path.getsize(p) / 1024), "KB")
print("DONE")
