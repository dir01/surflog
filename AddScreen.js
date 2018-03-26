import React from 'react';
import AddForm from './AddForm';
import storage from './storage';
import {connect} from "react-redux";
import {actionCreators} from "./actions";


class AddScreen extends React.Component {
    render() {
        return <AddForm
            suggest={{
                surfer: ['Luka', 'Andrey', 'Alesya', 'Dima', 'Max', 'Ilya', 'Ksusha'],
                sail: ['6.0', '5.8', '5.3', '4.0'],
                board: ['133', '148', '133 gecko']
            }}
            onSubmit={this.onSurfSessionAdded.bind(this)}
        />
    }

    onSurfSessionAdded(surfSession) {
        this.props.dispatch(actionCreators.surfSessionAdded(surfSession));
        this.props.navigation.navigate('Today')
    }

}

export default connect(
    (state) => ({surfSessions: state.surfSessions})
)(AddScreen);
