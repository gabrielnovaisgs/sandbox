export function mergeIntervals(intervals: number[][]): number[][] {
  if (intervals.length === 0) return [];

  // Passo 1: ordenar pelo início de cada intervalo
  intervals.sort((a, b) => a[0] - b[0]);

  const merged: number[][] = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];
    const current = intervals[i];

    // Se o início do atual é <= fim do último merged → há sobreposição
    if (current[0] <= last[1]) {
      // Extende o fim do último intervalo se necessário
      last[1] = Math.max(last[1], current[1]);
    } else {
      // Sem sobreposição: adiciona como novo intervalo
      merged.push(current);
    }
  }

  return merged;
}
