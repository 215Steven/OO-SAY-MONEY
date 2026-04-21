export function SvgRadar({ data }: { data: {s: string, v: number}[] }) {
  const cx = 90, cy = 92, r = 62;
  const n = data.length;
  const angle = (i: number) => (Math.PI * 2 * i / n) - Math.PI / 2;
  const pt = (i: number, ratio: number) => [
    cx + r * ratio * Math.cos(angle(i)),
    cy + r * ratio * Math.sin(angle(i))
  ];
  const levels = [0.25, 0.5, 0.75, 1];
  return (
    <svg width="100%" viewBox="0 0 180 184" className="block">
      {levels.map(lv => (
        <polygon key={lv}
          points={data.map((_,i) => pt(i,lv).join(",")).join(" ")}
          fill="none" className="stroke-slate-200" strokeWidth="1"/>
      ))}
      {data.map((_,i) => (
        <line key={i} x1={cx} y1={cy}
          x2={pt(i,1)[0]} y2={pt(i,1)[1]}
          className="stroke-slate-200" strokeWidth="1"/>
      ))}
      <polygon
        points={data.map((d,i) => pt(i, d.v/100).join(",")).join(" ")}
        className="fill-indigo-600/25 stroke-indigo-600" strokeWidth="2"/>
      {data.map((d,i) => {
        const [x,y] = pt(i, 1.22);
        return (
          <text key={i} x={x} y={y}
            textAnchor="middle" dominantBaseline="middle"
            fontSize="9.5" className="fill-slate-500 font-semibold">
            {d.s}
          </text>
        );
      })}
    </svg>
  );
}
