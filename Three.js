// src/main.js
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 3, 8);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
scene.add(light);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ color: 0x333333 })
);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// Placeholder fighters
const fighterGeo = new THREE.BoxGeometry(1, 2, 1);
const p1 = new THREE.Mesh(fighterGeo, new THREE.MeshStandardMaterial({ color: 0x1e90ff }));
const p2 = new THREE.Mesh(fighterGeo, new THREE.MeshStandardMaterial({ color: 0xff5555 }));
p1.position.set(-2, 1, 0);
p2.position.set(2, 1, 0);
scene.add(p1, p2);

// Basic input
const keys = new Set();
window.addEventListener('keydown', e => keys.add(e.code));
window.addEventListener('keyup', e => keys.delete(e.code));

function update(dt) {
  const speed = 4 * dt;
  if (keys.has('KeyA')) p1.position.x -= speed;
  if (keys.has('KeyD')) p1.position.x += speed;
  if (keys.has('KeyQ')) p1.position.z -= speed; // sidestep
  if (keys.has('KeyE')) p1.position.z += speed;

  // simple chase AI
  const dir = Math.sign(p1.position.x - p2.position.x);
  p2.position.x += dir * speed * 0.6;
}

let last = performance.now();
function loop(now) {
  const dt = (now - last) / 1000;
  last = now;
  update(dt);
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
});