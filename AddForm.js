import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { 
	View,
	Text,
	TextInput,
	Divider,
	Caption,
	Tile,
	Title,
	Button,
	Row,
} from '@shoutem/ui';
import moment from 'moment';


export default class extends React.Component {
  componentWillMount() {
  	this.setState({
		surfer: '',
		board: '',
		sail: '',
		time: this.getCurrentTimeString(),
		'planned duration': '30',
        errors: [],
	})
  }

  render() {
    return (
      <ScrollView >

        <Tile styleName={'text-centric inflexible'}>
          <Title>Log surfing session</Title>
        </Tile>

		{this.renderFormSection('surfer', renderSuggestions=true)}

		{this.renderFormSection('sail', renderSuggestions=true)}

		{this.renderFormSection('board', renderSuggestions=true)}

		{this.renderFormSection('time', renderSuggestions=false, inputValue=this.getCurrentTimeString())}

		{this.renderFormSection('planned duration', renderSuggestions=false, inputValue="30")}

        <Divider styleName={'section-header'} />

		<Button style={{backgroundColor: 'lightgreen'}} onPress={this.onSubmit.bind(this)}>
			<Text>LOG SURF SESSION</Text>
		</Button>

      </ScrollView>
    );
  }

  onSubmit() {
    const {surfer, sail, board} = this.state;
    const surfSession = {
        surfer, sail, board,
        startTime: this.state.time,
        plannedDuration: this.state['planned duration']
    };

    const errors = {}
    for (const key in surfSession) {
        if (!surfSession[key]) {
            errors[key] = 'Required';
        }
    }
    if (Object.keys(errors).length) {
        this.setState({errors})
        return
    }
    this.props.onSubmit(surfSession);
  }

  renderFormSection(name, renderSuggestions=false, inputValue='') {
    const error = this.state.errors[name];
 	return (
		<View>
        	<Divider styleName={'section-header'}>
          		<Caption>{name.toUpperCase()}</Caption>
        	</Divider>
        	<TextInput
				value={this.state[name] || inputValue}
				onChangeText={(text) => {this.setState({[name]: text})}}
                style={{paddingBottom: 10, placeholderTextColor: error ? 'red' : null}}
                placeholder={error ? error : null}
			/>
            { renderSuggestions && this.renderSuggestions(name) }
  		</View>
	)
  }

  renderSuggestions(name) {
  	const options = this.props.suggest[name] || [];
    return (
		<View style={{flexDirection: 'row', marginBottom: 10}}>
      		{options.map((o) => (
				<Button
				    key={o}
                    style={{
						backgroundColor: '#4A90E2',
                        borderColor: "black",
                        borderRadius: 3,
						padding: 0,
						marginRight: 3, 
					}}
					onPress={()=>{this.setState({[name]: o})}}
				><Text style={{paddingRight: 2, paddingLeft: 2, margin: 0}}>{o}</Text></Button>
			))}
		</View>
	)
  }

  getCurrentTimeString() {
    return moment().format('HH:mm');
  }
}
