import React, { useMemo } from 'react';

const COLORS = ['#5BC0EB','#FDE74C','#9BC53D','#E55934','#FA7921'];

function DonutChart({ data, size=160 }) {
  const total = data.reduce((s,d)=>s+d.value,0);
  if (!total) return <div style={{width:size,height:size,display:'flex',alignItems:'center',justifyContent:'center',color:'#aaa',fontSize:13}}>No data</div>;
  const r=58, circ=2*Math.PI*r;
  let off=0;
  return (
    <svg width={size} height={size} style={{transform:'rotate(-90deg)'}}>
      {data.map((d,i)=>{
        const dash=(d.value/total)*circ;
        const el=<circle key={i} cx={size/2} cy={size/2} r={r} fill="none" stroke={d.color} strokeWidth={22}
          strokeDasharray={`${dash} ${circ-dash}`} strokeDashoffset={-off} style={{transition:'stroke-dasharray 0.6s'}}/>;
        off+=dash; return el;
      })}
      <circle cx={size/2} cy={size/2} r={47} fill="white"/>
    </svg>
  );
}

function BarChart({ data, h=140 }) {
  const max=Math.max(...data.map(d=>d.value),1);
  return (
    <div style={{display:'flex',alignItems:'flex-end',gap:8,height:h,paddingBottom:24,position:'relative'}}>
      {data.map((d,i)=>{
        const bh=(d.value/max)*(h-24);
        return (
          <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
            <div style={{fontSize:11,color:'#666',fontWeight:600}}>{d.value||''}</div>
            <div style={{width:'100%',height:Math.max(bh,2),background:d.color,borderRadius:'4px 4px 0 0',opacity:d.value?1:0.2,boxShadow:d.value?`0 2px 8px ${d.color}55`:'none',transition:'height 0.5s'}}/>
            <div style={{fontSize:10,color:'#888',position:'absolute',bottom:0}}>{d.label}</div>
          </div>
        );
      })}
    </div>
  );
}

function KPI({ label, value, color, sub }) {
  return (
    <div className="kpi-card" style={{'--kc':color}}>
      <div className="kpi-val" style={{color}}>{value}</div>
      <div className="kpi-label">{label}</div>
      {sub && <div className="kpi-sub">{sub}</div>}
    </div>
  );
}

export default function Analytics({ apps }) {
  const s = useMemo(()=>{
    const by = { Applied:apps.filter(a=>a.status==='Applied').length, Interview:apps.filter(a=>a.status==='Interview').length, Offer:apps.filter(a=>a.status==='Offer').length, Rejected:apps.filter(a=>a.status==='Rejected').length };
    const total=apps.length;
    const responseRate=total?Math.round((by.Interview+by.Offer)/total*100):0;
    const offerRate=total?Math.round(by.Offer/total*100):0;
    const iConv=(by.Interview+by.Offer+by.Rejected)?Math.round(by.Offer/(by.Interview+by.Offer+by.Rejected)*100):0;
    const now=new Date();
    const months=Array.from({length:6},(_,i)=>{const d=new Date(now.getFullYear(),now.getMonth()-(5-i),1);return{label:d.toLocaleString('default',{month:'short'}),year:d.getFullYear(),month:d.getMonth()};});
    const monthly=months.map(m=>({label:m.label,value:apps.filter(a=>{const d=new Date(a.applicationDate);return d.getFullYear()===m.year&&d.getMonth()===m.month;}).length}));
    const cm={};apps.forEach(a=>{cm[a.companyName]=(cm[a.companyName]||0)+1;});
    const top=Object.entries(cm).sort((a,b)=>b[1]-a[1]).slice(0,5);
    const weekly=Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-(6-i));return apps.filter(a=>new Date(a.applicationDate).toDateString()===d.toDateString()).length;});
    return {by,total,responseRate,offerRate,iConv,monthly,top,weekly};
  },[apps]);

  if (!apps.length) return (
    <div><div className="view-header"><h1 className="view-title">Analytics</h1></div><div className="empty"><div style={{fontSize:48}}>📊</div><p>Add applications to see your analytics.</p></div></div>
  );

  const donut=[
    {label:'Applied',  value:s.by.Applied,   color:COLORS[0]},
    {label:'Interview',value:s.by.Interview, color:COLORS[1]},
    {label:'Offer',    value:s.by.Offer,     color:COLORS[2]},
    {label:'Rejected', value:s.by.Rejected,  color:COLORS[3]},
  ];

  return (
    <div>
      <div className="view-header">
        <div><h1 className="view-title">Analytics</h1><p className="view-sub">Insights from {s.total} applications</p></div>
      </div>

      {/* KPIs */}
      <div className="kpi-grid">
        <KPI label="Total Applied"   value={s.total}              color={COLORS[0]} sub="all time" />
        <KPI label="Response Rate"   value={`${s.responseRate}%`} color={COLORS[1]} sub="interviews + offers" />
        <KPI label="Offer Rate"      value={`${s.offerRate}%`}    color={COLORS[2]} sub="of all apps" />
        <KPI label="Pending Reply"   value={s.by.Applied}         color={COLORS[4]} sub="awaiting response" />
      </div>

      {/* Row 2 */}
      <div className="an-row2">
        <div className="a-card">
          <div className="a-ttl">Status Breakdown</div>
          <div style={{display:'flex',alignItems:'center',gap:24,flexWrap:'wrap'}}>
            <div style={{position:'relative'}}>
              <DonutChart data={donut} size={160}/>
              <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',pointerEvents:'none'}}>
                <div style={{fontSize:22,fontWeight:800,color:'#1a1a2e'}}>{s.total}</div>
                <div style={{fontSize:11,color:'#888'}}>total</div>
              </div>
            </div>
            <div style={{flex:1,display:'flex',flexDirection:'column',gap:10}}>
              {donut.map(d=>(
                <div key={d.label} style={{display:'flex',alignItems:'center',gap:10}}>
                  <div style={{width:10,height:10,borderRadius:2,background:d.color,flexShrink:0}}/>
                  <div style={{flex:1,fontSize:13,color:'#555'}}>{d.label}</div>
                  <div style={{fontSize:14,fontWeight:700,color:d.color}}>{d.value}</div>
                  <div style={{fontSize:11,color:'#aaa',minWidth:32}}>{s.total?Math.round(d.value/s.total*100):0}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="a-card">
          <div className="a-ttl">Monthly Applications</div>
          <BarChart data={s.monthly.map((m,i)=>({...m,color:COLORS[i%COLORS.length]}))} h={160}/>
        </div>
      </div>

      {/* Row 3 */}
      <div className="an-row3">
        <div className="a-card">
          <div className="a-ttl">This Week</div>
          <div style={{fontSize:28,fontWeight:800,color:COLORS[2],marginBottom:4}}>{s.weekly.reduce((a,b)=>a+b,0)}</div>
          <div style={{fontSize:12,color:'#888',marginBottom:12}}>apps in last 7 days</div>
          <div style={{display:'flex',alignItems:'flex-end',gap:4,height:48}}>
            {s.weekly.map((v,i)=>{
              const max=Math.max(...s.weekly,1);
              return <div key={i} style={{flex:1,background:COLORS[2],borderRadius:'3px 3px 0 0',height:`${(v/max)*100}%`,minHeight:v?4:0,opacity:v?1:0.15,transition:'height 0.4s'}}/>;
            })}
          </div>
          <div style={{display:'flex',justifyContent:'space-between',marginTop:4}}>
            {['M','T','W','T','F','S','S'].map((d,i)=><div key={i} style={{fontSize:10,color:'#aaa'}}>{d}</div>)}
          </div>
        </div>

        <div className="a-card">
          <div className="a-ttl">Top Companies</div>
          <div style={{display:'flex',flexDirection:'column',gap:12,marginTop:8}}>
            {!s.top.length ? <div style={{color:'#aaa',fontSize:13}}>No data</div>
              : s.top.map(([co,cnt],i)=>{
                const pct=Math.round(cnt/s.total*100), color=COLORS[i%COLORS.length];
                return (
                  <div key={co}>
                    <div style={{display:'flex',justifyContent:'space-between',fontSize:13,marginBottom:4}}>
                      <span style={{color:'#333',fontWeight:500}}>{co}</span>
                      <span style={{color,fontWeight:700}}>{cnt}</span>
                    </div>
                    <div style={{height:4,background:'#f0f0f0',borderRadius:4,overflow:'hidden'}}>
                      <div style={{height:'100%',width:`${pct}%`,background:color,borderRadius:4,transition:'width 0.6s'}}/>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="a-card">
          <div className="a-ttl">Hiring Funnel</div>
          <div style={{display:'flex',flexDirection:'column',gap:12,marginTop:8}}>
            {[
              {label:'Applied',   val:s.total,                    pct:100,  color:COLORS[0]},
              {label:'Interview', val:s.by.Interview+s.by.Offer,  pct:s.total?Math.round((s.by.Interview+s.by.Offer)/s.total*100):0, color:COLORS[1]},
              {label:'Offer',     val:s.by.Offer,                 pct:s.total?Math.round(s.by.Offer/s.total*100):0,                 color:COLORS[2]},
            ].map(f=>(
              <div key={f.label}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:13,marginBottom:5}}>
                  <span style={{color:'#555'}}>{f.label}</span>
                  <span style={{color:f.color,fontWeight:700}}>{f.val} <span style={{color:'#aaa',fontWeight:400,fontSize:11}}>({f.pct}%)</span></span>
                </div>
                <div style={{height:6,background:'#f0f0f0',borderRadius:6,overflow:'hidden'}}>
                  <div style={{height:'100%',width:`${f.pct}%`,background:f.color,borderRadius:6,transition:'width 0.7s'}}/>
                </div>
              </div>
            ))}
            <div style={{marginTop:4,padding:'10px 12px',background:'#f8fdf5',borderRadius:8,borderLeft:`3px solid ${COLORS[2]}`}}>
              <div style={{fontSize:11,color:'#888'}}>Interview → Offer rate</div>
              <div style={{fontSize:20,fontWeight:800,color:COLORS[2]}}>{s.iConv}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}