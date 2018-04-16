// A hack around shoutem/TextInput's inability to .focus() and properly refere underlying React Native's TextInput

import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {TextInput as RNTextInput} from 'react-native';

import {connectStyle} from '@shoutem/theme';
import {connectAnimation} from '@shoutem/animation';

class TextInput extends Component {
    render() {
        const {props} = this;
        const style = {
            ...props.style,
        };
        delete style.placeholderTextColor;
        delete style.selectionColor;
        delete style.underlineColorAndroid;

        return (
            <RNTextInput
                {...props}
                ref={(input) => props.inputRef && props.inputRef(input)}
                style={style}
                placeholderTextColor={props.style.placeholderTextColor}
                selectionColor={props.style.selectionColor}
                underlineColorAndroid={props.style.underlineColorAndroid}
            />
        );
    }
}

TextInput.propTypes = {
    ...RNTextInput.propTypes,
    style: PropTypes.object,
};

const AnimatedTextInput = connectAnimation(TextInput);
const StyledTextInput = connectStyle('shoutem.ui.TextInput')(AnimatedTextInput);

export default StyledTextInput;
