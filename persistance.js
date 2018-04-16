import firebase from 'firebase';
import moment from "moment";


firebase.initializeApp({
    databaseURL: 'https://surflog-d7154.firebaseio.com/',
});
const database = firebase.database();


class FirebaseRepository {
    onTodaySurfSessionsLoaded(callback) {
        this._getTodayRef().on('value', (snapshot) => {
            callback(snapshot.val() || [])
        });
    }

    onSuggestItemsLoaded(callback) {
        database.ref('suggestItems').on('value', (snapshot) => {
            callback(snapshot.val() || {})
        });
    }

    async upsertSurfSession(payload) {
        try {
            await this._getTodayRef().child(payload.id).set(payload)
        } catch (e) {
            console.error(e)
        }
    }

    async deleteSurfSession(sessionId) {
        await this._getTodayRef().child(sessionId).remove()
    }

    async writeSuggestItems(suggestItems) {
        await database.ref('suggestItems').set(suggestItems)
    }

    _getTodayRef() {
        return database.ref('surfSessions').child(moment().format('YYYY-MM-DD'));
    }

}

const repository = new FirebaseRepository();


export default repository;
