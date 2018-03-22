
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



export default class extends React.Component {
  componentWillMount() {
  	this.setState({
		surfer: '',
		board: '',
		sail: '',
		time: this.getCurrentTimeString(),
		'planned duration': '30',
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

		<Button 
			style={{backgroundColor: 'lightgreen'}}
			onPress={()=>{console.log(this.state)}}
		>
			<Text>LOG SURF SESSION</Text>
		</Button>

      </ScrollView>
    );
  }

  renderFormSection(name, renderSuggestions=false, inputValue='') {
 	return (
		<View>
        	<Divider styleName={'section-header'}>
          		<Caption>{name.toUpperCase()}</Caption>
        	</Divider>
        	<TextInput
				value={this.state[name] || inputValue}
				onChangeText={(text) => {this.setState({[name]: text})}}
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
						padding: 0, 
						marginRight: 2, 
					}}
					onPress={()=>{this.setState({[name]: o})}}
				><Text style={{paddingRight: 2, paddingLeft: 2, margin: 0}}>{o}</Text></Button>
			))}
		</View>
	)
  }

  getCurrentTimeString() {
	const [hours, minutes, ] = new Date().toLocaleTimeString().split(':');
	return `${hours}:${minutes}`;
  }
}
