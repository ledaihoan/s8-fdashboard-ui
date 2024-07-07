export const numberDisplay = (price: number, symbol: string = '$') => {
  if (price > 1e11) {
    return `${symbol}${(price / 1e12).toFixed(2)}T`;
  }
  if (price > 1e8) {
    return `${symbol}${(price / 1e9).toFixed(2)}B`;
  }

  if (price > 1e5) {
    return `${symbol}${(price / 1e6).toFixed(2)}M`;
  }
  return `${symbol}${price.toFixed(2)}`;
};