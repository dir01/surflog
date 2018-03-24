import { AsyncStorage } from 'react-native';

class Storage {
    async saveSurfSession(sessionData) {
        const dateStr = this._getTodayDataStr();
        let days = await AsyncStorage.getItem('days') || '[]';
        days = JSON.parse(days);
        if (!days.includes(dateStr)) {
            days.push(dateStr)
        }
        await AsyncStorage.setItem('days', JSON.stringify(days));
        let sessions = await AsyncStorage.getItem(`days:${dateStr}`) || '[]';
        sessions = JSON.parse(sessions);
        sessions.push(sessionData);
        await AsyncStorage.setItem(`days:${dateStr}`, JSON.stringify(sessions));
    }

    async getTodaySurfSessions() {
        const key = `days:${this._getTodayDataStr()}`;
        sessions = await AsyncStorage.getItem(key);
        return JSON.parse(sessions);
    }

    _getTodayDataStr() {
        return new Date(Date.now()).toISOString().split('T')[0];
    }

}


const storage = new Storage();
export default storage;

