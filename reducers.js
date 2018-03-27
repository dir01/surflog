import _ from 'lodash';
import {combineReducers} from 'redux';
import {types} from "./actions";


function surfSessions(state = [], action) {
    switch (action.type) {
        case types.SURF_SESSIONS_LOADED:
            return action.payload;
        case types.SURF_SESSION_ADDED:
            return [...state, action.payload];
        case types.SURF_SESSION_FINISHED:
            const newState = [...state];
            const sessionIndex = _.findIndex(newState, s => s.id === action.surfSessionId);
            newState[sessionIndex] = {...newState[sessionIndex], endTime: action.endTime};
            return newState;
        case types.SURF_SESSION_DELETED:
            return state.filter(s => s.id !== action.surfSessionId);
        default:
            return state;
    }
}


function suggestItems(state = {}, action) {
    switch (action.type) {
        case types.SURF_SESSION_ADDED:
            const newState = {};
            for (const field of ['surfer', 'sail', 'board']) {
                const value = action.payload[field];
                let list = _.without(state[field] || [], value);
                list.unshift(value);
                list = list.slice(0, 10);
                newState[field] = list;
            }
            return newState;
        case types.SUGGEST_ITEMS_LOADED:
            return action.suggestItems;
        default:
            return state;
    }
}


export default combineReducers({
    surfSessions,
    suggestItems,
});
