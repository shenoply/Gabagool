"""Create a lightweight derivative of the supplied static toy car GLB."""
from pathlib import Path
import json,struct,io
import numpy as np
from PIL import Image
src=Path('/workspace/scratch/734d76fa7a6a/upload/toy_car._high-poly_model. (1).glb');b=src.read_bytes();ln=struct.unpack_from('<I',b,12)[0];g=json.loads(b[20:20+ln]);binary=b[28+ln:];oldviews=g['bufferViews'];olda=g['accessors'];buf=bytearray();views=[];access=[]
def read(i):
 a=olda[i];v=oldviews[a['bufferView']];dt=np.dtype({5126:'<f4',5125:'<u4',5123:'<u2',5121:'u1'}[a['componentType']]);dim={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4}[a['type']];off=v.get('byteOffset',0)+a.get('byteOffset',0);return np.ndarray((a['count'],dim),dtype=dt,buffer=binary,offset=off,strides=(v.get('byteStride',dt.itemsize*dim),dt.itemsize)).copy()
def store(raw):
 buf.extend(b'\0'*((-len(buf))%4));views.append({'buffer':0,'byteOffset':len(buf),'byteLength':len(raw)});buf.extend(raw);return len(views)-1
def acc(a,typ):
 a=np.asarray(a,dtype='<u4' if typ=='SCALAR' else '<f4');v=store(a.tobytes());d={'bufferView':v,'componentType':5125 if typ=='SCALAR' else 5126,'count':len(a),'type':typ}
 if typ=='VEC3':d.update(min=a.min(0).tolist(),max=a.max(0).tolist())
 access.append(d);return len(access)-1
count=0
for m in g['meshes']:
 for p in m['primitives']:
  arrays={k:read(i) for k,i in p['attributes'].items()};v=arrays['POSITION'];f=read(p['indices']).reshape(-1,3) if 'indices'in p else np.arange(len(v)).reshape(-1,3)
  step=np.ptp(v,axis=0).max()/48
  # Preserve UV boundaries while merging spatially adjacent vertices.
  key=np.round((v-v.min(0))/max(step,1e-6)).astype(int)
  if 'TEXCOORD_0'in arrays:key=np.c_[key,np.floor(arrays['TEXCOORD_0']*12).astype(int)]
  _,first,inv=np.unique(key,axis=0,return_index=True,return_inverse=True);ff=inv[f];ff=ff[(ff[:,0]!=ff[:,1])&(ff[:,1]!=ff[:,2])&(ff[:,0]!=ff[:,2])];_,idx=np.unique(np.sort(ff,axis=1),axis=0,return_index=True);ff=ff[np.sort(idx)];count+=len(ff)
  p['attributes']={k:acc(a[first],{2:'VEC2',3:'VEC3',4:'VEC4'}[a.shape[1]]) for k,a in arrays.items()};p['indices']=acc(ff.reshape(-1,1),'SCALAR')
for im in g.get('images',[]):
 v=oldviews[im['bufferView']];raw=binary[v.get('byteOffset',0):v.get('byteOffset',0)+v['byteLength']];pic=Image.open(io.BytesIO(raw));pic.thumbnail((1024,1024));out=io.BytesIO();pic.save(out,format='PNG');im['bufferView']=store(out.getvalue());im['mimeType']='image/png'
g['bufferViews']=views;g['accessors']=access;g['buffers']=[{'byteLength':len(buf)}];g['asset']['generator']='Gabagool car derivative: vertex clustering, 1K textures';j=json.dumps(g,separators=(',',':')).encode();j+=b' '*((-len(j))%4);buf+=b'\0'*((-len(buf))%4);out=Path(__file__).resolve().parents[1]/'toy-car77.glb';out.write_bytes(struct.pack('<III',0x46546c67,2,28+len(j)+len(buf))+struct.pack('<II',len(j),0x4e4f534a)+j+struct.pack('<II',len(buf),0x004e4942)+buf);print(count,'triangles;',out.stat().st_size,'bytes')
print('nodes',[(n.get('name'),n.get('rotation'),n.get('scale')) for n in g['nodes']][:12])
