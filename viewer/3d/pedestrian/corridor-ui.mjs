import * as THREE from 'three';

export function flag(color) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 192;

  const ctx = canvas.getContext('2d');

  const label = color === 0x33dd77 ? 'START' : 'END';

  ctx.lineWidth = 7;
  ctx.strokeStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(36, 180);
  ctx.lineTo(36, 22);
  ctx.stroke();

  ctx.fillStyle = color === 0x33dd77 ? '#47e0b0' : '#d5a6ff';

  ctx.beginPath();
  ctx.moveTo(40, 24);
  ctx.lineTo(238, 24);
  ctx.lineTo(216, 58);
  ctx.lineTo(238, 92);
  ctx.lineTo(40, 92);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#142532';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#10232e';
  ctx.font = 'bold 32px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(label, 134, 69);

  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.ellipse(36, 181, 13, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);

  const m = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: texture,
      depthTest: false,
      depthWrite: false,
      sizeAttenuation: false,
    }),
  );

  m.scale.set(0.1, 0.075, 1);
  m.center.set(36 / 256, 11 / 192);

  m.name = label === 'START' ? 'route-start-flag' : 'route-destination-flag';

  return m;
}

export function drawRoute(r, routeGroup, heightAt = () => 0) {
  const inspect3d = true;

  // Straight ribbons preserve every route corner; arrows follow cumulative distance.

  const ribbon = [],
    arrows = [];
  let travelled = 0,
    nextArrow = 0;

  const total = r.points
    .slice(1)
    .reduce((sum, p, j) => sum + Math.hypot(p[0] - r.points[j][0], p[1] - r.points[j][1]), 0);

  const spacing = Math.max(5, Math.min(18, total / 5));
  nextArrow = Math.min(spacing / 2, total / 2);

  for (let j = 1; j < r.points.length; j++) {
    const a = r.points[j - 1],
      b = r.points[j],
      len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (len < 1e-8) continue;

    const dx = (b[0] - a[0]) / len,
      dy = (b[1] - a[1]) / len,
      nx = -dy * 0.65,
      ny = dx * 0.65;

    const v = (x, y, h) => {
      const f = Math.max(0, Math.min(1, ((x-a[0])*dx+(y-a[1])*dy)/len));
      const z = a.length > 2 && b.length > 2 ? a[2]+f*(b[2]-a[2]) : undefined;
      return [x, heightAt(x, y, z) + h, -y];
    },
      h = inspect3d ? 0.65 : 7;

    const A = v(a[0] + nx, a[1] + ny, h),
      B = v(a[0] - nx, a[1] - ny, h),
      C = v(b[0] + nx, b[1] + ny, h),
      D = v(b[0] - nx, b[1] - ny, h);

    ribbon.push(...A, ...B, ...C, ...B, ...D, ...C);

    while (nextArrow < travelled + len) {
      const f = (nextArrow - travelled) / len,
        x = a[0] + f * (b[0] - a[0]),
        y = a[1] + f * (b[1] - a[1]);

      arrows.push(
        ...v(x + dx * 1.4, y + dy * 1.4, h + 0.05),
        ...v(x - dx * 0.8 - dy * 1.1, y - dy * 0.8 + dx * 1.1, h + 0.05),
        ...v(x - dx * 0.8 + dy * 1.1, y - dy * 0.8 - dx * 1.1, h + 0.05),
      );

      nextArrow += spacing;
    }
    travelled += len;
  }

  for (const [vertices, color, name, order] of [
    [ribbon, 0xff59c7, 'selected-route-pink', 20],
    [arrows, 0xffffff, 'selected-route-arrows', 21],
  ]) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide,
        depthTest: false,
        depthWrite: false,
      }),
    );
    mesh.name = name;
    mesh.renderOrder = order;
    routeGroup.add(mesh);
  }
}
