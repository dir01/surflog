import {all, takeEvery, select} from "redux-saga/effects";

import {repository} from "./persistance";
import {types} from "./actions";


function* persistSurfSessions() {
    function* _writeToStorage() {
        const surfSessions = yield select(store => store.surfSessions);
        yield repository.writeTodaySurfSessions(surfSessions)
    }

    yield takeEvery(types.SURF_SESSION_ADDED, _writeToStorage);
    yield takeEvery(types.SURF_SESSION_FINISHED, _writeToStorage);
    yield takeEvery(types.SURF_SESSION_DELETED, _writeToStorage);
}

function* persistSuggestItems() {
    yield takeEvery(types.SURF_SESSION_ADDED, function* () {
        const suggestItems = yield select(store => store.suggestItems);
        yield repository.writeSuggestItems(suggestItems);
    })
}

export default function* rootSaga() {
    yield all([
        persistSurfSessions(),
        persistSuggestItems(),
    ])
}
