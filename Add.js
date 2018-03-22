
import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { View, Text, TextInput, Divider, Caption, Tile, Title, Button  } from '@shoutem/ui';


export default class extends React.Component {

  render() {
    return (
      <ScrollView >

        <Tile styleName={'text-centric inflexible'}>
          <Title>Log surfing session</Title>
        </Tile>

        <Divider styleName={'section-header'}>
          <Caption>SURFER</Caption>
        </Divider>
        <TextInput autoCapitalize="words"/>

        <Divider styleName={'section-header'}>
          <Caption>SAIL</Caption>
        </Divider>
        <TextInput />
		
        <Divider styleName={'section-header'}>
          <Caption>BOARD</Caption>
        </Divider>
        <TextInput />

		<Divider styleName={'section-header'}>
  			<Caption>TIME</Caption>
		</Divider>
		<TextInput value={this.getCurrentTimeString()} />

        <Divider styleName={'section-header'}>
          <Caption>PLANNED DURATION</Caption>
        </Divider>
        <TextInput value="30"/>

        <Divider styleName={'section-header'} />

		<Button style={{backgroundColor: 'lightgreen'}}><Text>LOG SURF SESSION</Text></Button>

      </ScrollView>
    );
  }

  getCurrentTimeString() {
	const [hours, minutes, ] = new Date().toLocaleTimeString().split(':');
	return `${hours}:${minutes}`;
  }
}
