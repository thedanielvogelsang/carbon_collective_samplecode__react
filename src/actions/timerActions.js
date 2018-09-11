export function startTimer(baseTime = 0, n = null) {
  return {
    type: "START_TIMER",
    baseTime: baseTime,
    n: n,
    now: new Date().getTime()
  };
}

export function stopTimer(n = null) {
  return {
    type: "STOP_TIMER",
    n: n,
    now: new Date().getTime()
  };
}
