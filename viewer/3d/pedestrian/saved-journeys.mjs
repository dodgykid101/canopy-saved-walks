// All URLs are relative to this module, including GitHub project subpaths.
export const savedRoot=new URL('../../../saved-routes/',import.meta.url);
export function findJourney(catalog,id){
  const row=catalog.journeys.find(j=>j.id===id);
  if(!row)throw Error('Choose one of the 15 saved journeys.');
  return row;
}
export function journeyLabel(row){
  const distance=row.distance_m<1000?`${Math.round(row.distance_m)} m`:`${(row.distance_m/1000).toFixed(1)} km`;
  const minutes=Math.round(row.duration_s/60),h=Math.floor(minutes/60),m=minutes%60;
  return `${row.title} · ${distance} · ${h?`${h}h `:''}${m}m`;
}
export async function loadSavedCatalog(){
  const response=await fetch(new URL('catalog.json',savedRoot),{cache:'no-cache'});
  if(!response.ok)throw Error('Saved journey list could not be loaded. Please reload.');
  return response.json();
}
export async function readPacked(url,expectedHash){
  const response=await fetch(url);
  if(!response.ok)throw Error('Saved journey could not be downloaded. Please try again.');
  const bytes=await response.arrayBuffer();
  if(expectedHash){
    const hash=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(x=>x.toString(16).padStart(2,'0')).join('');
    if(hash!==expectedHash)throw Error('Saved journey verification failed. Please reload the page.');
  }
  if(!globalThis.DecompressionStream)throw Error('This viewer needs a current browser with gzip support.');
  return new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).json();
}
export function loadSavedMeta(){return readPacked(new URL('meta.json.gz',savedRoot));}
const recent=new Map();
export async function loadSavedJourney(catalog,id){
  const row=findJourney(catalog,id);
  if(recent.has(id))return recent.get(id);
  const result=await readPacked(new URL(row.file,savedRoot),row.sha256);
  if(result.saved_journey?.origin!==row.origin||result.saved_journey?.destination!==row.destination)
    throw Error('Saved journey endpoints do not match the selection.');
  recent.set(id,result);
  while(recent.size>3)recent.delete(recent.keys().next().value);
  return result;
}
