import {all, takeEvery, select} from "redux-saga/effects";

import repository from "./persistance";
import {types} from "./actions";


function* persistSurfSessions() {
    yield takeEvery(types.SURF_SESSION_EDITED, function* (action) {
        yield repository.upsertSurfSession(action.payload)

    });
    yield takeEvery(types.SURF_SESSION_DELETED, function* (action) {
        yield repository.deleteSurfSession(action.surfSessionId)
    });
}

function* persistSuggestItems() {
    yield takeEvery(types.SURF_SESSION_EDITED, function* () {
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
