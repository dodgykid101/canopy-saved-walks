import * as THREE from 'three';

export function walkSignalState(program,time){
 const period=program.red_s+program.green_s+program.clearance_s;
 const phase=((time-program.origin_s)%period+period)%period;
 return phase>=program.red_s&&phase<program.red_s+program.green_s?'green':'red';
}

// Shared textures keep hundreds of enlarged pedestrian heads inexpensive.
export function createWalkSignals(data){
 const group=new THREE.Group();group.name='pedestrian-walk-signals';
 function texture(green){
  const canvas=document.createElement('canvas');canvas.width=128;canvas.height=256;
  const c=canvas.getContext('2d');c.fillStyle='#111820';c.beginPath();c.roundRect(3,3,122,250,14);c.fill();
  c.strokeStyle='#e5edf2';c.lineWidth=4;c.stroke();
  function person(y,walking,lit){
   c.strokeStyle=lit?(walking?'#39ff80':'#ff404c'):'#29343d';c.fillStyle=c.strokeStyle;c.lineWidth=11;c.lineCap='round';
   c.beginPath();c.arc(64,y,9,0,Math.PI*2);c.fill();
   const line=points=>{c.beginPath();c.moveTo(...points[0]);for(const p of points.slice(1))c.lineTo(...p);c.stroke()};
   line([[64,y+17],[64,y+49]]);
   line(walking?[[64,y+23],[47,y+37],[36,y+29]]:[[64,y+23],[46,y+35],[46,y+48]]);
   line(walking?[[64,y+23],[81,y+34],[92,y+18]]:[[64,y+23],[82,y+35],[82,y+48]]);
   line(walking?[[64,y+49],[46,y+66],[34,y+73]]:[[64,y+49],[53,y+76]]);
   line(walking?[[64,y+49],[80,y+59],[88,y+77]]:[[64,y+49],[75,y+76]]);
  }
  person(28,false,!green);person(133,true,green);
  c.font='bold 20px Arial';c.textAlign='center';c.fillStyle=green?'#39ff80':'#ff404c';c.fillText(green?'WALK':'WAIT',64,241);
  return new THREE.CanvasTexture(canvas);
 }
 const textures={red:texture(false),green:texture(true)};
 const programs=new Map(data.pedestrian_programs.map(r=>[r.id,r.program]));
 const heads=data.signals.map(s=>{
  const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:textures.red,depthTest:false,depthWrite:false}));
  sprite.name='pedestrian-signal:'+s.id;sprite.position.set(s.head[0],5,-s.head[1]);sprite.scale.set(3,6,1);sprite.renderOrder=90;
  sprite.userData.crossingId=s.crossing_id;sprite.userData.state='red';group.add(sprite);
  return sprite;
 });
 function update(time){
  let green=0;
  heads.forEach(h=>{const state=walkSignalState(programs.get(h.userData.crossingId),time);h.userData.state=state;h.material.map=textures[state];if(state==='green')green++});
  return {green,red:heads.length-green};
 }
 function dispose(){heads.forEach(h=>h.material.dispose());Object.values(textures).forEach(t=>t.dispose())}
 return {group,heads,update,dispose};
}
