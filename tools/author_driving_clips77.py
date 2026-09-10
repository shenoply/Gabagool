"""Append four reusable driving clips to Pip's existing GLB, preserving its rig."""
from pathlib import Path
import struct,json,copy,numpy as np
from scipy.spatial.transform import Rotation
p=Path(__file__).resolve().parents[1]/'rat-animation-pack67.glb';b=p.read_bytes();ln=struct.unpack_from('<I',b,12)[0];g=json.loads(b[20:20+ln]);raw=bytearray(b[28+ln:]);g['animations']=[a for a in g['animations'] if not a.get('name','').startswith('Drive_')];idle=next(a for a in g['animations'] if a['name'] in ['Idle_4','Idle']);nodes={n.get('name'):i for i,n in enumerate(g['nodes'])}
def read(i):
 a=g['accessors'][i];v=g['bufferViews'][a['bufferView']];dim={'SCALAR':1,'VEC3':3,'VEC4':4}[a['type']];return np.frombuffer(raw,dtype='<f4',count=a['count']*dim,offset=v.get('byteOffset',0)+a.get('byteOffset',0)).copy().reshape(-1,dim)
def store(a,typ):
 a=np.asarray(a,dtype='<f4');raw.extend(b'\0'*((-len(raw))%4));g['bufferViews'].append({'buffer':0,'byteOffset':len(raw),'byteLength':a.nbytes});raw.extend(a.tobytes());d={'bufferView':len(g['bufferViews'])-1,'componentType':5126,'count':len(a),'type':typ}
 if typ=='SCALAR':d.update(min=[float(a.min())],max=[float(a.max())])
 g['accessors'].append(d);return len(g['accessors'])-1
base={}
for c in idle['channels']:
 s=idle['samplers'][c['sampler']];base[(c['target']['node'],c['target']['path'])]=read(s['output'])[0]
for name,steer,horn in [('Drive_Idle',0,0),('Drive_Steer_Left',-1,0),('Drive_Steer_Right',1,0),('Drive_Honk',0,1)]:
 times=np.linspace(0,1.2,5);ti=store(times,'SCALAR');anim={'name':name,'samplers':[],'channels':[]};poses={'LeftUpLeg':[-1.35,0,0],'RightUpLeg':[-1.35,0,0],'LeftLeg':[1.4,0,0],'RightLeg':[1.4,0,0],'Spine':[.13,0,-steer*.06],'Head':[0,steer*.18,0],'LeftArm':[-.55,0,-.6],'RightArm':[-.55,0,.6],'LeftForeArm':[-.9,0,0],'RightForeArm':[-.9,0,0]};tracks={key:np.tile(v,(5,1)) for key,v in base.items()}
 for bone,angles in poses.items():
  idx=nodes[bone];q=base.get((idx,'rotation'),g['nodes'][idx].get('rotation',[0,0,0,1]));values=[]
  for t in times:
   a=angles.copy()
   if bone=='RightForeArm':a[0]-=horn*np.sin(t/1.2*np.pi)*.35
   if 'Arm'in bone:a[1]+=steer*.12
   if bone=='Spine':a[0]+=np.sin(t/1.2*np.pi*2)*.015
   values.append((Rotation.from_quat(q)*Rotation.from_euler('XYZ',a)).as_quat())
  tracks[(idx,'rotation')]=np.array(values)
 for (node,path),values in tracks.items():
  out=store(values,'VEC4' if path=='rotation' else 'VEC3');anim['samplers'].append({'input':ti,'output':out,'interpolation':'LINEAR'});anim['channels'].append({'sampler':len(anim['samplers'])-1,'target':{'node':node,'path':path}})
 g['animations'].append(anim)
g['buffers'][0]['byteLength']=len(raw);j=json.dumps(g,separators=(',',':')).encode();j+=b' '*((-len(j))%4);raw+=b'\0'*((-len(raw))%4);p.write_bytes(struct.pack('<III',0x46546c67,2,28+len(j)+len(raw))+struct.pack('<II',len(j),0x4e4f534a)+j+struct.pack('<II',len(raw),0x004e4942)+raw);print('Preserved original rig and clips; added', [a['name'] for a in g['animations'] if a['name'].startswith('Drive_')])
