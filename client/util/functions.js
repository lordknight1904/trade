export function stageInterpreter(type) {
  switch (type) {
    case 'buy': return 'Mua';
    case 'sell': return 'Bán';
    default: return 'null';
  }
}
