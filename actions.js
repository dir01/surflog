export const types = {
    SURF_SESSIONS_LOADED: 'SURF_SESSIONS_LOADED',
    SURF_SESSION_ADDED: 'SURF_SESSION_ADDED',
    SURF_SESSION_EDITED: 'SURF_SESSION_EDITED',
    SURF_SESSION_FINISHED: 'SURF_SESSION_FINISHED',
    SURF_SESSION_DELETED: 'SURF_SESSION_DELETED',
    SUGGEST_ITEMS_LOADED: 'SUGGEST_ITEMS_LOADED',
};


export const actionCreators = {
    surfSessionsLoaded: (surfSessions) => {
        return {type: types.SURF_SESSIONS_LOADED, payload: surfSessions}
    },
    surfSessionAdded: (surfSession) => {
        return {type: types.SURF_SESSION_ADDED, payload: surfSession}
    },
    surfSessionEdited: (surfSession) => {
        return {type: types.SURF_SESSION_EDITED, payload: surfSession}
    },
    surfSessionFinished: (surfSessionId, endTime) => {
        return {type: types.SURF_SESSION_FINISHED, surfSessionId, endTime}
    },
    surfSessionDeleted: (surfSessionId) => {
        return {type: types.SURF_SESSION_DELETED, surfSessionId}
    },
    suggestItemsLoaded: (suggestItems) => {
        return {type: types.SUGGEST_ITEMS_LOADED, suggestItems}
    }
};
