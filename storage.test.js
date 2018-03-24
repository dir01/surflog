import { AsyncStorage } from 'react-native';
import MockAsyncStorage from 'mock-async-storage';
import storage from './storage';

beforeEach(() => {
  const mockImpl = new MockAsyncStorage()
  jest.mock('AsyncStorage', () => mockImpl)
  dateSpy = jest.spyOn(Date, 'now').mockImplementation(
      () => new Date(Date.parse('2018-03-23')).valueOf()
  );
});

afterEach(() => {
  jest.unmock('AsyncStorage');
})


test('creates a day', async () => {
  await storage.saveSurfSession({});
  let keys = await AsyncStorage.getItem('days');
  keys = JSON.parse(keys);
  expect(keys).toContain('2018-03-23');
});

test('merges a day', async () => {
	await AsyncStorage.setItem('days', '["2018-03-22"]')
	await storage.saveSurfSession({})
    let keys = await AsyncStorage.getItem('days')
    keys = JSON.parse(keys);
	expect(keys).toEqual(["2018-03-22", "2018-03-23"])
});

test('does not duplicate a day', async () => {
	await AsyncStorage.setItem('days', JSON.stringify(['2018-03-23']))
	await storage.saveSurfSession({})
	let keys = await AsyncStorage.getItem('days');
    keys = JSON.parse(keys);
	expect(keys).toEqual(['2018-03-23'])
});

test('logs multiple surf sessions', async () => {
    AsyncStorage.clear()
	await storage.saveSurfSession({id:1})
    await storage.saveSurfSession({id:2})
	let sessions = await AsyncStorage.getItem('days:2018-03-23')
    sessions = JSON.parse(sessions);
	expect(sessions).toEqual([{id:1}, {id:2}])
});
