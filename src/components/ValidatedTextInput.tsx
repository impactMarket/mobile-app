import React, { Component } from 'react';
import {
    StyleSheet,
    // TextInput,
    TextInputProperties,
    NativeSyntheticEvent,
    TextInputEndEditingEventData,
    View,
} from 'react-native';
import { Paragraph, TextInput } from 'react-native-paper';

interface IStyledTextInputProps extends TextInputProperties {
    label: string;
    required?: boolean;
    isValid?: boolean;
    setValid?: (valid: boolean) => void;
    whenEndEditing?: (
        e: NativeSyntheticEvent<TextInputEndEditingEventData>
    ) => void;
    marginBox?: number;
}
interface IStyledTextInputState {
    valid: boolean;
}

export default class ValidatedTextInput extends Component<
    IStyledTextInputProps,
    IStyledTextInputState
> {
    constructor(props: any) {
        super(props);
        this.state = {
            valid: true,
        };
    }

    handleEndEditing = (
        e: NativeSyntheticEvent<TextInputEndEditingEventData>
    ) => {
        if (this.props.setValid !== undefined) {
            const valid = !(
                this.props.required && e.nativeEvent.text.length === 0
            );
            this.props.setValid(valid);
            this.setState({ valid });
        }
        e.preventDefault();
    };

    render() {
        const { valid } = this.state;
        return (
            <View style={{ margin: this.props.marginBox }}>
                <TextInput
                    mode="flat"
                    underlineColor="transparent"
                    style={styles.inputTextField}
                    onEndEditing={
                        this.props.whenEndEditing !== undefined
                            ? this.props.whenEndEditing
                            : this.handleEndEditing
                    }
                    {...this.props}
                />
                {!valid ||
                    ((this.props.isValid !== undefined
                        ? !this.props.isValid
                        : false) && (
                        <Paragraph style={styles.inputTextNotValid}>
                            Not Valid!
                        </Paragraph>
                    ))}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    inputTextFieldLabel: {
        color: 'grey',
        fontFamily: 'Gelion-Thin',
    },
    inputTextField: {
        fontFamily: 'Gelion-Regular',
        backgroundColor: 'transparent',
        paddingHorizontal: 0,
    },
    inputTextNotValid: {
        fontFamily: 'Gelion-Regular',
        color: 'red',
    },
});
