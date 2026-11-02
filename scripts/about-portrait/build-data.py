# Builds lib/aboutPortrait.ts from the approved B2.1 placement (scripts/about-portrait/placed_B2.1.json).
# Dev-time only — never imported by the client bundle. Regenerate the placement with generate.py (deterministic seed).
import json, re, io, os
from PIL import ImageFont
HERE=os.path.dirname(os.path.abspath(__file__)); ROOT=os.path.dirname(os.path.dirname(HERE))
W,H,SS=575,596,3
FD='/System/Volumes/Data/usr/local/texlive/2021/texmf-dist/fonts/opentype/public/inter/'
F={500:'Inter-Medium.otf',600:'Inter-SemiBold.otf',700:'Inter-Bold.otf',800:'Inter-ExtraBold.otf'}
def metrics(t,px,w):
    f=ImageFont.truetype(FD+F[w],round(px*SS)); bb=f.getbbox(t); asc,_=f.getmetrics()
    return bb[0]/SS, bb[1]/SS, asc/SS, (bb[2]-bb[0])/SS, (bb[3]-bb[1])/SS
items=json.load(open(HERE+'/placed_B2.1.json'))
# fill-opacity exactly as the generator's ink(): tiers 1-2 solid, else 0.66 + 0.34 * clamp((tone-0.4)/0.6)
for p in items:
    if 'a' not in p: p['a']=1.0 if p['tier']<=2 else round(0.66+0.34*max(0,min(1,(p['tone']-0.4)/0.6)),3)
# ---- the 14 stories (order = KEY order in components/AboutWordCloud.tsx) and the phrases that own them ----
STORIES=['FLEXI-CASA','Design Engineer','Trail','AI-Native','Growth & Tooling','University of Washington','Imagine Cup','TEAGUE','Silkroad','Grand Rapids','Medium','Mandarin & English','Strength Training','Cursor & Claude']
OWNS={'FLEXI-CASA':['FLEXI-CASA'],'Design Engineer':['Design Engineer'],'Trail':['Trail'],'AI-Native':['AI-Native'],
      'University of Washington':['Global Innovation Exchange'],'Imagine Cup':['Imagine Cup'],'Medium':['Writing on Medium'],
      'Mandarin & English':['Mandarin & English'],'Strength Training':['Strength training'],
      # the five below had no phrase in B2.1: their text is swapped INTO a second-instance duplicate slot of matching width (see below)
      'Growth & Tooling':['Growth & Tooling'],'TEAGUE':['TEAGUE'],'Silkroad':['Silkroad Visual Technology','Silkroad'],
      'Grand Rapids':['Grand Rapids, MI','Grand Rapids'],'Cursor & Claude':['Cursor and Claude']}
present={p['t'] for p in items}
missing=[s for s in STORIES if not any(t in present for t in OWNS[s])]
# ---- substitution: second instances of duplicated Tier-3 phrases, closest width at the SAME px/weight; never overflow (<=104%) ----
from collections import defaultdict
seen=defaultdict(int); dup_slots=[]
for i,p in enumerate(items):
    if p['tier']!=3: continue
    seen[p['t']]+=1
    if seen[p['t']]>=2: dup_slots.append(i)
protected={'FLEXI-CASA','Imagine Cup','Global Innovation Exchange','Writing on Medium','Mandarin & English','Strength training'}
subs=[]
for s in missing:
    best=None
    for cand in OWNS[s]:
        for i in dup_slots:
            p=items[i]
            if p['t'] in protected or any(i==b[0] for b in subs): continue
            old_w=metrics(p['t'],p['px'],p['w'])[3]; new_w=metrics(cand,p['px'],p['w'])[3]
            if new_w>old_w*1.04: continue
            score=old_w-new_w                      # prefer the tightest fit (least new whitespace)
            if best is None or score<best[0]: best=(score,i,cand,old_w,new_w)
    if best is None: raise SystemExit(f'no slot fits {s}')
    subs.append((best[1],best[2],best[3],best[4],s))
    items[best[1]]['t']=best[2]
# ---- story index on every instance that owns a story (Tier <=3 only; face grout never interactive) ----
owner={}
for s_i,s in enumerate(STORIES):
    for t in OWNS[s]: owner[t]=s_i
for p in items:
    if p['tier']<=3 and p['t'] in owner: p['s']=owner[p['t']]
# ---- SVG metrics + hit rects (viewBox units), overlap-checked among interactive words only ----
for p in items:
    ox,oy,asc,wd,ht=metrics(p['t'],p['px'],p['w']); p['sx']=round(p['x']-ox,2); p['sy']=round(p['y']-oy+asc,2); p['wd']=round(wd,2); p['ht']=round(ht,2)
inter=[p for p in items if 's' in p]
PX,PY=8.0,7.0
def rect(p,px_,py_): return [round(p['x']-px_,1),round(p['y']-py_,1),round(p['wd']+2*px_,1),round(p['ht']+2*py_,1)]
for p in inter: p['hit']=rect(p,PX,PY)
def ov(a,b): return a[0]<b[0]+b[2] and b[0]<a[0]+a[2] and a[1]<b[1]+b[3] and b[1]<a[1]+a[3]
for _ in range(6):
    clashes=[(a,b) for i,a in enumerate(inter) for b in inter[i+1:] if a['s']!=b['s'] and ov(a['hit'],b['hit'])]
    if not clashes: break
    for a,b in clashes:
        for p in (a,b): p['hit']=rect(p,max(2,(p['hit'][2]-p['wd'])/2-1.5),max(1.5,(p['hit'][3]-p['ht'])/2-1))
# final fallback: if two phrases still touch, the smaller one keeps only its own ink box — the words never move
for a in inter:
    for b in inter:
        if a is not b and a['s']!=b['s'] and ov(a['hit'],b['hit']):
            small=a if a['px']<=b['px'] else b; small['hit']=rect(small,0,0); print('   overlap fallback: %r keeps ink-box hit only (vs %r)'%(small['t'],(b if small is a else a)['t']))
# ---- emit TS ----
def q(s): return json.dumps(s)
rows=[]
for p in items:
    r=f"  {{ t: {q(p['t'])}, x: {p['sx']}, y: {p['sy']}, px: {round(p['px'],2)}, w: {p['w']}, a: {p['a']}, tier: {p['tier']}"
    if 's' in p: r+=f", s: {p['s']}, hit: [{', '.join(str(v) for v in p['hit'])}]"
    rows.append(r+' },')
ts=f"""// GENERATED by scripts/about-portrait/build-data.py — do not edit by hand.
// Approved composition B2.1 (frozen geometry). x/y are SVG pen-x and baseline-y in a
// {W}x{H} viewBox; px = font-size in viewBox units; a = fill-opacity from local tone.
// s = index into KEY in components/AboutWordCloud.tsx for the phrases that own a story;
// hit = invisible tap rect [x, y, w, h] for those phrases, overlap-checked.
export const PORTRAIT_W = {W}
export const PORTRAIT_H = {H}

export type PortraitWord = {{
  t: string
  x: number
  y: number
  px: number
  w: 500 | 600 | 700 | 800
  a: number
  tier: 1 | 2 | 3 | 4
  s?: number
  hit?: [number, number, number, number]
}}

export const PORTRAIT_WORDS: PortraitWord[] = [
{chr(10).join(rows)}
]
"""
io.open(ROOT+'/lib/aboutPortrait.ts','w').write(ts)
print('wrote lib/aboutPortrait.ts:',len(items),'words |',len(inter),'interactive instances |',len(set(p['s'] for p in inter)),'stories covered')
print('substitutions (slot text -> new text, width old -> new, at px/w):')
for i,cand,ow,nw,s in subs: p=items[i]; print(f"   '{[x for x in json.load(open(HERE+'/placed_B2.1.json'))][i]['t']}' -> '{cand}'  {ow:.1f} -> {nw:.1f}  @ {p['px']}px/{p['w']}  (story: {s})  at ({p['x']},{p['y']})")
print('remaining hit overlaps:',len([(a,b) for i,a in enumerate(inter) for b in inter[i+1:] if a['s']!=b['s'] and ov(a['hit'],b['hit'])]))
print('hit sizes (viewBox units):',sorted(set((round(p['hit'][2]),round(p['hit'][3])) for p in inter)))
