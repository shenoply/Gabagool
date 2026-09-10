from pathlib import Path
import json,struct,io
import numpy as np
from PIL import Image
P=Path(__file__).resolve().parents[1];U=P.parent/'upload'
assets=[('picnic_table_-_low_poly.glb','picnic78',0),('log_pile_game_ready__2k_pbr.glb','logs78',0),('garden_gnomes_01.glb','gnomes78',56),('door_metallic_garden_villa_-_12mb.glb','gate78',40),('colorful_rubber_swimming_pool_2_inflatable.glb','pool78',42),('182315a50a104c5fa512abd15cf02c82.glb','path78',0),('animated_low-poly_spider_game-ready (1).glb','spider78',0),('railing_low_poly.glb','railing78',0),('toy_car._high-poly_model. (1).glb','toy-car77',48)]
report=[]
for filename,name,res in assets:
 b=(U/filename).read_bytes();ln=struct.unpack_from('<I',b,12)[0];g=json.loads(b[20:20+ln]);raw=b[28+ln:];oldv=g['bufferViews'];olda=g['accessors'];out=bytearray();views=[];accs=[]
 # These assets use clean game-side materials. Discard their costly source texture stack.
 if name in {'toy-car77','pool78','gate78'}:
  for m in g.get('materials',[]):
   p=m.get('pbrMetallicRoughness',{});p.pop('baseColorTexture',None);p.pop('metallicRoughnessTexture',None)
   for k in ['normalTexture','occlusionTexture','emissiveTexture']:m.pop(k,None)
   m.pop('extensions',None)
  g['images']=[];g['textures']=[];g['samplers']=[]
 def read(i):
  a=olda[i];v=oldv[a['bufferView']];dt=np.dtype({5126:'<f4',5125:'<u4',5123:'<u2',5122:'<i2',5121:'u1'}[a['componentType']]);dim={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4,'MAT4':16}[a['type']];return np.ndarray((a['count'],dim),dtype=dt,buffer=raw,offset=v.get('byteOffset',0)+a.get('byteOffset',0),strides=(v.get('byteStride',dt.itemsize*dim),dt.itemsize)).copy()
 def store(data):
  out.extend(b'\0'*((-len(out))%4));views.append({'buffer':0,'byteOffset':len(out),'byteLength':len(data)});out.extend(data);return len(views)-1
 def add(a,typ,component=5126):
  a=np.asarray(a,dtype={5126:'<f4',5125:'<u4',5123:'<u2',5122:'<i2',5121:'u1'}[component]);d={'bufferView':store(a.tobytes()),'componentType':component,'count':len(a),'type':typ}
  if typ in ['VEC3','SCALAR']:d.update(min=a.min(0).tolist(),max=a.max(0).tolist())
  accs.append(d);return len(accs)-1
 if not res:
  for i,a in enumerate(olda):
   add(read(i),a['type'],a['componentType'])
   if 'normalized'in a:accs[-1]['normalized']=a['normalized']
 count=0
 for m in g['meshes']:
  for q in m['primitives']:
   v=read(q['attributes']['POSITION']);f=read(q['indices']).reshape(-1,3) if 'indices'in q else np.arange(len(v)).reshape(-1,3)
   if res:
    arrays={k:read(i) for k,i in q['attributes'].items()};step=max(np.ptp(v,axis=0).max()/res,1e-7);key=np.round((v-v.min(0))/step).astype(int)
    if 'TEXCOORD_0'in arrays:key=np.c_[key,np.floor(arrays['TEXCOORD_0']*(128 if name=='gnomes78' else 24)).astype(int)]
    _,first,inv=np.unique(key,axis=0,return_index=True,return_inverse=True);f=inv[f];f=f[(f[:,0]!=f[:,1])&(f[:,1]!=f[:,2])&(f[:,0]!=f[:,2])];_,ix=np.unique(np.sort(f,axis=1),axis=0,return_index=True);f=f[np.sort(ix)];q['attributes']={k:add(a[first],{2:'VEC2',3:'VEC3',4:'VEC4'}[a.shape[1]]) for k,a in arrays.items()};q['indices']=add(f.reshape(-1,1),'SCALAR',5125)
   count+=len(f)
 for im in g.get('images',[]):
  v=oldv[im['bufferView']];pic=Image.open(io.BytesIO(raw[v.get('byteOffset',0):v.get('byteOffset',0)+v['byteLength']]));pic.thumbnail((768,768));stream=io.BytesIO();alpha=pic.mode=='RGBA' and pic.getextrema()[3][0]<255
  if alpha:pic.save(stream,format='PNG',optimize=True);mime='image/png'
  else:pic.convert('RGB').save(stream,format='JPEG',quality=88);mime='image/jpeg'
  im['bufferView']=store(stream.getvalue());im['mimeType']=mime
 g['bufferViews']=views;g['accessors']=accs;g['buffers']=[{'byteLength':len(out)}];g['asset']['generator']='Gabagool optimized supplied asset';j=json.dumps(g,separators=(',',':')).encode();j+=b' '*((-len(j))%4);out+=b'\0'*((-len(out))%4);dest=P/(name+'.glb');dest.write_bytes(struct.pack('<III',0x46546c67,2,28+len(j)+len(out))+struct.pack('<II',len(j),0x4e4f534a)+j+struct.pack('<II',len(out),0x004e4942)+out)
 row={'file':dest.name,'triangles':count,'bytes':dest.stat().st_size,'animations':[a['name'] for a in g.get('animations',[])]};report.append(row);print(row,flush=True)
(P/'asset-report78.json').write_text(json.dumps(report,indent=2))
