import dayjs from "dayjs";
import {CANDLE_BATCH_SIZES} from "../constants";

export const getDefaultTimeRange = function (granularity: number) {
  const { start, end } = getCustomTimeRange(granularity, CANDLE_BATCH_SIZES);
  return { defaultStart: start, defaultEnd: end };
};

export const getCustomTimeRange = function (granularity: number, batchSize: number, endTime?: number) {
  const currentTimestamp = dayjs().unix();
  const endTs = endTime || currentTimestamp;
  const end = endTs - endTs % granularity;
  const start = end - batchSize * granularity;
  return { start, end };
};