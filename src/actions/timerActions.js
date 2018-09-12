import {START_TIMER} from './types';

export function startTimer(baseTime = 0, n = null) {
  return {
    type: START_TIMER,
    baseTime: baseTime,
    n: n,
    now: new Date().getTime()
  };
}
