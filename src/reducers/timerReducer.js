const initialState = {
  startedAt: undefined,
  baseTime: {},
};

export function timerReducer(state = initialState, action) {
  switch (action.type) {
    case "START_TIMER":
      let baseTime = state.baseTime;
      baseTime[action.n] = action.baseTime
      return {
        ...state,
        baseTime: baseTime,
        startedAt: action.now,
      };
    default:
      return state;
  }
}
