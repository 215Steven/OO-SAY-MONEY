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
        className="fill-[#c084fc]/30 stroke-[#9333ea]" strokeWidth="2.5"/>
      {data.map((d,i) => {
        const [x,y] = pt(i, d.v/100);
        return <circle key={`dot-${i}`} cx={x} cy={y} r="3" className="fill-[#9333ea]" />;
      })}
      {data.map((d,i) => {
        const [x,y] = pt(i, 1.25);
        return (
          <text key={i} x={x} y={y}
            textAnchor="middle" dominantBaseline="middle"
            fontSize="10" className="fill-slate-600 font-bold">
            {d.s}
          </text>
        );
      })}
    </svg>
  );
}
