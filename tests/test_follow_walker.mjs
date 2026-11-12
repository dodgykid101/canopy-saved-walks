import test from 'node:test';
import assert from 'node:assert/strict';
import {Vector3,PerspectiveCamera} from '../vendor/three/build/three.module.js';
import {followWalker} from '../viewer/3d/pedestrian/follow-walker.mjs';

test('following preserves camera offset during movement, waits and timeline jumps',()=>{
  const camera=new PerspectiveCamera(),controls={target:new Vector3(),update(){camera.lookAt(this.target);}};
  camera.position.set(60,90,100);
  const offset=camera.position.clone().sub(controls.target);
  for(const position of [new Vector3(10,5,20),new Vector3(10,5,20),new Vector3(-100,30,400)]){
    followWalker(camera,controls,position);
    assert(camera.position.clone().sub(controls.target).distanceTo(offset)<1e-10);
    assert(controls.target.distanceTo(position.clone().add(new Vector3(0,2,0)))<1e-10);
  }
});
test('initial follow framing and top-down framing aim at the walker',()=>{
  const camera=new PerspectiveCamera(),controls={target:new Vector3(),update(){camera.lookAt(this.target);}};
  const position=new Vector3(300,12,-600);
  followWalker(camera,controls,position,{frame:true});
  assert.deepEqual(camera.position.clone().sub(controls.target).toArray(),[80,110,95]);
  followWalker(camera,controls,position,{frame:true,top:true});
  assert(camera.position.clone().sub(controls.target).distanceTo(new Vector3(0,180,.1))<1e-10);
});
