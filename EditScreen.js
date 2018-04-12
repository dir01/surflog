import React from "react";
import {connect} from "react-redux";
import {actionCreators} from "./actions";
import SurfSessionForm from "./SurfSessionForm";


class EditScreen extends React.Component {
    render() {
        const surfSession = this.props.navigation.state.params;
        return <SurfSessionForm
            submitText="UPDATE SURF SESSION"
            onSubmit={this.onSurfSessionSaved.bind(this)}
            instance={surfSession}
        />
    }

    onSurfSessionSaved(surfSession) {
        this.props.dispatch(actionCreators.surfSessionEdited(surfSession));
        this.props.navigation.goBack();
    }
}

export default connect()(EditScreen);
