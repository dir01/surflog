import uuidv4 from 'uuid/v4';
import { AsyncStorage } from 'react-native';

class Storage {
    async createSurfSession(sessionData) {
        if (!sessionData.id) sessionData.id = uuidv4();
        await this._createDayIfRequired();
        const sessions = await this.getTodaySurfSessions();
        sessions.push(sessionData);
        await this._writeTodaySessions(sessions);
    }

    async updateSurfSession(sessionId, newData) {
        const sessions = await this.getTodaySurfSessions();
        for (const s of sessions) {
            if (s.id === sessionId) {
                Object.assign(s, newData)
            }
        }
        await this._writeTodaySessions(sessions);
    }

    async deleteSurfSession(sessionId) {
        let sessions = await this.getTodaySurfSessions();
        sessions = sessions.filter((s) => s.id !== sessionId);
        await this._writeTodaySessions(sessions);
    }

    async getTodaySurfSessions() {
        sessions = await AsyncStorage.getItem(this._getTodaySessionsKey()) || '[]';
        return JSON.parse(sessions) || [];
    }

    async _writeTodaySessions(sessions) {
        await AsyncStorage.setItem(
            this._getTodaySessionsKey(),
            JSON.stringify(sessions)
        );
    }

    async _createDayIfRequired() {
        const dateStr = this._getTodayDataStr();
        let days = await AsyncStorage.getItem('days') || '[]';
        days = JSON.parse(days);
        if (!days.includes(dateStr)) {
            days.push(dateStr)
        }
        await AsyncStorage.setItem('days', JSON.stringify(days));
    }

    _getTodaySessionsKey() {
        return `days:${this._getTodayDataStr()}`;
    }

    _getTodayDataStr() {
        return new Date(Date.now()).toISOString().split('T')[0];
    }

}


const storage = new Storage();
export default storage;

