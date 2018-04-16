import {AsyncStorage} from 'react-native';
import MockAsyncStorage from 'mock-async-storage';
import repository from './AsyncStorageRepository';

beforeEach(() => {
    const mockImpl = new MockAsyncStorage();
    jest.mock('AsyncStorage', () => mockImpl);
    AsyncStorage.clear();
    dateSpy = jest.spyOn(Date, 'now').mockImplementation(
        () => new Date(Date.parse('2018-03-23')).valueOf()
    );
});

afterEach(() => {
    jest.unmock('AsyncStorage');
});


test('creates a day', async () => {
    await repository.writeTodaySurfSessions([]);
    let keys = await AsyncStorage.getItem('days');
    keys = JSON.parse(keys);
    expect(keys).toContain('2018-03-23');
});

test('merges a day', async () => {
    await AsyncStorage.setItem('days', '["2018-03-22"]');
    await repository.writeTodaySurfSessions([]);
    let keys = await AsyncStorage.getItem('days');
    keys = JSON.parse(keys);
    expect(keys).toEqual(["2018-03-22", "2018-03-23"])
});

test('does not duplicate a day', async () => {
    await AsyncStorage.setItem('days', JSON.stringify(['2018-03-23']));
    await repository.writeTodaySurfSessions([]);
    let keys = await AsyncStorage.getItem('days');
    keys = JSON.parse(keys);
    expect(keys).toEqual(['2018-03-23'])
});

test('writes surf sessions', async () => {
    await repository.writeTodaySurfSessions([{id: 1}, {id: 2}]);
    let sessions = await AsyncStorage.getItem('days:2018-03-23');
    sessions = JSON.parse(sessions);
    expect(sessions.map((s) => s.id)).toEqual([1, 2]);
});
