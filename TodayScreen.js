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
    ScrollView,
    TouchableOpacity,
} from '@shoutem/ui';
import {Button as RNButton} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {actionCreators} from "./actions";
import SurfLogProcessor from "./core";


class TodayScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        const params = navigation.state.params || {};
        return {
            headerRight: (
                <RNButton onPress={() => params.onButtonPress()} title="Add"/>
            ),
        };
    };

    render() {
        const haveInWaterSessions = this.state.inWaterSessions.length !== 0;
        const haveFinishedSessions = this.state.finishedSessions.length !== 0;

        if (!haveInWaterSessions && !haveFinishedSessions) {
            this.props.navigation.replace('Add');
            return null;
        }

        return (
            <ScrollView style={{backgroundColor: 'white'}}>
                {haveInWaterSessions && this.renderInWaterSessionsList()}
                {haveFinishedSessions && this.renderSummariesList()}
            </ScrollView>
        )
    }

    componentWillMount() {
        this.processSessions();
        this.setState({
            updateInterval: setInterval(this.processSessions.bind(this), 50),
        });
        this.props.navigation.setParams({
            onButtonPress: () => {
                this.props.navigation.navigate('Add')
            }
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
        return (
            <Swipeout
                buttonWidth={70}
                autoClose={true}
                style={{backgroundColor: 'white'}}
                right={[
                    makeButton('delete', 'orangered', this.onSessionDelete.bind(this, session)),
                    makeButton('edit', 'orange', this.onSessionEdit.bind(this, session)),
                    makeButton('timer-off', 'royalblue', this.onSessionStop.bind(this, session)),
                ]}
            >
                <View key={number} style={{
                    flexDirection: 'row',
                    padding: 20,
                    alignItems: 'center',
                    borderBottomWidth: 1,
                    borderBottomColor: 'lightgray',
                    marginLeft: 30,
                }}>
                    <Heading style={{flex: 2}}>{session.surfer}</Heading>
                    <View style={{flex: 2, flexDirection: 'column', justifyContent: 'space-between'}}>
                        {this.renderSessionInfo(session)}
                        <Text styleName="secondary" style={{paddingTop: 4,}}>
                            {`${session.sail}/${session.board}`}
                        </Text>
                    </View>
                </View>
            </Swipeout>
        )
    }

    renderSessionInfo(session) {
        const color = getColor(session.percentage);
        return (
            <View style={{flexDirection: 'row'}}>
                <Title style={{color: 'gray'}}>
                    {`${session.startTime}–${session.endTime || moment().format('HH:mm')}, `}
                </Title>
                <Title style={{color}}>{session.timePassed}m</Title>
            </View>
        )
    }

    renderSingleSummary(summary, number) {
        const length = summary.sessions.length;
        const avg = Math.round(summary.totalTimeMs / length / 1000 / 60);
        const reportId = summary.surfer;

        return (
            <View style={{
                flexDirection: 'column',
                padding: 20,
                paddingLeft: 60,
                borderBottomWidth: 1,
                borderBottomColor: 'lightgray',
                backgroundColor: 'white'
            }}>

                <TouchableOpacity
                    key={number}
                    onPress={() => {
                        this.setState({
                            openedSummary: this.state.openedSummary !== reportId ? reportId : null
                        })
                    }}
                    style={{
                        padding: 0,
                        margin: 0,
                        flexDirection: 'row',
                    }}>
                    <Heading style={{flex: 2}}>{summary.surfer}</Heading>
                    <View style={{flex: 2, flexDirection: 'column', justifyContent: 'space-between'}}>
                        <Title style={{color: 'gray'}}>{summary.totalTimeStr}</Title>
                        <Text styleName="secondary" style={{paddingTop: 4}}>
                            {`${length} ${pluralize('session', length)}`}
                            {length > 1 && `, avg ${avg}m`}
                        </Text>
                    </View>
                </TouchableOpacity>

                {this.state.openedSummary === reportId ? (
                    <ListView
                        data={summary.sessions}
                        renderRow={this.renderSingleFinishedSession.bind(this)}
                    />
                ) : null}

            </View>
        )
    }

    renderSingleFinishedSession(session, sectionID, rowID) {
        return (
            <Swipeout
                autoClose={true}
                right={[
                    makeButton('edit', 'orange', this.onSessionEdit.bind(this, session)),
                    makeButton('delete', 'orangered', this.onSessionDelete.bind(this, session)),
                ]}
            >
                <View style={{
                    flexDirection: 'row',
                    padding: 10,
                    backgroundColor: 'white',
                    alignItems: 'center',
                }}>
                    <Title style={{color: 'gray'}}>{`${Number(rowID) + 1}) `}</Title>
                    {this.renderSessionInfo(session)}
                    <Title style={{marginLeft: 10, color: 'gray'}}>{`${session.sail}/${session.board}`}</Title>
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

    onSessionEdit(session) {
        this.props.navigation.navigate('Edit', session);
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
    return ["hsl(", hue, ",100%,48%)"].join("");
}


export default connect(
    state => ({surfSessions: state.surfSessions})
)(TodayScreen);

