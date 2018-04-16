import _ from 'lodash';
import {combineReducers} from 'redux';
import {types} from "./actions";


function surfSessions(state = {}, action) {
    let newState = {...state};
    switch (action.type) {
        case types.SURF_SESSIONS_LOADED:
            return action.payload;
        case types.SURF_SESSION_DELETED:
            delete newState[action.surfSessionId];
            return newState;
        case types.SURF_SESSION_EDITED:
            const id = action.payload.id;
            newState[id] = {...newState[id], ...action.payload};
            return newState;
        default:
            return state;
    }
}


function suggestItems(state = {}, action) {
    switch (action.type) {
        case types.SURF_SESSION_EDITED:
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
