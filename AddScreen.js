import React from 'react';
import {connect} from "react-redux";

import AddForm from './AddForm';
import {actionCreators} from "./actions";


class AddScreen extends React.Component {
    render() {
        return <AddForm
            suggest={this.props.suggestItems}
            onSubmit={this.onSurfSessionAdded.bind(this)}
        />
    }

    onSurfSessionAdded(surfSession) {
        this.props.dispatch(actionCreators.surfSessionAdded(surfSession));
        this.props.navigation.navigate('Today')
    }

}

export default connect(
    (state) => ({surfSessions: state.surfSessions, suggestItems: state.suggestItems})
)(AddScreen);
