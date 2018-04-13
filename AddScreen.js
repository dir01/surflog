import React from 'react';
import {connect} from "react-redux";

import SurfSessionForm from './SurfSessionForm';
import {actionCreators} from "./actions";
import { NavigationActions } from 'react-navigation';


class AddScreen extends React.Component {
    render() {
        return <SurfSessionForm
            submitText="LOG SURF SESSION"
            onSubmit={this.onSurfSessionAdded.bind(this)}
        />
    }

    onSurfSessionAdded(surfSession) {
        this.props.dispatch(actionCreators.surfSessionAdded(surfSession));
        this.props.navigation.dispatch(NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: 'Today'})],
        }));
    }
}

export default connect()(AddScreen);
