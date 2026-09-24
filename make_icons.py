# Generates icons/icon{16,32,48,128}.png: a dark disc with a white bar (the stripped query).
from PIL import Image, ImageDraw
for size in (16, 32, 48, 128):
    s = size * 8
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.ellipse((0, 0, s - 1, s - 1), fill=(20, 20, 20, 255))
    h = s * 0.14
    d.rounded_rectangle((s * 0.24, s / 2 - h / 2, s * 0.76, s / 2 + h / 2), radius=h / 2, fill=(255, 255, 255, 255))
    img.resize((size, size), Image.LANCZOS).save(f"icons/icon{size}.png")
