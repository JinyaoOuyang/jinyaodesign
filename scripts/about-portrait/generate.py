# About-portrait generator (B2.1). Deterministic seed. Reads public/about-face-mask.png, writes placed_B2.1.json.
# Dev-time only; never part of the client bundle. See README.md.
import os, sys, json, time, random
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from vocab_b1 import T1, T2, T3, T4, GROUT
OUT=os.path.dirname(os.path.abspath(__file__)); ROOT=os.path.dirname(os.path.dirname(OUT))   # repo root
W,H=575,596; SS=3; BG=(245,243,238); INK=(26,16,51)
FD='/System/Volumes/Data/usr/local/texlive/2021/texmf-dist/fonts/opentype/public/inter/'
FONTS={w:FD+f for w,f in {400:'Inter-Regular.otf',500:'Inter-Medium.otf',600:'Inter-SemiBold.otf',700:'Inter-Bold.otf',800:'Inter-ExtraBold.otf',900:'Inter-Black.otf'}.items() if os.path.exists(FD+f)}
def fpath(w): return FONTS[min(FONTS,key=lambda k:abs(k-w))]
_fc={};_mc={};_gc={}
def font(px,w):
    k=(round(px*SS),fpath(w)); 
    if k not in _fc: _fc[k]=ImageFont.truetype(k[1],k[0])
    return _fc[k]
def measure(t,px,w):
    k=(t,round(px*SS),fpath(w))
    if k not in _mc: bb=font(px,w).getbbox(t); _mc[k]=((bb[2]-bb[0])/SS,(bb[3]-bb[1])/SS,bb[0]/SS,bb[1]/SS)
    return _mc[k]
def glyph(t,px,w):
    k=(t,round(px*SS),fpath(w))
    if k not in _gc:
        tw,th,ox,oy=measure(t,px,w); gw,gh=int(np.ceil(tw))+2,int(np.ceil(th))+2
        im=Image.new('L',(gw*SS,gh*SS),0); ImageDraw.Draw(im).text(((1-ox)*SS,(1-oy)*SS),t,font=font(px,w),fill=255)
        g=np.asarray(im.resize((gw,gh),Image.BOX))>40
        gd=np.asarray(Image.fromarray((g*255).astype(np.uint8)).filter(ImageFilter.MaxFilter(3)))>0
        _gc[k]=(g,gd)
    return _gc[k]
# ---- fields ----
m=Image.open(ROOT+'/public/about-face-mask.png').convert('RGBA').resize((W,H),Image.LANCZOS)
tone=np.asarray(m)[...,3].astype(np.float32)/255.0
def blur(a,s): return np.asarray(Image.fromarray((a*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(s)),dtype=np.float32)/255.0
dens=blur(tone,2); detail=np.abs(tone-blur(tone,8)); detail/=detail.max()+1e-6
dil=np.asarray(Image.fromarray((tone*255).astype(np.uint8)).filter(ImageFilter.MaxFilter(5)),dtype=np.float32)/255.0
yy,xx=np.mgrid[0:H,0:W]; face=(((xx-0.50*W)/(0.135*W))**2+((yy-0.38*H)/(0.19*H))**2)<=1.0
face_x=np.asarray(Image.fromarray((face*255).astype(np.uint8)).filter(ImageFilter.MaxFilter(5)))>0   # Tier 1-3 exclusion (oval)
skin=face&(tone<0.50); skin_x=np.asarray(Image.fromarray((skin*255).astype(np.uint8)).filter(ImageFilter.MaxFilter(5)))>0  # Tier-4 texture stops at skin
FACE_MICRO=['design', 'build', 'code', 'ship', 'iterate', 'create', 'interaction', 'product', 'systems', 'prototype', 'mobile', 'visual', 'craft', 'Figma', 'React', 'TypeScript', 'Rive', 'Blender', 'Isleo', 'Trail', 'AI', 'HCI', 'UX', 'research', 'test', 'learn', 'explore', 'focus', 'world', 'experience', 'interface', 'motion', 'state', 'component', 'frontend', 'native', 'web', 'agent', 'Claude', 'Cursor', 'iOS', 'API', 'app', 'UI', 'pixel', 'judgment', 'taste', 'system', 'define', 'human', 'model', 'design', 'build', 'code', 'ship', 'iterate', 'create', 'interaction', 'product', 'systems', 'prototype', 'mobile', 'visual', 'craft', 'Figma', 'React', 'TypeScript', 'Rive', 'Blender', 'Isleo', 'Trail', 'AI', 'HCI', 'UX', 'research', 'test', 'learn', 'explore', 'focus', 'world', 'experience', 'interface', 'motion', 'state', 'component', 'frontend', 'native', 'web', 'agent', 'Claude', 'Cursor', 'iOS', 'API', 'app', 'UI', 'pixel', 'judgment', 'taste', 'system', 'define', 'human', 'model', 'hex', 'tile', 'map', 'clay', 'sync', 'timer', 'schema', 'layer', 'reveal', 'tokens', 'compose', 'generate', 'MCP', 'Expo', 'RN', 'MS', 'DTC', '3D', 'MVP', 'SaaS', 'QA', 'JSON', 'CSS', 'HTML', 'JS', 'SDK', 'LLM', 'grid', 'seed', 'node', 'spec', 'gate', 'path', 'flow', 'loop', 'slot', 'plan', 'edit', 'draw', 'hero', 'copy', 'tone', 'rule', 'fit', 'score', 'tag', 'list', 'card', 'icon', 'type', 'font', 'pan', 'zoom', 'tap', 'hit', 'ring', 'arc', 'pin', 'RN', 'MS', 'DTC', '3D', 'MVP', 'SaaS', 'QA', 'JSON', 'CSS', 'HTML', 'JS', 'SDK', 'LLM', 'grid', 'seed', 'node', 'spec', 'gate', 'path', 'flow', 'loop', 'slot', 'plan', 'edit', 'draw', 'hero', 'copy', 'tone', 'rule', 'fit', 'score', 'tag', 'list', 'card', 'icon', 'type', 'font', 'pan', 'zoom', 'tap', 'hit', 'ring', 'arc', 'pin']
# feature bands (fractions of H/W) used to label and pace the face strokes
BANDS={'brow':(0.24,0.29,0.36,0.64),'eye':(0.29,0.345,0.36,0.64),'nose':(0.345,0.45,0.44,0.56),'lips':(0.45,0.51,0.40,0.60),'jaw':(0.51,0.58,0.36,0.64)}
def sat(a): s=np.zeros((H+1,W+1),np.float64); s[1:,1:]=a.cumsum(0).cumsum(1); return s
S_tone,S_det,S_dil,S_face,S_detail=sat(tone),sat(dens),sat(dil),sat(face.astype(np.float32)),sat(detail)
def bm(S,x0,y0,x1,y1):
    x0=max(0,int(x0));y0=max(0,int(y0));x1=min(W,int(np.ceil(x1)));y1=min(H,int(np.ceil(y1)))
    return 0.0 if (x1<=x0 or y1<=y0) else (S[y1,x1]-S[y0,x1]-S[y1,x0]+S[y0,x0])/((x1-x0)*(y1-y0))

CFG={
 'B2.1':dict(name='B2.1 — face vocabulary (from B2)', t1=25,t2=(17,19),t3=(9.5,14.5),t4=(5.5,8), halo=0.40, skip=0.14, thr3=0.68, thr4=0.55, face_thr=0.56, ink=(0.66,1.0), w_dark=800, cluster=4, seed=22, cap4=6, capG=6, cap3tex=2),
}

def run(key):
    c=CFG[key]; t0=time.time(); rnd=random.Random(c['seed'])
    occ=np.zeros((H,W),bool); halo=np.zeros((H,W),bool); placed=[]; used={}
    img=Image.new('RGB',(W*SS,H*SS),BG); d=ImageDraw.Draw(img,'RGBA')
    def ink(t,tier):
        lo,hi=c['ink']; a=lo+(hi-lo)*max(0,min(1,(t-0.4)/0.6)); 
        if tier<=2: a=1.0
        return (*INK,int(255*a))
    def weight(t,tier,infc):
        if tier==1: return 800
        if tier==2: return 800
        if infc: return 600
        return c['w_dark'] if t>=0.88 else (700 if t>=0.7 else 600)
    def free_glyph(t,x,y,px,w,respect_halo,allow_face=False,tier_hint=3):
        g=glyph(t,px,w)[0]; y0,x0=int(y)-1,int(x)-1; gh,gw=g.shape
        if y0<0 or x0<0 or y0+gh>H or x0+gw>W: return False
        if not allow_face:
            excl = face_x if tier_hint<=3 else skin_x
            if (excl[y0:y0+gh,x0:x0+gw]&g).any(): return False
        if (occ[y0:y0+gh,x0:x0+gw]&g).any(): return False
        if respect_halo and (halo[y0:y0+gh,x0:x0+gw]&g).any(): return False
        return True
    def place(t,x,y,px,w,tone_,tier,halo_px=0):
        tw,th,ox,oy=measure(t,px,w); d.text(((x-ox)*SS,(y-oy)*SS),t,font=font(px,w),fill=ink(tone_,tier))
        g=glyph(t,px,w)[1]; y0,x0=int(y)-1,int(x)-1; gh,gw=g.shape
        ys,xs=slice(max(0,y0),min(H,y0+gh)),slice(max(0,x0),min(W,x0+gw)); occ[ys,xs]|=g[ys.start-y0:ys.stop-y0,xs.start-x0:xs.stop-x0]
        if halo_px>0:  # breathing room: only grout may enter, sparsely
            hy0,hx0,hy1,hx1=max(0,int(y-halo_px)),max(0,int(x-halo_px)),min(H,int(y+th+halo_px)),min(W,int(x+tw+halo_px)); halo[hy0:hy1,hx0:hx1]=True
        used[t]=used.get(t,0)+1; placed.append(dict(t=t,x=round(x,1),y=round(y,1),px=px,w=w,tier=tier,tone=round(float(tone_),3))); return (x+tw/2,y+th/2)
    # ---- tier 1 + 2: anchors with strong spread, no two in the same band ----
    centers=[]
    def search(t,px,w,thr,spread,detail_pen,tier,near=None,near_r=(60,120)):
        tw,th,_,_=measure(t,px,w); best=None; step=3
        for y in range(int(H*0.05),int(H*0.93-th),step):
            for x in range(4,int(W-tw-4),step):
                tm=bm(S_tone,x,y,x+tw,y+th)
                if tm<thr: continue
                if not free_glyph(t,x,y,px,w,tier>=3): continue
                sc=tm-detail_pen*bm(S_detail,x,y,x+tw,y+th)-1.0*bm(S_face,x-6,y-6,x+tw+6,y+th+6)
                cx,cy=x+tw/2,y+th/2
                for (ax,ay) in centers:
                    dd=((cx-ax)**2+(cy-ay)**2)**0.5
                    if dd<spread: sc-=(spread-dd)/spread*1.3
                    if abs(cy-ay)<th*1.6 and tier<=2: sc-=0.4
                if near:  # cluster bias for tier 3: sit near the previous phrase, not on it
                    dd=((cx-near[0])**2+(cy-near[1])**2)**0.5
                    sc+= 0.25 if near_r[0]<=dd<=near_r[1] else -0.15
                sc+=rnd.random()*0.03
                if best is None or sc>best[0]: best=(sc,x,y,tw,th)
        return best
    for t in T1:
        b=search(t,c['t1'],800,0.80,190,1.6,1)
        if b: _,x,y,tw,th=b; centers.append(place(t,x,y,c['t1'],800,1.0,1,halo_px=c['t1']*c['halo']))
    for t in T2:
        px=rnd.uniform(*c['t2']); b=search(t,px,800,0.80,150,1.4,2)
        if b: _,x,y,tw,th=b; centers.append(place(t,x,y,px,800,1.0,2,halo_px=px*c['halo']))
    # ---- tier 3: meaningful phrases, clustered in small groups, each phrase used at most twice ----
    t3=T3[:]; rnd.shuffle(t3); last=None; ingroup=0; tried=0
    for t in t3*2:
        if used.get(t,0)>=2: continue
        px=rnd.uniform(*c['t3']); px=round(px*2)/2
        # size follows the darkness of where it lands; heavier in hair
        b=search(t,px,700,c['thr3'],0,1.2,3,near=last if (last and ingroup<c['cluster']) else None)
        if not b: tried+=1; continue
        _,x,y,tw,th=b; tm=bm(S_tone,x,y,x+tw,y+th); w=weight(tm,3,False)
        last=place(t,x,y,px,w,tm,3,halo_px=px*c['halo']*0.5); ingroup=ingroup+1 if ingroup<c['cluster'] else 0
        if ingroup==0: last=None
    # ---- tier 4: grout — short phrases first, single tokens only where nothing else fits; face = strokes only ----
    def grout(vocab,band,thr,in_face,seed,cap):
        words=vocab[:]; r=random.Random(seed); r.shuffle(words); wi=0; lo,hi=band
        for y in range(2,int(H-lo),2):
            x=2
            while x<W-6:
                infc=face[min(H-1,y+2),min(W-1,x+3)]
                if infc!=in_face: x+=4; continue
                F=S_dil; th_=c['face_thr'] if infc else thr
                t=bm(F,x,y,x+lo*1.5,y+lo)
                if t<th_: x+=2; continue
                if not infc and r.random()<c['skip']: x+=int(lo*2); continue
                px=lo+(hi-lo)*min(1,max(0,(t-th_)/(1-th_)))-(hi-lo)*0.5*bm(S_detail,x,y,x+lo*1.5,y+lo)
                if infc: px=min(px,6.0)
                px=max(lo,min(hi,round(px*2)/2)); w=weight(t,4,infc)
                run=x
                while run<W-1 and bm(F,run,y,run+2,y+px)>=th_: run+=2
                avail=run-x
                if avail<10: x=int(run)+2; continue
                chosen=None
                for k in range(min(16,len(words))):
                    cand=words[(wi+k)%len(words)]
                    if used.get(cand,0)>=cap: continue
                    tw,thh,_,_=measure(cand,px,w)
                    if tw<=avail and free_glyph(cand,x,y,px,w,True,tier_hint=4): chosen=(cand,tw,thh); wi=(wi+k+1)%len(words); break
                if not chosen: x+=2; continue
                text,tw,thh=chosen; place(text,x,y,px,w,t,4); x=int(round(x+tw+px*0.25))
    grout(T4,c['t4'],c['thr4'],False,c['seed']*7,cap=c['cap4'])                 # short phrases as texture in hair/clothing
    short3=[t for t in T3 if len(t)<=22]
    grout(short3,(c['t4'][0],c['t4'][1]),c['thr4']+0.04,False,c['seed']*8,cap=2+c['cap3tex'])   # experiences recur small: the texture IS the story
    grout(GROUT,(c['t4'][0],6.5),c['thr4']+0.08,False,c['seed']*9,cap=c['capG'])  # single tokens: leftover gaps only
    # ---- FACE: stroke-following micro typography. Raw mask only. Words sit ON feature strokes, sized to them. ----
    def face_strokes(seed):
        r=random.Random(seed); words=FACE_MICRO[:]; r.shuffle(words); wi=0; count=0
        stroke=(tone>=0.50)&face
        # vertical thickness of the stroke at each pixel (for sizing): run length through (x,y) vertically
        thick=np.zeros((H,W),np.float32)
        for x in range(W):
            col=stroke[:,x]; y=0
            while y<H:
                if col[y]:
                    y1=y
                    while y1<H and col[y1]: y1+=1
                    thick[y:y1,x]=y1-y; y=y1
                else: y+=1
        def band_of(y,x):
            for name,(y0,y1,x0,x1) in BANDS.items():
                if y0*H<=y<y1*H and x0*W<=x<x1*W: return name
            return 'other'
        for y in range(int(H*0.20),int(H*0.58),2):
            x=int(W*0.34)
            while x<int(W*0.66):
                if not stroke[y,x]: x+=1; continue
                run=x
                while run<W and stroke[y,run]: run+=1
                L=run-x; b=band_of(y,x)
                minL={'eye':5,'lips':5,'nose':6}.get(b,7); minTh={'eye':1.0,'lips':1.2,'nose':1.4}.get(b,1.8)
                if L<minL: x=run+1; continue
                th_=float(np.median(thick[y,x:run]))
                if th_<minTh: x=run+1; continue                  # hairline noise, not a feature
                px=max(4.5,min(6.0,th_*0.75))
                tm=float(tone[y:min(H,y+int(px)),x:run].mean())
                w=700 if tm>=0.92 else (600 if tm>=0.72 else 500)
                yy0=y-max(0,(px-th_)/2)
                chosen=None
                for k in range(min(24,len(words))):
                    cand=words[(wi+k)%len(words)]; tw,thh,_,_=measure(cand,px,w)
                    if tw<=L and free_glyph(cand,x,yy0,px,w,False,allow_face=True): chosen=(cand,tw,thh); wi=(wi+k+1)%len(words); break
                if not chosen: x=run+1; continue
                text,tw,thh=chosen; place(text,x,yy0,px,w,tm,4); count+=1
                gap={'brow':0.18,'eye':0.15,'lips':0.18,'nose':0.35}.get(b,0.6)   # feature contours read as a line of words; skin stays sparse
                x=int(round(x+tw+max(2,tw*gap)))
        # thin leftovers: 4.5px, 1px scan, only where stroke pixels are still free
        for y in range(int(H*0.22),int(H*0.56),1):
            x=int(W*0.36)
            while x<int(W*0.64):
                if not stroke[y,x] or occ[y,x]: x+=1; continue
                run=x
                while run<W and stroke[y,run] and not occ[y,run]: run+=1
                L=run-x
                if L<5: x=run+1; continue
                tm=float(tone[y:min(H,y+5),x:run].mean()); w=600 if tm>=0.8 else 500; chosen=None
                for k in range(min(24,len(words))):
                    cand=words[(wi+k)%len(words)]; tw,thh,_,_=measure(cand,4.5,w)
                    if tw<=L and free_glyph(cand,x,y-0.5,4.5,w,False,allow_face=True): chosen=(cand,tw,thh); wi=(wi+k+1)%len(words); break
                if not chosen: x=run+1; continue
                text,tw,thh=chosen; place(text,x,y-0.5,4.5,w,tm,4); count+=1; x=int(round(x+tw+2))
        return count
    n_face=face_strokes(c['seed']*13)
    dt=time.time()-t0
    # ---- metrics ----
    mask=tone>=0.45; ink_img=np.asarray(img.convert('L').resize((W,H),Image.LANCZOS))<200
    tiers={1:[],2:[],3:[],4:[]}
    json.dump(placed,open(f'{OUT}/placed_{key}.json','w'))
    fw=[p for p in placed if face[min(H-1,int(p['y']+2)),min(W-1,int(p['x']+3))]]
    def glyph_in(p,region):
        g=glyph(p['t'],p['px'],p['w'])[0]; y0,x0=int(p['y'])-1,int(p['x'])-1; gh,gw=g.shape
        ys,xs=slice(max(0,y0),min(H,y0+gh)),slice(max(0,x0),min(W,x0+gw))
        return bool((region[ys,xs]&g[ys.start-y0:ys.stop-y0,xs.start-x0:xs.stop-x0]).any())
    t123_in_face=[p['t'] for p in placed if p['tier']<=3 and glyph_in(p,face)]
    t123_on_skin=[p['t'] for p in placed if p['tier']<=3 and glyph_in(p,skin)]
    band_counts={}
    for p in fw:
        for name,(y0,y1,x0,x1) in BANDS.items():
            if y0*H<=p['y']<y1*H and x0*W<=p['x']<x1*W: band_counts[name]=band_counts.get(name,0)+1; break
        else: band_counts['other']=band_counts.get('other',0)+1
    for p in placed: tiers[p['tier']].append(p['px'])
    uniq=len(used); rep=len(placed)/uniq
    top=sorted(used.items(),key=lambda kv:-kv[1])[:8]
    met=dict(candidate=c['name'],placed=len(placed),unique_phrases=uniq,repetition_rate=round(rep,2),most_repeated=top,
        size_by_tier={f'T{k}':dict(n=len(v),min=min(v) if v else None,max=max(v) if v else None,mean=round(float(np.mean(v)),1) if v else None) for k,v in tiers.items()},
        weights={str(w):sum(1 for p in placed if p['w']==w) for w in sorted(set(p['w'] for p in placed))},
        ink_coverage_pct=round(100*float((ink_img&mask).sum()/mask.sum()),1),
        face_coverage=dict(mask_pct=round(100*float((mask&face).sum()/face.sum()),1),ink_pct=round(100*float((ink_img&face).sum()/face.sum()),1)),
        anchors=[(p['t'],p['px'],p['w']) for p in placed if p['tier']<=2],
        face=dict(word_count=len(fw), sizes={str(s_):sum(1 for p in fw if p['px']==s_) for s_ in sorted(set(p['px'] for p in fw))},
                  weights={str(w_):sum(1 for p in fw if p['w']==w_) for w_ in sorted(set(p['w'] for p in fw))},
                  by_feature_band=band_counts, tier123_glyphs_inside_face_oval=t123_in_face, tier123_glyphs_on_skin=t123_on_skin,
                  vocabulary_used=sorted(set(p['t'] for p in fw))),
        gen_time_s=round(dt,1))
    img.resize((W,H),Image.LANCZOS).save(f'{OUT}/{key}.png'); img.resize((W*2,H*2),Image.LANCZOS).save(f'{OUT}/{key}@2x.png')
    return met,img

mets={};imgs={}
for k in CFG: mets[k],imgs[k]=run(k); print(k,'done',mets[k]['placed'],'placed, face words',mets[k]['face']['word_count'],'ink',mets[k]['ink_coverage_pct'],'%',mets[k]['gen_time_s'],'s',flush=True)
json.dump(mets,open(OUT+'/metrics_b21.json','w'),indent=1)
print('wrote placed_B2.1.json — now run build-data.py')
