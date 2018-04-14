import SurfLogProcessor from "./core";
import moment from "moment";

const mockedNow = moment('12:05', 'HH:mm').toDate();
jest.spyOn(Date, 'now').mockImplementation(() => mockedNow);

const l1 = {surfer: 'Luka', startTime: '10:55', endTime: '11:07', plannedDuration: 10};
const al1 = {surfer: 'Alesya', startTime: '11:02', endTime: '11:24', plannedDuration: 10};
const an1 = {surfer: 'Andrey', startTime: '11:04', endTime: '11:37', plannedDuration: 10};
const l2 = {surfer: 'Luka', startTime: '11:43', endTime: '12:15', plannedDuration: 10};
const an2 = {surfer: 'Andrey', startTime: '11:57', endTime: '12:32', plannedDuration: 10};

const al2 = {surfer: 'Alesya', startTime: '11:59', plannedDuration: 10};
const di1 = {surfer: 'Dima', startTime: '11:58', plannedDuration: 10};

const fakeSessions = [l1, al1, an1, l2, an2, al2, di1];
const processor = new SurfLogProcessor(fakeSessions);


test('In water sessions', () => {
    expect(processor.inWaterSessions).toEqual([
        {...di1, timeLeft: 3, timePassed: 7, plannedEndTime: '12:08', percentage: 0.7},
        {...al2, timeLeft: 4, timePassed: 6, plannedEndTime: '12:09', percentage: 0.6},
    ]);
});


test('Finished sessions', () => {
    expect(processor.finishedSessions).toEqual([
        {
            surfer: 'Andrey',
            sessions: [
                {...an1, timePassed: 33, percentage: 3.3},
                {...an2, timePassed: 35, percentage: 3.5}
            ],
            totalTimeMs: 4080000,
            totalTimeStr: "an hour"
        },
        {
            surfer: 'Luka',
            sessions: [
                {...l1, timePassed: 12, percentage: 1.2},
                {...l2, timePassed: 32, percentage: 3.2}
            ],
            totalTimeMs: 2640000,
            totalTimeStr: "44 minutes"
        },
        {
            surfer: 'Alesya',
            sessions: [{...al1, timePassed: 22, percentage: 2.2}],
            totalTimeMs: 1320000,
            totalTimeStr: "22 minutes"
        },
    ])
});
