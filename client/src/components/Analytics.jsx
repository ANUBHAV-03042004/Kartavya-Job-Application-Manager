import React, { useMemo } from 'react';

const C = { blue: '#00bbf9', yellow: '#fee440', mint: '#00f5d4', pink: '#f15bb5', purple: '#9b5de5' };

function DonutChart({ data, size = 160 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return (
    <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--t3)', fontSize: 13 }}>
      No data
    </div>
  );
  const r = 58, cx = size / 2, cy = size / 2, sw = 22;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      {data.map((d, i) => {
        const dash = (d.value / total) * circ;
        const el = (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={d.color} strokeWidth={sw}
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeDashoffset={-offset}
          />
        );
        offset += dash;
        return el;
      })}
    </svg>
  );
}

function BarChart({ data, height = 140 }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height, paddingBottom: 24, position: 'relative' }}>
      {data.map((d, i) => {
        const h = (d.value / max) * (height - 24);
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 600 }}>{d.value || ''}</div>
            <div style={{
              width: '100%', height: Math.max(h, 2),
              background: d.color, borderRadius: '4px 4px 0 0',
              opacity: d.value === 0 ? 0.2 : 1,
              boxShadow: d.value > 0 ? `0 0 12px ${d.color}55` : 'none',
              transition: 'height 0.5s ease',
            }} />
            <div style={{ fontSize: 10, color: 'var(--t3)', position: 'absolute', bottom: 0 }}>{d.label}</div>
          </div>
        );
      })}
    </div>
  );
}

function SparkLine({ values, color, height = 50 }) {
  if (!values || values.length < 2) return null;
  const max = Math.max(...values, 1);
  const w = 200;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = height - (v / max) * height;
    return `${x},${y}`;
  }).join(' ');
  const id = `sg${color.replace('#', '')}`;
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={pts} />
      <polyline fill={`url(#${id})`} stroke="none" points={`0,${height} ${pts} ${w},${height}`} />
    </svg>
  );
}

export default function Analytics({ apps }) {
  const s = useMemo(() => {
    const by = {
      Applied:   apps.filter(a => a.status === 'Applied').length,
      Interview: apps.filter(a => a.status === 'Interview').length,
      Offer:     apps.filter(a => a.status === 'Offer').length,
      Rejected:  apps.filter(a => a.status === 'Rejected').length,
    };
    const total        = apps.length;
    const responseRate = total ? Math.round(((by.Interview + by.Offer) / total) * 100) : 0;
    const offerRate    = total ? Math.round((by.Offer / total) * 100) : 0;
    const iConv        = (by.Interview + by.Offer + by.Rejected) > 0
      ? Math.round((by.Offer / (by.Interview + by.Offer + by.Rejected)) * 100) : 0;

    const now    = new Date();
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return { label: d.toLocaleString('default', { month: 'short' }), year: d.getFullYear(), month: d.getMonth() };
    });
    const monthly = months.map(m => ({
      label: m.label,
      value: apps.filter(a => { const d = new Date(a.applicationDate); return d.getFullYear() === m.year && d.getMonth() === m.month; }).length,
    }));

    const compMap = {};
    apps.forEach(a => { compMap[a.companyName] = (compMap[a.companyName] || 0) + 1; });
    const topCompanies = Object.entries(compMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

    const weeklyValues = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i));
      return apps.filter(a => new Date(a.applicationDate).toDateString() === d.toDateString()).length;
    });

    return { by, total, responseRate, offerRate, iConv, monthly, topCompanies, weeklyValues };
  }, [apps]);

  const barColors = [C.blue, C.purple, C.mint, C.yellow, C.pink, C.blue];
  const donut = [
    { label: 'Applied',   value: s.by.Applied,   color: C.blue   },
    { label: 'Interview', value: s.by.Interview, color: C.yellow },
    { label: 'Offer',     value: s.by.Offer,     color: C.mint   },
    { label: 'Rejected',  value: s.by.Rejected,  color: C.pink   },
  ];

  if (apps.length === 0) return (
    <div>
      <div className="view-header"><h1 className="view-title">Analytics</h1></div>
      <div className="empty"><div style={{ fontSize: 48 }}>📊</div><p>Add applications to see your analytics.</p></div>
    </div>
  );

  return (
    <div>
      <div className="view-header">
        <div>
          <h1 className="view-title">Analytics</h1>
          <p className="view-sub">Insights from {s.total} applications</p>
        </div>
      </div>

      {/* KPI row */}
      <div className="analytics-grid-4">
        {[
          { label: 'Total Applied',   value: s.total,              color: C.blue,   sub: 'all time' },
          { label: 'Response Rate',   value: `${s.responseRate}%`, color: C.yellow, sub: 'interviews + offers' },
          { label: 'Offer Rate',      value: `${s.offerRate}%`,    color: C.mint,   sub: 'of all applications' },
          { label: 'Pending Reply',   value: s.by.Applied,         color: C.purple, sub: 'awaiting response' },
        ].map(c => (
          <div key={c.label} className="stat-card" style={{ '--sc': c.color }}>
            <div className="stat-val" style={{ color: c.color }}>{c.value}</div>
            <div className="stat-label">{c.label}</div>
            {c.sub && <div className="stat-sub">{c.sub}</div>}
          </div>
        ))}
      </div>

      {/* Row 2 */}
      <div className="analytics-grid-2" style={{ marginTop: 16 }}>
        <div className="a-card">
          <div className="a-card-title">Status Breakdown</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <DonutChart data={donut} size={160} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--t1)' }}>{s.total}</div>
                <div style={{ fontSize: 11, color: 'var(--t3)' }}>total</div>
              </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {donut.map(d => (
                <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                  <div style={{ flex: 1, fontSize: 13, color: 'var(--t2)' }}>{d.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: d.color }}>{d.value}</div>
                  <div style={{ fontSize: 11, color: 'var(--t3)', minWidth: 32 }}>
                    {s.total ? Math.round(d.value / s.total * 100) : 0}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="a-card">
          <div className="a-card-title">Monthly Applications (Last 6 Months)</div>
          <BarChart data={s.monthly.map((m, i) => ({ ...m, color: barColors[i % barColors.length] }))} height={160} />
        </div>
      </div>

      {/* Row 3 */}
      <div className="analytics-grid-3" style={{ marginTop: 16 }}>
        <div className="a-card">
          <div className="a-card-title">This Week</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: C.mint, marginBottom: 6 }}>
            {s.weeklyValues.reduce((a, b) => a + b, 0)}
          </div>
          <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 12 }}>applications in last 7 days</div>
          <SparkLine values={s.weeklyValues} color={C.mint} height={50} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <div key={i} style={{ fontSize: 10, color: 'var(--t3)' }}>{d}</div>
            ))}
          </div>
        </div>

        <div className="a-card">
          <div className="a-card-title">Top Companies</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
            {s.topCompanies.length === 0
              ? <div style={{ color: 'var(--t3)', fontSize: 13 }}>No data yet</div>
              : s.topCompanies.map(([company, count], i) => {
                  const pct   = Math.round((count / s.total) * 100);
                  const color = Object.values(C)[i % Object.values(C).length];
                  return (
                    <div key={company}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                        <span style={{ color: 'var(--t1)', fontWeight: 500 }}>{company}</span>
                        <span style={{ color, fontWeight: 700 }}>{count}</span>
                      </div>
                      <div style={{ height: 4, background: 'var(--bg-raised)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 4, boxShadow: `0 0 8px ${color}88`, transition: 'width 0.6s ease' }} />
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>

        <div className="a-card">
          <div className="a-card-title">Hiring Funnel</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
            {[
              { label: 'Applied',   val: s.total,                           pct: 100, color: C.blue   },
              { label: 'Interview', val: s.by.Interview + s.by.Offer,       pct: s.total ? Math.round((s.by.Interview + s.by.Offer) / s.total * 100) : 0, color: C.yellow },
              { label: 'Offer',     val: s.by.Offer,                        pct: s.total ? Math.round(s.by.Offer / s.total * 100) : 0, color: C.mint },
            ].map(f => (
              <div key={f.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
                  <span style={{ color: 'var(--t2)' }}>{f.label}</span>
                  <span style={{ color: f.color, fontWeight: 700 }}>
                    {f.val} <span style={{ color: 'var(--t3)', fontWeight: 400, fontSize: 11 }}>({f.pct}%)</span>
                  </span>
                </div>
                <div style={{ height: 6, background: 'var(--bg-raised)', borderRadius: 6, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${f.pct}%`, background: f.color, boxShadow: `0 0 10px ${f.color}88`, borderRadius: 6, transition: 'width 0.7s ease' }} />
                </div>
              </div>
            ))}
            <div style={{ marginTop: 4, padding: '10px 12px', background: 'var(--bg-raised)', borderRadius: 8, borderLeft: `3px solid ${C.mint}` }}>
              <div style={{ fontSize: 11, color: 'var(--t3)' }}>Interview → Offer conversion</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: C.mint }}>{s.iConv}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}