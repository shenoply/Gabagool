const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const match of source.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)) new vm.Script(match[1]);

const expected = {
  gecko: ['Lizard_Idle', 'Lizard_walking'],
  snake: ['Animation'],
  ant: ['walk'],
  cat: ['run', 'Walk'],
  plants: [],
  cityprops: [],
  rat: [],
};

for (const [file, clips] of Object.entries(expected)) {
  const packed = JSON.parse(fs.readFileSync(path.join(root, 'assets87', file + '.json'), 'utf8'));
  const bytes = require('zlib').gunzipSync(Buffer.from(packed.data, 'base64'));
  assert.equal(bytes.toString('ascii', 0, 4), 'glTF', `${file} must be a valid binary glTF`);
  const jsonLength = bytes.readUInt32LE(12);
  const gltf = JSON.parse(bytes.subarray(20, 20 + jsonLength).toString().replace(/[\0 ]+$/, ''));
  const names = (gltf.animations || []).map(a => a.name);
  for (const clip of clips) assert(names.some(name => name.includes(clip)), `${file} is missing ${clip}`);
  assert(source.includes(`load88('${file}'`), `${file} must be loaded by the game`);
}

for (const feature of ['Tameable uploaded gecko', 'Uploaded warning snake', 'Uploaded roaming cat', 'Uploaded crumb-carrying ant', 'Uploaded neighbour rat']) {
  assert(source.includes(feature), `${feature} must be integrated`);
}

assert(source.includes("actor88(a,.78"), 'gecko must use the larger Build 89 scale');
assert(source.includes('u.seated41=true'), 'gecko riding must pose Pip');
assert(source.includes('function tickRatNpc88'), 'neighbour rat must wander instead of rotating in place');
assert(source.includes('function styleCat88'), 'cat must replace the broken source material');
assert(source.includes('c.mixer.timeScale=2.05'), 'cat run animation must be accelerated');

console.log('PASS: Build 89 script syntax, packed assets, cat material/speed, gecko riding and rat wandering.');
