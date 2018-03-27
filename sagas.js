import {all, takeEvery, select} from "redux-saga/effects";
import storage from "./storage";


function* surfSessionsChanged() {
    function* saveSurfSessions() {
        const surfSessions = yield select(store => store.surfSessions);
        yield storage.writeTodaySurfSessions(surfSessions)
    }
    yield takeEvery('SURF_SESSION_ADDED', saveSurfSessions);
    yield takeEvery('SURF_SESSION_FINISHED', saveSurfSessions);
}


export default function* rootSaga() {
    yield all([
        surfSessionsChanged(),
    ])
}
