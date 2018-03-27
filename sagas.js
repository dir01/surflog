import {all, takeEvery, select} from "redux-saga/effects";

import storage from "./storage";
import {types} from "./actions";


function* surfSessionsChanged() {
    function* saveSurfSessions() {
        const surfSessions = yield select(store => store.surfSessions);
        yield storage.writeTodaySurfSessions(surfSessions)
    }
    yield takeEvery(types.SURF_SESSION_ADDED, saveSurfSessions);
    yield takeEvery(types.SURF_SESSION_FINISHED, saveSurfSessions);
    yield takeEvery(types.SURF_SESSION_DELETED, saveSurfSessions);
}


export default function* rootSaga() {
    yield all([
        surfSessionsChanged(),
    ])
}
