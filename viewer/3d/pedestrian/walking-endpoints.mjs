// Selection uses the same connected components as the server. Never silently
// move an endpoint onto a different path just to make a route possible.
export function connectedEndpoints(components, origin, goal) {
  return components[origin] !== undefined && components[origin] === components[goal];
}

export function nearestWalkingNode(entries, x, y, radius=30) {
  let best=null, distance=radius;
  for (const [id,p] of entries) {
    const d=Math.hypot(p[0]-x,p[1]-y);
    if (d<distance) {best=id; distance=d;}
  }
  return best;
}

export function destinationChoice(entries, components, origin, x, y) {
  const node=nearestWalkingNode(entries,x,y);
  if (!node) return {node:null,reason:'outside'};
  if (node===origin) return {node:null,reason:'same'};
  if (!connectedEndpoints(components,origin,node)) return {node:null,reason:'disconnected'};
  return {node,reason:null};
}
