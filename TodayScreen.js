import React from 'react';
import moment from 'moment';
import pluralize from "pluralize";
import Swipeout from 'react-native-swipeout';
import {connect} from 'react-redux';
import {
    View,
    Text,
    ListView,
    Heading,
    Title,
    Tile,
    Row,
    Button,
    ScrollView
} from '@shoutem/ui';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {actionCreators} from "./actions";
import SurfLogProcessor from "./core";


class TodayScreen extends React.Component {
    render() {
        const haveInWaterSessions = this.state.inWaterSessions.length !== 0;
        const haveFinishedSessions = this.state.finishedSessions.length !== 0;

        if (haveInWaterSessions || haveFinishedSessions) {
            return (
                <ScrollView>
                    {haveInWaterSessions && this.renderInWaterSessionsList()}
                    {haveFinishedSessions && this.renderSummariesList()}
                </ScrollView>
            )
        } else {
            return this.renderEmptyMessage();
        }
    }

    componentWillMount() {
        this.processSessions();
        this.setState({
            updateInterval: setInterval(this.processSessions.bind(this), 1000),
        });
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

    renderInWaterSessionsList() {
        return (
            <View>
                <Tile styleName={'text-centric inflexible'}>
                    <Title>In water</Title>
                </Tile>
                <ListView
                    data={this.state.inWaterSessions}
                    renderRow={this.renderSingleInWaterSession.bind(this)}
                />
            </View>
        );
    }

    renderSummariesList() {
        return (
            <View>
                <Tile styleName={'text-centric inflexible'}>
                    <Title>Finished</Title>
                </Tile>
                <ListView
                    data={this.state.finishedSessions}
                    renderRow={this.renderSingleSummary.bind(this)}
                />
            </View>
        );
    }

    renderSingleInWaterSession(session, number) {
        const colorStyle = {color: getColor(session.percentage)};
        return (
            <Swipeout
                buttonWidth={60}
                right={[
                    makeButton('delete', 'orangered', this.onSessionDelete.bind(this, session)),
                    makeButton('timer-off', 'royalblue', this.onSessionStop.bind(this, session)),
                ]}
            >
                <View key={number} style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 10,
                    backgroundColor: 'white',
                    borderBottomWidth: 1,
                    borderBottomColor: 'lightgray',
                }}>
                    <Row style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', padding: 0}}>
                        <Icon name="access-time" size={30} style={{...colorStyle}}/>
                        <Heading style={colorStyle}>{session.timeLeft}</Heading>
                    </Row>
                    <Heading style={{flex: 2}}>{session.surfer}</Heading>
                    <Title>{`${session.sail}/${session.board}`}</Title>
                </View>
            </Swipeout>
        )
    }

    renderSingleSummary(summary, number) {
        const length = summary.sessions.length;
        const avg = Math.round(summary.totalTimeMs / length / 1000 / 60);
        const reportId = summary.surfer;

        return (
            <View style={{backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: 'lightgray'}}>

                <Button
                    key={number}
                    onPress={() => {
                        this.setState({openedSummary: this.state.openedSummary !== reportId ? reportId : null})
                    }}
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Row>
                        <Heading style={{flex: 0.5}}>{summary.surfer}</Heading>
                        <View style={{flex: 0.5, flexDirection: 'column'}}>
                            <Title style={{color: 'gray'}}>{summary.totalTimeStr}</Title>
                            <Text>
                                {`${length} ${pluralize('session', length)}`}
                                {length > 1 && `, avg ${avg}m`}
                            </Text>
                        </View>
                    </Row>
                </Button>

                {this.state.openedSummary === reportId && (
                    <ListView
                        data={summary.sessions}
                        renderRow={session => {
                            return (
                                <Swipeout
                                    right={[
                                        makeButton('delete', 'orangered',this.onSessionDelete.bind(this, session)),
                                    ]}
                                >
                                    <View style={{
                                        flexDirection: 'row',
                                        padding: 10,
                                        justifyContent: 'space-around',
                                        alignItems: 'center',
                                        backgroundColor: 'white',
                                    }}>
                                        <Text>{`${session.startTime}-${session.endTime}`}</Text>
                                        <Text>{`${session.sail}/${session.board}`}</Text>
                                    </View>
                                </Swipeout>
                            )
                        }}/>
                )}

            </View>
        )
    }

    onSessionStop(session) {
        this.props.dispatch(actionCreators.surfSessionFinished(session.id, moment().format('HH:mm')));
    }

    onSessionDelete(session) {
        this.props.dispatch(actionCreators.surfSessionDeleted(session.id));
    }
}


const makeButton = (iconName, backgroundColor, onPress) => {
    return {
        onPress: onPress,
        component: <View style={{
            backgroundColor: backgroundColor,
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        }}><Icon
            name={iconName}
            size={30}
            color="white"
        /></View>
    }
};


function getColor(value) {
    //value from 0 to 1
    const hue = ((1 - value) * 120).toString(10);
    return ["hsl(", hue, ",100%,50%)"].join("");
}


export default connect(
    state => ({surfSessions: state.surfSessions})
)(TodayScreen);

