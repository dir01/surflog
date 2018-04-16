import moment from "moment";

export const types = {
    SURF_SESSIONS_LOADED: 'SURF_SESSIONS_LOADED',
    SURF_SESSION_EDITED: 'SURF_SESSION_EDITED',
    SURF_SESSION_DELETED: 'SURF_SESSION_DELETED',
    SUGGEST_ITEMS_LOADED: 'SUGGEST_ITEMS_LOADED',
};


export const actionCreators = {
    surfSessionsLoaded: (surfSessions) => {
        return {type: types.SURF_SESSIONS_LOADED, payload: surfSessions}
    },
    surfSessionAdded: (surfSession) => {
        return {type: types.SURF_SESSION_EDITED, payload: surfSession}
    },
    surfSessionEdited: (surfSession) => {
        return {type: types.SURF_SESSION_EDITED, payload: surfSession}
    },
    surfSessionFinished: (surfSession) => {
        const endTime = moment().format('HH:mm');
        return {type: types.SURF_SESSION_EDITED, payload: {...surfSession, endTime}}
    },
    surfSessionDeleted: (surfSessionId) => {
        return {type: types.SURF_SESSION_DELETED, surfSessionId}
    },
    suggestItemsLoaded: (suggestItems) => {
        return {type: types.SUGGEST_ITEMS_LOADED, suggestItems}
    }
};
