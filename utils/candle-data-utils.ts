import _ from "lodash";
import {CandleData} from "../types";

export const formatCandleData = function (candleArray: number[][]): CandleData[] {
  return _.map(candleArray, candle => {
    const [timestamp, low, high, open, close, volume] = candle;
    return {timestamp, low, high, open, close, volume};
  });
};