import React from 'react';
import {connect} from "react-redux";

import SurfSessionForm from './SurfSessionForm';
import {actionCreators} from "./actions";


class AddScreen extends React.Component {
    render() {
        return <SurfSessionForm
            submitText="LOG SURF SESSION"
            onSubmit={this.onSurfSessionAdded.bind(this)}
        />
    }

    onSurfSessionAdded(surfSession) {
        this.props.dispatch(actionCreators.surfSessionAdded(surfSession));
        this.props.navigation.navigate('Today')
    }
}

export default connect()(AddScreen);
