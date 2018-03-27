import {AsyncStorage} from 'react-native';

class Storage {
    async writeTodaySurfSessions(sessions) {
        await this._createDayIfRequired();
        await AsyncStorage.setItem(
            this._getTodaySessionsKey(),
            JSON.stringify(sessions)
        );
    }

    async getTodaySurfSessions() {
        const sessions = await AsyncStorage.getItem(this._getTodaySessionsKey()) || '[]';
        return JSON.parse(sessions) || [];
    }

    async writeSuggestItems(suggestItems) {
        await AsyncStorage.setItem('suggestItems', JSON.stringify(suggestItems))
    }

    async loadSuggestItems() {
        return JSON.parse(await AsyncStorage.getItem('suggestItems')) || {};
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

