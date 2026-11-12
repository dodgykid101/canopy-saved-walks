export function sample(rows, t, key, step = false) {
  if (t <= rows[0].seconds) return rows[0][key];
  for (let i = 1; i < rows.length; i++)
    if (t < rows[i].seconds) {
      const a = rows[i - 1],
        b = rows[i];
      if (!Number.isFinite(a[key]) || (!step && !Number.isFinite(b[key]))) return null;
      return step
        ? a[key]
        : a[key] + ((b[key] - a[key]) * (t - a.seconds)) / (b.seconds - a.seconds || 1);
    }
  return rows.at(-1)[key];
}
export function createCorridorPlots(box) {
  let route = null;
  const metrics = [
    ['pollution', 'Synthetic PM2.5', 'µg/m³'],
    ['temperature', 'Temperature', '°C'],
    ['breathing', 'Predicted breathing · saved model', 'breaths/min'],
    ['distance', 'Distance walked', 'm'],
    ['wait', 'Signal waiting', 's'],
  ];
  function reset() {
    route = null;
    box.innerHTML =
      '<p>Load a saved journey to see selected-route profiles.</p><small>Saved breathing predictions · predictions update every 5 minutes, including waiting.</small>';
  }
  function render(result) {
    route = result.routes[1];
    box.innerHTML =
      '<h3>Selected route</h3><p class="hint">Red: selected route only. Pink with arrows on the map.</p>';
    for (const [key, title, unit] of metrics) {
      const rows = key === 'breathing' ? route.breathing_profile : route.profile;
      const values = rows.map((p) => p[key]).filter(Number.isFinite);
      let lo = values.length ? Math.min(...values) : 0,
        hi = values.length ? Math.max(...values) : 1;
      const pad = Math.max(0.05, (hi - lo) * 0.08);
      lo -= pad;
      hi += pad;
      const path = rows
        .map((p, i) =>
          !Number.isFinite(p[key]) ? '' : key === 'breathing' && i && Number.isFinite(rows[i - 1][key])
            ? `H${42 + (260 * p.seconds) / route.duration_s}V${88 - (65 * (p[key] - lo)) / (hi - lo)}`
            : `${i && Number.isFinite(rows[i - 1][key]) ? 'L' : 'M'}${42 + (260 * p.seconds) / route.duration_s},${88 - (65 * (p[key] - lo)) / (hi - lo)}`,
        )
        .join(' ');
      box.insertAdjacentHTML(
        'beforeend',
        `<article class="metric"><b>${title}</b><div id="ic-value-${key}"></div><svg viewBox="0 0 320 115" role="img" aria-label="${title} over walking time"><text x="0" y="22">${hi.toFixed(1)}</text><text x="0" y="88">${lo.toFixed(1)}</text><path d="M42 15V90H302" stroke="#788d99" fill="none"/><path class="route-trace" d="${path}" stroke="#ff2020" stroke-width="2" fill="none"/><line class="imperial-time-cursor" x1="42" x2="42" y1="15" y2="90" stroke="white" stroke-dasharray="3 3"/><text x="42" y="110">0 min</text><text x="302" y="110" text-anchor="end">${(route.duration_s / 60).toFixed(1)} min</text></svg></article>`,
      );
    }
    box.insertAdjacentHTML(
      'beforeend',
      '<p class="hint">Saved breathing-model scenario replay: synthetic pollution, retained temperature and recorded activity/humidity template. Breathing updates every 5 minutes; shorter walks can stay flat. Not validated physiology.</p>',
    );
    update(0);
  }
  function update(t) {
    if (!route) return;
    const time = Math.max(0, Math.min(t, route.duration_s));
    for (const [key, , unit] of metrics) {
      const value = sample(key === 'breathing' ? route.breathing_profile : route.profile, time, key, key === 'breathing');
      box.querySelector('#ic-value-' + key).textContent = Number.isFinite(value) ? value.toFixed(2) + ' ' + unit : 'Unavailable (outside valid field coverage)';
    }
    const x = 42 + (260 * time) / route.duration_s;
    box.querySelectorAll('.imperial-time-cursor').forEach((e) => {
      e.setAttribute('x1', x);
      e.setAttribute('x2', x);
    });
  }
  reset();
  return { render, update, reset };
}
