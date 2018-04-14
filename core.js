import _ from 'lodash';
import moment from "moment";


export default class SurfLogProcessor {
    constructor(surfLogSessions) {
        this._surfSessions = surfLogSessions;
    }

    get inWaterSessions() {
        return _(this._surfSessions)
            .filter(s => !s.endTime)
            .map(s => {
                const now = moment();
                const startMoment = moment(s.startTime, 'HH:mm');
                const plannedDuration = s.plannedDuration;
                const plannedEndMoment = startMoment.clone().add(plannedDuration, 'm');
                const timeLeft = Math.round(plannedEndMoment.diff(now) / 1000 / 60);
                const timePassed = plannedDuration - timeLeft;
                const percentage = (plannedDuration - timeLeft) / plannedDuration;
                return {
                    ...s, timeLeft, timePassed, percentage,
                    plannedEndTime: plannedEndMoment.format('HH:mm'),
                }
            })
            .sortBy(s => s.timeLeft)
            .value();
    }

    get finishedSessions() {
        return _(this._surfSessions)
            .filter(s => s.endTime)
            .map(s => {
                const endMoment = moment(s.endTime, 'HH:mm');
                const startMoment = moment(s.startTime, 'HH:mm');
                const timePassed = endMoment.diff(startMoment) / 1000 / 60;
                const percentage = timePassed / s.plannedDuration;
                return {...s, timePassed, percentage}
            })
            .groupBy(s => s.surfer)
            .transform((result, sessions, surfer) => {
                const totalTimeMs = _.sumBy(sessions, (s) => {
                    const endMoment = moment(s.endTime, 'HH:mm');
                    const startMoment = moment(s.startTime, 'HH:mm');
                    return endMoment.diff(startMoment)
                });
                const totalTimeStr = moment.duration(totalTimeMs).humanize();
                result.push({surfer, sessions, totalTimeMs, totalTimeStr});
            }, [])
            .sortBy(item => -item.totalTimeMs)
            .value();
    }
}
