import React from 'react';
import { View, Text } from '@shoutem/ui';
import storage from './storage';

export default class extends React.Component {
    constructor(props){
        super(props);
        this.state = { sessions: []};
    }

    async componentDidMount() {
        sessions = await storage.getTodaySurfSessions();
        this.setState({sessions})
    }

    render() {
        if (!this.state.sessions) {
            return <View><Text>No surf sessions today</Text></View>
        }
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {this.state.sessions.map((s, i) => <Text key={i}>{JSON.stringify(s)}</Text>)}
            </View>
        );
  }
}

