import React, { Component } from 'react';
import {
    StyleSheet,
    TextInput,
    TextInputProperties,
    NativeSyntheticEvent,
    TextInputEndEditingEventData,
} from 'react-native';
import {
    Paragraph
} from 'react-native-paper';


interface IStyledTextInputProps extends TextInputProperties {
    label: string;
    required?: boolean;
    setValid?: (valid: boolean) => void;
}
interface IStyledTextInputState {
    valid: boolean;
}

export default class ValidatedTextInput extends Component<IStyledTextInputProps, IStyledTextInputState> {
    constructor(props: any) {
        super(props);
        this.state = {
            valid: true,
        };
    }

    handleEndEditing = (e: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
        const valid = !(this.props.required && e.nativeEvent.text.length === 0);
        if (this.props.setValid !== undefined) {
            this.props.setValid(valid);
        }
        this.setState({ valid });
        e.preventDefault();
    }

    render() {
        const { valid } = this.state;
        return <>
            <Paragraph style={styles.inputTextFieldLabel}>{this.props.label} {this.props.required ? '(*)': ''}</Paragraph>
            <TextInput
                style={styles.inputTextField}
                onEndEditing={this.handleEndEditing}
                {...this.props}
            />
            {!valid && <Paragraph style={styles.inputTextNotValid}>Not Valid!</Paragraph>}
        </>;
    }
}

const styles = StyleSheet.create({
    inputTextFieldLabel: {
        color: 'grey',
        fontFamily: 'sans-serif-thin'
    },
    inputTextField: {
        padding: 10,
        marginVertical: 5,
        borderStyle: 'solid',
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 5
    },
    inputTextNotValid: {
        color: 'red',
    }
});