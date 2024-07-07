import dayjs from "dayjs";
import {CANDLE_BATCH_SIZES} from "../constants";

export const getDefaultTimeRange = function (granularity: number) {
  const currentTimestamp = dayjs().unix();
  const defaultEnd = currentTimestamp - currentTimestamp % granularity;
  const defaultStart = defaultEnd - CANDLE_BATCH_SIZES * granularity;
  return { defaultStart, defaultEnd };
}