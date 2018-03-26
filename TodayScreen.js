import React from 'react';
import moment from 'moment';
import Swipeout from 'react-native-swipeout';
import {connect} from 'react-redux';
import {
    View,
    Text,
    ListView,
    Heading,
    Title,
    Tile,
} from '@shoutem/ui';

import storage from './storage';
import {actionCreators} from "./actions";


class TodayScreen extends React.Component {
    render() {
        const haveInWaterSessions = this.inWaterSessions.length !== 0;
        const haveFinishedSessionse = this.finishedSessions.length !== 0;
        return (
            (haveInWaterSessions || haveFinishedSessionse)
            ? this.renderSessionsList()
            : this.renderEmptyMessage()
        );
    }

    renderEmptyMessage() {
        return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>No surf sessions today</Text>
        </View>;
    }

    renderSessionsList() {
        return (
            <View>
                <Tile styleName={'text-centric inflexible'}>
                    <Title>In water</Title>
                </Tile>
                <ListView
                    data={this.inWaterSessions}
                    renderRow={this.renderSingleInWaterSession.bind(this)}
                />
                <Tile styleName={'text-centric inflexible'}>
                    <Title>Finished</Title>
                </Tile>
                <ListView
                    data={this.finishedSessions}
                    renderRow={this.renderSingleFinishedSession.bind(this)}
                />
            </View>
        );
    }

    renderSingleInWaterSession(session, number) {
        return (
            <Swipeout right={[
                {text: 'Stop', onPress: this.onSessionStop.bind(this, session)}
            ]}>
                <View key={number} style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingLeft: 15,
                    paddingBottom: 10,
                    paddingTop: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: 'lightgray',
                    backgroundColor: getColor(session.percentage),
                }}>
                    <Heading>{session.startTime} <Title>{session.surfer}</Title></Heading>
                    <Title>{`${session.sail}/${session.board}`}</Title>
                    <Title>{`(${session.timeLeft})`}</Title>
                </View>
            </Swipeout>
        )
    }

    renderSingleFinishedSession(session, number) {
        return (
            <View key={number} style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
            }}>
                <Heading>{session.startTime} <Title>{session.surfer}</Title></Heading>
                <Title>{`${session.sail}/${session.board}`}</Title>
            </View>
        )
    }

    onSessionStop(session) {
        this.props.dispatch(actionCreators.surfSessionFinished(session.id, moment().format('HH:mm')));
    }

    get inWaterSessions() {
        const inWater = [];
        for (const session of this.props.surfSessions) {
            if (session.endTime) {
                continue
            }
            const startMoment = moment(session.startTime, 'hh:mm');
            const plannedEndMoment = startMoment.clone().add(session.plannedDuration, 'm');
            const now = moment();
            const timeLeft = Math.round(plannedEndMoment.diff(now) / 1000 / 60);
            const percentage = (session.plannedDuration - timeLeft) / session.plannedDuration;
            inWater.push({timeLeft, percentage, ...session})
        }
        return inWater;
    }

    get finishedSessions() {
        return this.props.surfSessions.filter((s) => s.endTime);
    }

}

function getColor(value) {
    //value from 0 to 1
    const hue = ((1 - value) * 120).toString(10);
    return ["hsl(", hue, ",100%,50%)"].join("");
}


export default connect(
    state => ({surfSessions: state.surfSessions})
)(TodayScreen);

