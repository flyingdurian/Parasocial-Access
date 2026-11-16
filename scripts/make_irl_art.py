#!/usr/bin/env python3
"""Pixel-level authored assets. Runtime draws PNG sprite frames, not vector figures."""
from pathlib import Path
from PIL import Image, ImageDraw
import random

ROOT=Path(__file__).resolve().parents[1]/'assets'
ROOT.mkdir(exist_ok=True)
random.seed(70)

im=Image.new('RGBA',(384,216),'#141729')
d=ImageDraw.Draw(im)
def rect(x0,y0,x1,y1,color): d.rectangle((x0,y0,x1,y1),fill=color)
def line(points,color,width=1): d.line(points,fill=color,width=width)

# Back wall / lighting / masonry
rect(0,0,383,128,'#20263e')
for y in (13,32,51,70,89,108):
    rect(0,y,383,y+1,'#29334d')
for x in range(0,384,32):
    rect(x,1,x+1,112,'#1b2237')
for x in (19,365):
    rect(x-9,5,x+9,9,'#6ae8da');rect(x-11,10,x+11,13,'#47758c')
    for i in range(4):
        rect(x-17-i,14+i*3,x+17+i,15+i*3,('#294e68' if i%2 else '#315a76'))
rect(0,118,383,215,'#4c4b65')
for y in range(120,216,12):
    rect(0,y,383,y+1,'#59566f')
for x in range(0,384,18):
    rect(x,119,x+1,215,'#47445d')
for y in range(126,215,24):
    for x in range((y*3)%25,384,47):
        rect(x,y,x+5,y+1,'#706881')

# Stage and lighted gantry
rect(118,23,328,112,'#101727')
rect(121,26,325,101,'#262a46')
rect(128,33,319,91,'#14192c')
for i in range(10):
    xx=130+i*18
    rect(xx,25,xx+7,27,('#f9a96a' if i%2 else '#8ee8db'))
rect(146,33,301,52,'#435079')
rect(149,36,298,49,'#1c2845')
rect(153,40,294,41,'#91bfea')
rect(153,45,294,46,'#d6a0cf')
rect(162,57,285,61,'#5a395a')
for x in (134,314):
    rect(x,28,x+6,98,'#252f48')
    for y in range(35,95,8):rect(x+2,y,x+4,y+3,'#ad75bd')
rect(115,98,332,115,'#5a435d')
rect(113,112,335,123,'#302d45')
rect(123,103,324,106,'#b67da0')
rect(126,109,322,113,'#292943')

# Banner and text in authored bitmap
font_image=Image.new('RGBA',(384,216))
fd=ImageDraw.Draw(font_image)
fd.text((177,36),'DESTINY • LIVE',fill='#ffdbb4')
fd.text((181,63),'MEET  &  GREET',fill='#8ee8e2')
im=Image.alpha_composite(im,font_image);d=ImageDraw.Draw(im)

# Table, signed cards, and a stand microphone
rect(182,88,273,103,'#51354a')
rect(180,86,274,90,'#c9899c')
rect(184,91,272,92,'#e4a5a3')
for x in (189,259): rect(x,101,x+6,115,'#322b43')
rect(217,82,238,86,'#cfc8ac')
rect(219,80,231,82,'#fff0c9')
rect(279,75,281,98,'#aaa7af')
rect(276,72,284,77,'#2d354b')
rect(278,98,290,100,'#666b86')

# Entrance, merch counter and crowd railings
rect(5,55,94,128,'#2b314b')
rect(11,60,88,110,'#132338')
rect(15,64,84,107,'#33455d')
rect(19,69,36,91,'#547c7a')
rect(39,69,57,91,'#b47b96')
rect(60,69,80,91,'#806a9f')
rect(12,99,90,107,'#795c69')
rect(10,108,92,116,'#4e414f')
rect(8,118,96,125,'#b18a78')
rect(25,42,75,52,'#6c4267')
rect(28,45,71,49,'#e0c1ad')
rect(343,51,382,128,'#232a43')
rect(348,56,376,103,'#496076')
rect(350,65,375,77,'#77576d')
rect(352,68,373,73,'#dfb98e')
rect(350,104,381,116,'#ae857f')
rect(350,116,383,124,'#463345')
for x,y in ((97,148),(185,171),(272,151),(313,184)):
    rect(x,y-5,x+2,y+14,'#d9b58c')
    rect(x-2,y-7,x+4,y-3,'#f5cba8')
    rect(x+2,y+14,x+29,y+16,'#bb8275')
    rect(x+2,y+17,x+29,y+18,'#6a4a57')
rect(0,206,383,215,'#262b43')
rect(5,207,379,209,'#d1819c')
im.save(ROOT/'irl-hall.png',optimize=True)

# 4 frame images for each of 13 24 x 40 characters.
sheet=Image.new('RGBA',(24*4,40*13),(0,0,0,0))
colours=[
  ('#3a4665','#d4a074','#393b53','#aad5eb'), # Destiny on stage
  ('#60a3c0','#e4b38a','#322f4f','#fbe6af'),
  ('#bb638a','#a96950','#302b48','#e2f2fd'),
  ('#84b56c','#e2a97e','#58392f','#fff4b5'),
  ('#edbc6d','#694a3c','#2d3650','#b5f0cc'),
  ('#9f81d6','#bd886a','#4d352e','#ffd7e9'),
  ('#de8d6f','#ebbc97','#292d40','#b8e3f0'),
  ('#578c85','#664535','#343851','#efd6b8'),
  ('#6f92bc','#dcac90','#a3a9ca','#eef5cb'),
  ('#a5a4b7','#926e59','#1b273f','#e8a0b1'),
  ('#b4a166','#d4a482','#372e39','#e4e8bf'),
  ('#8b68aa','#7b5141','#252d3f','#f0d69e'),
  ('#5d697d','#c7916c','#302c38','#92e3c9'),
]
for index,(shirt,skin,hair,accent) in enumerate(colours):
 for frame in range(4):
    sprite=Image.new('RGBA',(24,40),(0,0,0,0));s=ImageDraw.Draw(sprite)
    jog=1 if frame in (1,3) else 0
    s.ellipse((2,34,21,38),fill=(17,18,31,100))
    s.rectangle((7,25,11,34+jog),fill='#1b263c');s.rectangle((13,25,17,34+(0 if jog else 1)),fill='#1b263c')
    s.rectangle((5,33+jog,11,36+jog),fill='#171c2e')
    s.rectangle((13,33+(0 if jog else 1),19,36+(0 if jog else 1)),fill='#171c2e')
    s.rectangle((4,14,19,26),fill='#172336')
    s.rectangle((6,14,17,26),fill=shirt)
    s.rectangle((7,15,16,17),fill=accent)
    s.rectangle((2,16,5,25-(frame%2)),fill=skin)
    s.rectangle((18,16,21,25-(frame%2)),fill=skin)
    s.rectangle((8,2,16,15),fill='#211c2e')
    s.rectangle((7,4,17,13),fill=skin)
    s.rectangle((7,3,17,6),fill=hair)
    s.rectangle((6,5,8,12),fill=hair)
    s.rectangle((16,4,18,10),fill=hair)
    s.point((10,10),fill='#242131');s.point((15,10),fill='#242131')
    s.rectangle((11,13,14,13),fill='#975e5c')
    if index==0:
      s.rectangle((8,2,17,6),fill='#44332e')
      s.rectangle((7,16,17,24),fill='#273142')
      s.rectangle((10,17,14,19),fill='#d0bd91')
    if index==11:
      s.rectangle((5,17,18,20),fill='#d3ad5c')
    sheet.alpha_composite(sprite,(frame*24,index*40))
sheet.save(ROOT/'irl-people.png',optimize=True)
print('Generated 384x216 hall and 13 sprites x4 frames')
