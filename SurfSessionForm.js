import uuidv4 from 'uuid/v4';
import React from 'react';
import {connect} from "react-redux";
import {ScrollView, StyleSheet} from 'react-native';
import {
    View,
    Text,
    Tile,
    Title,
    Button,
    Row,
    TouchableOpacity,
} from '@shoutem/ui';
import TextInput from './TextInput';
import moment from 'moment';


const addSuggestItemsToProps = connect(
    (state) => ({suggestItems: state.suggestItems})
);


class AddForm extends React.Component {
    componentWillMount() {
        const instance = this.props.instance || {};
        const isEditing = Boolean(this.props.instance);
        this.setState({
            instance, isEditing,
            surfer: instance.surfer || '',
            board: instance.board || '',
            sail: instance.sail || '',
            startTime: instance.startTime || this.getCurrentTimeString(),
            endTime: instance.endTime || null,
            plannedDuration: instance.plannedDuration || '30',
            errors: [],
        })
    }

    render() {
        return (
            <ScrollView contentContainerStyle={styles.formContainer}>
                <View>

                    <Tile styleName={'text-centric inflexible'}>
                        <Title>{this.props.submitText}</Title>
                    </Tile>

                    {this.renderFormSection('surfer', renderSuggestions = true)}

                    {this.renderFormSection('sail', renderSuggestions = true)}

                    {this.renderFormSection('board', renderSuggestions = true)}

                    {this.renderFormSection('startTime', renderSuggestions = false)}

                    {this.state.isEditing && this.renderFormSection('endTime', renderSuggestions = false)}

                    {!this.state.isEditing && this.renderFormSection('plannedDuration', renderSuggestions = false, inputValue = "30")}

                </View>
                <View>
                    <Button style={styles.submitButton} onPress={this.onSubmit.bind(this)}>
                        <Text style={styles.submitButtonText}>{this.props.submitText}</Text>
                    </Button>
                </View>
            </ScrollView>
        );
    }

    onSubmit() {
        const {surfer, sail, board, startTime, endTime, plannedDuration} = this.state;
        const surfSession = {
            id: this.state.instance.id || uuidv4(),
            surfer, sail, board, startTime, endTime, plannedDuration
        };

        const errors = {};
        for (const key in surfSession) {
            if (surfSession[key] === '') {
                errors[key] = 'Required';
            }
        }
        if (Object.keys(errors).length) {
            this.setState({errors});
            return
        }
        this.props.onSubmit(surfSession);
        this.componentWillMount()
    }

    renderFormSection(name, renderSuggestions = false, inputValue = '') {
        const error = this.state.errors[name];
        let input;
        return (
            <View>
                <Row>
                    <TouchableOpacity style={styles.labelContainer} onPress={() => input.focus()}>
                        <Text style={styles.labelText}>{name.replace(/([A-Z])/g, ' $1').toUpperCase()}</Text>
                    </TouchableOpacity>
                    <TextInput
                        inputRef={element => {
                            input = element
                        }}
                        value={this.state[name] || inputValue}
                        selectTextOnFocus={true}
                        onChangeText={(text) => {
                            this.setState({[name]: text})
                        }}
                        style={{...styles.input, placeholderTextColor: error ? 'red' : null}}
                        placeholder={error ? error : null}
                    />
                </Row>
                {renderSuggestions ? this.renderSuggestions(name) : null}
            </View>
        )
    }

    renderSuggestions(name) {
        const options = this.props.suggestItems[name] || [];
        return (
            <View style={styles.suggestionContainer}>
                {options.map((o) => (
                    <Button
                        key={o}
                        style={styles.suggestionButton}
                        onPress={() => {
                            this.setState({[name]: o})
                        }}
                    ><Text style={styles.suggestionText}>{o}</Text></Button>
                ))}
            </View>
        )
    }

    getCurrentTimeString() {
        return moment().format('HH:mm');
    }
}


const styles = {
    formContainer: {flex: 1, justifyContent: 'space-between', backgroundColor: 'white'},
    labelContainer: {
        alignSelf: 'stretch',
        flexDirection: 'row',
        flex: 1
    },
    labelText: {
        flexDirection: 'row',
        alignSelf: 'center',
    },
    input: {
        paddingBottom: 10,
        borderWidth: 1,
        borderColor: 'lightgray',
        flex: 4,
    },
    suggestionContainer: {flexDirection: 'row', marginBottom: 10, marginLeft: 15, backgroundColor: 'white'},
    suggestionButton: {
        backgroundColor: '#999',
        borderColor: '#999',
        borderRadius: 4,
        padding: 5,
        marginRight: 5,
    },
    suggestionText: {
        paddingRight: 2,
        paddingLeft: 2,
        margin: 0,
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
    },
    submitButton: {backgroundColor: 'lightgreen', padding: 20},
    submitButtonText: {fontSize: 20},
};


export default addSuggestItemsToProps(AddForm);
