export const fmt = (n: number | null | undefined): string => {
  if (!n) return "0";
  if (Math.abs(n) >= 10000) return (n/10000).toFixed(1).replace(/\.0$/, "") + "萬";
  return n.toLocaleString("zh-TW");
};
