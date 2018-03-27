import {all, takeEvery, select} from "redux-saga/effects";

import storage from "./storage";
import {types} from "./actions";


function* persistSurfSessions() {
    function* _writeToStorage() {
        const surfSessions = yield select(store => store.surfSessions);
        yield storage.writeTodaySurfSessions(surfSessions)
    }

    yield takeEvery(types.SURF_SESSION_ADDED, _writeToStorage);
    yield takeEvery(types.SURF_SESSION_FINISHED, _writeToStorage);
    yield takeEvery(types.SURF_SESSION_DELETED, _writeToStorage);
}

function* persistSuggestItems() {
    yield takeEvery(types.SURF_SESSION_ADDED, function* () {
        const suggestItems = yield select(store => store.suggestItems);
        yield storage.writeSuggestItems(suggestItems);
    })
}

export default function* rootSaga() {
    yield all([
        persistSurfSessions(),
        persistSuggestItems(),
    ])
}
