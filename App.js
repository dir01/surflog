import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
} from 'react-native';
import { TabNavigator } from 'react-navigation';


class TodayScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Home!</Text>
      </View>
    );
  }
}

class AddScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

        <View style={style.inputGroup}>
          <Text>Surfer</Text>
          <TextInput 
			style={style.input}
            onChangeText={(surfer) => {this.setState({surfer})}}
          />
        </View>

		<View>
			<Text>Sail</Text>
			<TextInput
				onChangeText={(sail)=>{this.setState({sail})}}
			/>
		</View>

      </View>
    );
  }
}

const style = StyleSheet.create({
	inputGroup: {
   		flexDirection: 'row',
	},
	input: {
		borderColor: 'black',
	}
});



export default TabNavigator({
  Today: { screen: TodayScreen },
  Add: { screen: AddScreen },
}, {initialRouteName: 'Add'});

