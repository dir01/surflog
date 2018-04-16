import firebase from 'firebase';
import moment from "moment";


firebase.initializeApp({
    databaseURL: 'https://surflog-d7154.firebaseio.com/',
});
const database = firebase.database();


class FirebaseRepository {
    async writeTodaySurfSessions(sessions) {
        await database.ref('surfSessions').child(this.getTodayKey()).set(sessions)
    }

    async getTodaySurfSessions() {
        return (await database.ref('surfSessions').child(this.getTodayKey()).once('value')).val() || [];
    }

    async writeSuggestItems(suggestItems) {
        await database.ref('suggestItems').set(suggestItems)
    }

    async loadSuggestItems() {
        const snapshot = await database.ref('suggestItems').once('value');
        return snapshot.val() || {};
    }

    getTodayKey() {
        return moment().format('YYYY-MM-DD')
    }

}

const firebaseRepository = new FirebaseRepository();


export default firebaseRepository;

