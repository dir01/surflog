import React from 'react';
import {StackNavigator} from 'react-navigation';
import {Font} from 'expo';
import {Provider, connect} from 'react-redux';

import configureStore from './configureStore';
import AddScreen from './AddScreen';
import EditScreen from './EditScreen';
import TodayScreen from './TodayScreen';
import repository from "./persistance";
import {actionCreators} from "./actions";
import {View, Spinner} from "@shoutem/ui";


const Navigation = StackNavigator({
    Today: {screen: TodayScreen},
    Add: {screen: AddScreen},
    Edit: {screen: EditScreen},
}, {initialRouteName: 'Today'});


class App extends React.Component {
    state = {
        isAppLoaded: false
    };

    async componentWillMount() {
        await loadFonts();
        repository.onTodaySurfSessionsLoaded((surfSessions) => {
            this.props.dispatch(actionCreators.surfSessionsLoaded(surfSessions));
            this.setState({isAppLoaded: true})
        });
        repository.onSuggestItemsLoaded((suggestItems) => {
            this.props.dispatch(actionCreators.suggestItemsLoaded(suggestItems));
        });
    }

    render() {
        if (this.state.isAppLoaded) {
            return <Navigation/>
        } else {
            return (
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Spinner size="large"/>
                </View>
            );
        }
    }
}

function loadFonts() {
    return Font.loadAsync({
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
}

const AppWithDispatch = connect()(App);

export default AppWithStore = () => (
    <Provider store={configureStore()}>
        <AppWithDispatch/>
    </Provider>
);


