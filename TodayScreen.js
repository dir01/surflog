import React from 'react';
import moment from 'moment';
import pluralize from "pluralize";
import Swipeout from 'react-native-swipeout';
import {connect} from 'react-redux';
import {
    View,
    Text,
    ListView,
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

    state = {
        openedSummary: null,
    };

    render() {
        const {inWaterSessions, finishedSessions} = new SurfLogProcessor(this.props.surfSessions);

        if (!inWaterSessions.length && !finishedSessions.length) {
            return <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Title>No surf sessions today</Title>
            </View>;
        }

        return (
            <ScrollView style={styles.white}>
                <InWaterSessionsList
                    sessions={inWaterSessions}
                    onSessionDelete={this.onSessionDelete.bind(this)}
                    onSessionEdit={this.onSessionEdit.bind(this)}
                    onSessionStop={this.onSessionStop.bind(this)}
                />
                <SummariesList
                    summaries={finishedSessions}
                    onSessionEdit={this.onSessionEdit.bind(this)}
                    onSessionDelete={this.onSessionDelete.bind(this)}
                />
            </ScrollView>
        )
    }

    componentWillMount() {
        this.setState({
            updateInterval: setInterval(() => {
                if (this.props.navigation.isFocused()) {
                    this.forceUpdate();
                }
            }, 10000)
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

    onSessionStop(session) {
        this.props.dispatch(actionCreators.surfSessionFinished(session));
    }

    onSessionDelete(session) {
        this.props.dispatch(actionCreators.surfSessionDeleted(session.id));
    }

    onSessionEdit(session) {
        this.props.navigation.navigate('Edit', session);
    }
}


const InWaterSessionsList = (props) => {
    const {sessions, onSessionDelete, onSessionEdit, onSessionStop} = props;
    if (!sessions.length) {
        return null;
    }
    return (
        <View>
            <Tile styleName={'text-centric inflexible'}>
                <Title>In water</Title>
            </Tile>
            <ListView
                data={sessions}
                renderRow={(session, number) => {
                    return (
                        <Swipeout
                            buttonWidth={70}
                            autoClose={true}
                            style={styles.white}
                            right={[
                                makeButton('delete', 'orangered', () => onSessionDelete(session)),
                                makeButton('edit', 'orange', () => onSessionEdit(session)),
                                makeButton('timer-off', 'royalblue', () => onSessionStop(session)),
                            ]}
                        >
                            <View key={number} style={styles.sessionContainer}>
                                <Title style={styles.sessionLeft}>{session.surfer}</Title>
                                <View style={styles.sessionRight}>
                                    <Title size={{fontSize: 10}}>
                                        <SessionInfo session={session} style={styles.inWaterSessionInfo}/>
                                    </Title>
                                    <Text
                                        style={styles.sessionSecondaryText}>{`${session.sail}/${session.board}`}</Text>
                                </View>
                            </View>
                        </Swipeout>
                    )
                }}
            />
        </View>
    );
};


class SummariesList extends React.Component {
    state = {
        openedSummary: null,
    };


    render() {

        const {summaries} = this.props;
        if (!summaries.length) {
            return null
        }
        return (
            <View>
                <Tile styleName={'text-centric inflexible'}>
                    <Title>Finished</Title>
                </Tile>
                <ListView
                    data={summaries}
                    renderRow={this.renderSingleSummary.bind(this)}
                    key={this.state.openedSummary}
                />
            </View>
        );
    }

    renderSingleSummary(summary, number) {
        const length = summary.sessions.length;
        const avg = Math.round(summary.totalTimeMs / length / 1000 / 60);
        const reportId = summary.surfer;

        return (
            <View style={{
                flexDirection: 'column',
                borderBottomWidth: 1,
                borderBottomColor: 'lightgray',
            }}>

                <TouchableOpacity
                    key={number}
                    onPress={() => {
                        this.setState({
                            openedSummary: this.state.openedSummary !== reportId ? reportId : null
                        })
                    }}
                    style={{
                        ...styles.sessionContainer,
                        borderBottomWidth: 0,
                    }}
                >
                    <Title style={styles.sessionLeft}>{summary.surfer}</Title>
                    <View style={styles.sessionRight}>
                        <Title>{summary.totalTimeStr}</Title>
                        <Text style={styles.sessionSecondaryText}>
                            {`${length} ${pluralize('session', length)}`}
                            {length > 1 && `, avg ${avg}m`}
                        </Text>
                    </View>
                </TouchableOpacity>

                {this.state.openedSummary === reportId ? (
                    <ListView
                        data={summary.sessions}
                        renderRow={this.renderSingleFinishedSession.bind(this)}
                        key={this.state.openedSummary}
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
                    makeButton('edit', 'orange', () => {
                        this.props.onSessionEdit(session)
                    }),
                    makeButton('delete', 'orangered', () => {
                        this.props.onSessionDelete(session)
                    }),
                ]}
            >
                <View style={styles.finishedSessionContainer}>
                    <View style={{flex: 3}}>
                        <Text>
                            <Text>{`${Number(rowID) + 1}) `}</Text>
                            <SessionInfo session={session}/>
                        </Text>
                    </View>
                    <View style={{flex: 2}}>
                        <Text>
                            {`${session.sail}/${session.board}`}
                        </Text>
                    </View>
                </View>
            </Swipeout>
        )
    }
}


const makeButton = (iconName, backgroundColor, onPress) => {
    return {
        onPress: onPress,
        component: <View style={{...styles.swipeOutButton, backgroundColor}}>
            <Icon
                name={iconName}
                size={30}
                color="white"
            />
        </View>
    }
};


const SessionInfo = (props) => {
    const {session, style} = props;
    return (
        <Text style={style}>
            <Text style={style}>
                {`${session.startTime}–${session.endTime || moment().format('HH:mm')}, `}
            </Text>
            <Text style={{...style, color: getColor(session.percentage)}}>
                {session.timePassed}m
            </Text>
        </Text>
    );
};


const styles = {
    white: {backgroundColor: 'white'},
    column: {flex: 1},
    sessionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray',
    },
    sessionLeft: {flex: 5},
    sessionRight: {flex: 7},
    sessionSecondaryText: {marginTop: 6},
    inWaterSessionInfo: {
        fontSize: 19,
        color: 'black',
    },
    finishedSessionContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        justifyContent: 'flex-start',
        paddingLeft: 25,
        paddingRight: 20,
        paddingTop: 0,
        paddingBottom: 20,
    },
    swipeOutButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
};


function getColor(value) {
    //value from 0 to 1
    const hue = ((1 - value) * 120).toString(10);
    return ["hsl(", hue, ",100%,48%)"].join("");
}


export default connect(
    state => ({surfSessions: state.surfSessions})
)(TodayScreen);

