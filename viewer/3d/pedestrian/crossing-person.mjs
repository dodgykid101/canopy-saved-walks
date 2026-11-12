import * as THREE from 'three';

// Enlarged, camera-facing marker. Feet remain on the saved route coordinates.
export function createCrossingPerson(label='Person'){
 const group=new THREE.Group();group.name='crossing-person';const textures=[];
 const frames=[null,...Array.from({length:8},(_,i)=>Math.sin(i*Math.PI/4))].map(swing=>{
  const canvas=document.createElement('canvas');canvas.width=128;canvas.height=224;const c=canvas.getContext('2d');
  const limb=(points,color,width)=>{for(const [stroke,w] of [['#fff',width+7],[color,width]]){c.beginPath();c.moveTo(...points[0]);for(const p of points.slice(1))c.lineTo(...p);c.strokeStyle=stroke;c.lineWidth=w;c.lineCap='round';c.lineJoin='round';c.stroke()}};
  const s=swing||0;
  limb([[54,139],[51-12*s,175],[49-23*s,209]],'#20344d',15);
  limb([[74,139],[77+12*s,175],[79+23*s,209]],'#20344d',15);
  limb([[44,83],[32-7*s,112],[28-13*s,141]],'#2096ed',13);
  limb([[84,83],[96+7*s,112],[100+13*s,141]],'#2096ed',13);
  c.fillStyle='#2096ed';c.strokeStyle='white';c.lineWidth=6;c.beginPath();c.roundRect(40,69,48,81,15);c.fill();c.stroke();
  c.fillStyle='#ffd09a';c.strokeStyle='white';c.lineWidth=5;c.beginPath();c.arc(64,40,23,0,Math.PI*2);c.fill();c.stroke();
  c.fillStyle='#20344d';c.beginPath();c.arc(64,35,23,Math.PI,2*Math.PI);c.fill();
  const texture=new THREE.CanvasTexture(canvas);textures.push(texture);return texture;
 });
 const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:frames[0],depthTest:false,depthWrite:false}));sprite.center.set(.5,0);sprite.scale.set(5.5,9.625,1);sprite.renderOrder=100;group.add(sprite);
 const halo=new THREE.Mesh(new THREE.RingGeometry(1.7,2.2,40),new THREE.MeshBasicMaterial({color:0xffdc42,side:THREE.DoubleSide,depthTest:false,depthWrite:false}));halo.rotation.x=-Math.PI/2;halo.renderOrder=95;group.add(halo);
 const nameCanvas=document.createElement('canvas');nameCanvas.width=512;nameCanvas.height=96;const nameTexture=new THREE.CanvasTexture(nameCanvas);textures.push(nameTexture);
 const name=new THREE.Sprite(new THREE.SpriteMaterial({map:nameTexture,depthTest:false,depthWrite:false}));name.position.y=12;name.scale.set(16,3,1);name.renderOrder=101;group.add(name);
 let lastStatus='';
 function setPose(status,seconds){
  sprite.material.map=(status==='Crossing'||status==='Walking')?frames[1+Math.floor(Math.max(0,seconds)*8)%8]:frames[0];
  group.userData.status=status;
  if(status!==lastStatus){const c=nameCanvas.getContext('2d');c.clearRect(0,0,512,96);c.fillStyle='#102738';c.fillRect(0,0,512,96);c.strokeStyle='#ffdc42';c.lineWidth=6;c.strokeRect(3,3,506,90);c.font='bold 43px Arial';c.fillStyle='#fff';c.textAlign='center';c.textBaseline='middle';c.fillText(label+' · '+status,256,49);nameTexture.needsUpdate=true;lastStatus=status}
 }
 const updateCamera=camera=>name.position.set(0,12,0).applyQuaternion(camera.quaternion);
 setPose('Waiting',0);return {group,textures,setPose,updateCamera};
}
