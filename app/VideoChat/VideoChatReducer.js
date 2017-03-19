const initialState = {
  URL: {},
};

const reducer = (state = initialState, action) => {
  const newState = Object.assign({}, state)
  switch (action.type) {
    case SET_STREAM_URL:
      newState.URL = action.URL
      break
    default:
      return state
  }
  return newState
}

export default reducer;