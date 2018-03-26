import {AsyncStorage} from 'react-native';
import MockAsyncStorage from 'mock-async-storage';
import storage from './storage';

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
    await storage.createSurfSession({});
    let keys = await AsyncStorage.getItem('days');
    keys = JSON.parse(keys);
    expect(keys).toContain('2018-03-23');
});

test('merges a day', async () => {
    await AsyncStorage.setItem('days', '["2018-03-22"]');
    await storage.createSurfSession({});
    let keys = await AsyncStorage.getItem('days');
    keys = JSON.parse(keys);
    expect(keys).toEqual(["2018-03-22", "2018-03-23"])
});

test('does not duplicate a day', async () => {
    await AsyncStorage.setItem('days', JSON.stringify(['2018-03-23']));
    await storage.createSurfSession({});
    let keys = await AsyncStorage.getItem('days');
    keys = JSON.parse(keys);
    expect(keys).toEqual(['2018-03-23'])
});

test('logs multiple surf sessions', async () => {
    await storage.createSurfSession({foo: 1});
    await storage.createSurfSession({foo: 2});
    let sessions = await AsyncStorage.getItem('days:2018-03-23');
    sessions = JSON.parse(sessions);
    expect(sessions.map((s) => s.foo)).toEqual([1, 2]);
    expect(sessions[0].id).toBeDefined();
});

test('deletes a surf session', async () => {
    await storage.createSurfSession({id: 1});
    await storage.createSurfSession({id: 2});
    await storage.createSurfSession({id: 3});
    await storage.deleteSurfSession(2);
    const sessions = await storage.getTodaySurfSessions();
    expect(sessions).toEqual([{id: 1}, {id: 3}])
});

test('updates a surf session', async () => {
    await storage.createSurfSession({id: 1});
    await storage.createSurfSession({id: 2});
    await storage.createSurfSession({id: 3});
    await storage.updateSurfSession(2, {foo: 'bar'});
    const sessions = await storage.getTodaySurfSessions();
    expect(sessions).toEqual([{id: 1}, {id: 2, foo: 'bar'}, {id: 3}])
});
