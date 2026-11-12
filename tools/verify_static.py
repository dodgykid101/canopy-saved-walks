"""Verify the publication boundary and all saved journey invariants; stdlib only."""
from pathlib import Path
import gzip,hashlib,json,math
ROOT=Path(__file__).resolve().parents[1]

def verify():
    manifest=json.loads((ROOT/'download-manifest.json').read_bytes())
    public=set()
    for entry in manifest['files']:
        relative=entry['path'];path=(ROOT/relative).resolve()
        assert path.is_relative_to(ROOT) and path.is_file(),relative
        assert not any(p in {'private','runtime','.git','cache','.venv'} for p in Path(relative).parts),relative
        assert path.suffix not in {'.csv','.pt','.pth','.pem','.key'},relative
        data=path.read_bytes();assert len(data)==entry['bytes'] and hashlib.sha256(data).hexdigest()==entry['sha256'],relative
        public.add(relative)
    protected=json.loads((ROOT/'validation/protected-assets.json').read_bytes())
    for relative,digest in protected.items():assert hashlib.sha256((ROOT/relative).read_bytes()).hexdigest()==digest,relative
    catalog=json.loads((ROOT/'saved-routes/catalog.json').read_bytes());meta=json.loads(gzip.decompress((ROOT/'saved-routes/meta.json.gz').read_bytes()))
    assert len(catalog['journeys'])==15 and len({j['id'] for j in catalog['journeys']})==15
    assert len(list((ROOT/'saved-routes/routes').glob('*.json.gz')))==15
    locations={p['id']:p for p in catalog['locations']}
    assert catalog['settings']=={'departure_s':0,'max_minutes':780}
    distances=[];durations=[];missing=0;breathing=0
    for entry in catalog['journeys']:
        file=ROOT/'saved-routes'/entry['file'];data=file.read_bytes()
        assert 'saved-routes/'+entry['file'] in public
        assert hashlib.sha256(data).hexdigest()==entry['sha256']
        result=json.loads(gzip.decompress(data));route=result['routes'][1];audit=result['wave_audit'][1]
        assert result['routes'][0] is None and result['cvae_enabled']
        assert not {'participant','inputs_sha256','history_audit'}.intersection(result['breathing_model'])
        assert route['edge_keys'][0][0]==locations[entry['origin']]['node']
        assert route['edge_keys'][-1][1]==locations[entry['destination']]['node']
        assert 0<route['duration_s']<=46800 and audit['failure'] is None and audit['maximum_closed_transmission']==0
        events=route['timeline'];assert events[0]['start']==0
        assert abs(events[-1]['end']-route['duration_s'])<1e-6
        for a,b in zip(events,events[1:]):assert abs(a['end']-b['start'])<1e-6
        waits=sum(e['end']-e['start'] for e in events if e['kind']=='Waiting')
        distance=sum(e['distance'][-1] for e in events if e['kind']!='Waiting')
        assert abs(waits-route['wait_s'])<1e-5
        assert abs(distance/(4/3)+waits-route['duration_s'])<1e-5
        assert abs(distance-entry['distance_m'])<.011
        assert all(math.isfinite(s['breathing']) for s in route['breathing_profile'])
        assert len(route['breathing_profile'])>=2
        assert all(6-1e-6<=s['pollution']<=40+1e-6 for s in route['profile'])
        missing+=sum(s['temperature'] is None for s in route['profile']);breathing+=len(route['breathing_profile'])
        distances.append(distance);durations.append(route['duration_s'])
    module=(ROOT/'viewer/3d/pedestrian/canopy-pedestrian.mjs').read_text(encoding='utf-8')
    assert '/api/pedestrian' not in module and 'loadSavedJourney' in module
    router=(ROOT/'asset-router.js').read_text(encoding='utf-8')
    assert 'https://' not in router and 'http://' not in router
    total=sum(e['bytes'] for e in manifest['files'])
    assert total<1_000_000_000 and max(e['bytes'] for e in manifest['files'])<100*1024**2
    assert 'model_identity' not in meta
    report=dict(status='passed',journeys=15,locations=len(locations),public_assets=len(public),protected_canopy_assets=len(protected),
        site_bytes=total,distance_m=[round(min(distances),2),round(max(distances),2)],duration_minutes=[round(min(durations)/60,1),round(max(durations)/60,1)],
        saved_breathing_samples=breathing,missing_temperature_samples_preserved=missing,backend_required=False)
    print(json.dumps(report,indent=2));return report

if __name__=='__main__':verify()
