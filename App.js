import {
  StyleSheet,
  Text,
  Button,
  TextInput,
} from 'react-native';
import { TabNavigator } from 'react-navigation';

import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import { Font, AppLoading } from 'expo';
import { View, Examples } from '@shoutem/ui';
import AddScreen from './Add';

class TodayScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Home!</Text>
      </View>
    );
  }
}



const TabNav = TabNavigator({
  Today: { screen: TodayScreen },
  Add: { screen: AddScreen },
}, {initialRouteName: 'Add'});



export default class App extends React.Component {
      state = {
 	     fontsAreLoaded: false,
      };

      async componentWillMount() {
         await Font.loadAsync({
             'Rubik-Black': require('./node_modules/@shoutem/ui/fonts/Rubik-Black.ttf'),
             'Rubik-BlackItalic': require('./node_modules/@shoutem/ui/fonts/Rubik-BlackItalic.ttf'),
             'Rubik-Bold': require('./node_modules/@shoutem/ui/fonts/Rubik-Bold.ttf'),
             'Rubik-BoldItalic': require('./node_modules/@shoutem/ui/fonts/Rubik-BoldItalic.ttf'),
             'Rubik-Italic': require('./node_modules/@shoutem/ui/fonts/Rubik-Italic.ttf'),
             'Rubik-Light': require('./node_modules/@shoutem/ui/fonts/Rubik-Light.ttf'),
             'Rubik-LightItalic': require('./node_modules/@shoutem/ui/fonts/Rubik-LightItalic.ttf'),
             'Rubik-Medium': require('./node_modules/@shoutem/ui/fonts/Rubik-Medium.ttf'),
             'Rubik-MediumItalic': require('./node_modules/@shoutem/ui/fonts/Rubik-MediumItalic.ttf'),
             'Rubik-Regular': require('./node_modules/@shoutem/ui/fonts/Rubik-Regular.ttf'),
             'rubicon-icon-font': require('./node_modules/@shoutem/ui/fonts/rubicon-icon-font.ttf'),
          });
          this.setState({ fontsAreLoaded: true });
      }

      render() {
          if (!this.state.fontsAreLoaded) {
              return <AppLoading />;
          } else {
              return (<TabNav />); 
            }
	  }
};
