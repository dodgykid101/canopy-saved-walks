// Translate camera and target together: preserve the current viewing angle and
// zoom as the walker moves, waits, or is moved using the time slider.
export function followWalker(camera,controls,position,{frame=false,top=false}={}) {
  const target=position.clone();target.y+=2;
  if(frame)camera.position.copy(target).add({x:top?0:80,y:top?180:110,z:top?.1:95});
  else camera.position.add(target.clone().sub(controls.target));
  controls.target.copy(target);controls.update();
}
