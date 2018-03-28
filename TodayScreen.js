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

import {actionCreators} from "./actions";
import SurfLogProcessor from "./core";


class TodayScreen extends React.Component {
    render() {
        const haveInWaterSessions = this.state.inWaterSessions.length !== 0;
        const haveFinishedSessions = this.state.finishedSessions.length !== 0;
        return (
            (haveInWaterSessions || haveFinishedSessions)
                ? this.renderSessionsList()
                : this.renderEmptyMessage()
        );
    }

    componentWillMount() {
        this.processSessions();
        this.setState({updateInterval: setInterval(this.processSessions.bind(this), 1000)});
    }

    componentWillUnmount() {
        clearInterval(this.state.updateInterval);
    }

    processSessions() {
        const processor = new SurfLogProcessor(this.props.surfSessions);
        this.setState({
            inWaterSessions: processor.inWaterSessions,
            finishedSessions: processor.finishedSessions,
        });
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
                    data={this.state.inWaterSessions}
                    renderRow={this.renderSingleInWaterSession.bind(this)}
                />
                <Tile styleName={'text-centric inflexible'}>
                    <Title>Finished</Title>
                </Tile>
                {/*
                <ListView
                    data={this.state.finishedSessions}
                    renderRow={this.renderSingleFinishedSession.bind(this)}
                />
*/}
            </View>
        );
    }

    renderSingleInWaterSession(session, number) {
        return (
            <Swipeout
                right={[
                    {text: 'Stop', onPress: this.onSessionStop.bind(this, session)}
                ]}
                left={[
                    {text: 'Delete', onPress: this.onSessionDelete.bind(this, session)}
                ]}
            >
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
            <Swipeout
                left={[
                    {text: 'Delete', onPress: this.onSessionDelete.bind(this, session)}
                ]}
            >
                <View key={number} style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}>
                    <Heading>{session.startTime} <Title>{session.surfer}</Title></Heading>
                    <Title>{`${session.sail}/${session.board}`}</Title>
                </View>
            </Swipeout>
        )
    }

    onSessionStop(session) {
        this.props.dispatch(actionCreators.surfSessionFinished(session.id, moment().format('HH:mm')));
    }

    onSessionDelete(session) {
        this.props.dispatch(actionCreators.surfSessionDeleted(session.id));
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

