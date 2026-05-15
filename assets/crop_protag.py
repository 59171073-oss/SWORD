from PIL import Image
import sys

img = Image.open('/workspace/assets/protagonist_6star.jpg')
w, h = img.size
print(f"Image size: {w}x{h}")

# 6 cards in a row, crop each one
card_width = w // 6

names = [
    'protagonist_star1.jpg',  # 1星 武林新秀
    'protagonist_star2.jpg',  # 2星 武馆学徒
    'protagonist_star3.jpg',  # 3星 江湖名士
    'protagonist_star4.jpg',  # 4星 武林名宿
    'protagonist_star5.jpg',  # 5星 一代宗师
    'protagonist_star6.jpg',  # 6星 剑神至尊
]

for i in range(6):
    left = i * card_width
    right = (i + 1) * card_width if i < 5 else w
    cropped = img.crop((left, 0, right, h))
    cropped.save(f'/workspace/assets/{names[i]}', quality=90)
    print(f"Saved {names[i]}: {cropped.size}")

print("Done!")
