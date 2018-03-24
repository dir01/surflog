import React, { Component } from 'react';
import AddForm from './AddForm';
import storage from './storage';

export default class extends React.Component {
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
		storage.saveSurfSession(surfSession)
        this.props.navigation.navigate('Today')
	}

}
