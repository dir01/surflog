import React from 'react';
import moment from 'moment';
import { View, Text, ListView, Heading, Title, Divider, Tile } from '@shoutem/ui';
import storage from './storage';

export default class extends React.Component {
    constructor(props){
        super(props);
        this.state = { inWater: [], finished: []};
    }

    async componentDidMount() {
        sessions = await storage.getTodaySurfSessions();
        inWater = []
        finished = []
        for (session of sessions) {
            if (session.endTime) {
                finished.push(session)
                continue
            }
            const startMoment = moment(session.time, 'hh:mm')
            const plannedEndMoment = startMoment.clone().add(session.plannedDuration, 'm');
            const timeLeft = Math.round(plannedEndMoment.diff(moment())/1000/60);
            const percentage = (session.plannedDuration - timeLeft) / session.plannedDuration
            inWater.push({timeLeft, percentage, ...session})
        }
        this.setState({inWater: inWater})
    }

    render() {
        return this.state.inWater.length == 0 ? this.renderEmptyMessage() : this.renderSessionsList();
    }

    renderEmptyMessage() {
        return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Text>No surf sessions today</Text></View>;
    }

    renderSessionsList() {
        return (
            <View>
                <Tile styleName={'text-centric inflexible'}>
                    <Title>In water</Title>
                </Tile>
                <ListView
                    data={this.state.inWater}
                    renderRow={this.renderSingleInWaterSession.bind(this)}
                />
            </View>
        );
    }

    renderSingleInWaterSession(session, number) {
        return (
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
                <Heading>{session.time}  <Title>{session.surfer}</Title></Heading>
                <Title>{`${session.sail}/${session.board}`}</Title>
                <Title>{`(${session.timeLeft})`}</Title>
            </View>
        )
    }

}

function getColor(value){
    //value from 0 to 1
    var hue=((1-value)*120).toString(10);
    return ["hsl(",hue,",100%,50%)"].join("");
};

