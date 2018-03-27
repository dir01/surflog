import React from 'react';
import {TabNavigator} from 'react-navigation';
import {Font, AppLoading} from 'expo';
import {Provider, connect} from 'react-redux';


import configureStore from './configureStore';
import storage from "./storage";
import AddScreen from './AddScreen';
import TodayScreen from './TodayScreen';
import {actionCreators} from "./actions";


const TabNav = TabNavigator({
    Today: {screen: TodayScreen},
    Add: {screen: AddScreen},
}, {initialRouteName: 'Today'});


class App extends React.Component {
    state = {
        fontsAreLoaded: false,
    };

    async componentWillMount() {
        await loadFonts();
        this.setState({fontsAreLoaded: true});
        const surfSessions = await storage.getTodaySurfSessions();
        this.props.dispatch(actionCreators.surfSessionsLoaded(surfSessions));
        const suggestItems = await storage.loadSuggestItems();
        this.props.dispatch(actionCreators.suggestItemsLoaded(suggestItems));
    }

    render() {
        if (!this.state.fontsAreLoaded) {
            return <AppLoading/>;
        } else {
            return <TabNav/>;
        }
    }
}

const AppWithDispatch = connect()(App);


export default AppWithStore = () => (
    <Provider store={configureStore()}>
        <AppWithDispatch/>
    </Provider>
);


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
