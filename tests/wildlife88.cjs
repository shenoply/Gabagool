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

console.log('PASS: Build 88 script syntax, seven uploaded GLBs, animation clips and wildlife hooks.');
