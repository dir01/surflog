import {combineReducers} from 'redux';
import {types} from "./actions";


function surfSessions(state = [], action) {
    switch (action.type) {
        case types.SURF_SESSIONS_LOADED:
            return action.payload;
        case types.SURF_SESSION_ADDED:
            return [...state, action.payload];
        case types.SURF_SESSION_FINISHED:
            const newState = [];
            for (const s of state) {
                if (s.id !== action.surfSessionId) {
                    newState.push(s)
                } else {
                    newState.push({...s, endTime: action.endTime})
                }
            }
            return newState;
        default:
            return state;
    }
}


export default combineReducers({
    surfSessions,
});
