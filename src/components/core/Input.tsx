import React, { Component } from 'react';
import {
    TextInput,
    Text,
    TextInputProps,
    View,
    StyleSheet,
} from 'react-native';
import { ipctColors } from 'styles/index';

interface IInputProps extends TextInputProps {
    label?: string;
    isBig?: boolean;
}
export default class Input extends Component<IInputProps, object> {
    constructor(props: any) {
        super(props);
    }

    render() {
        const {
            label,
            value,
            maxLength,
            onEndEditing,
            onChangeText,
            editable,
            placeholder,
            isBig,
            style,
            multiline,
            numberOfLines,
            keyboardType,
        } = this.props;

        return (
            <View
                style={[
                    style,
                    {
                        width: '100%',
                        height: 48,
                    },
                ]}
            >
                <View style={styles.outline}>
                    <Text
                        style={[
                            styles.label,
                            {
                                backgroundColor: label
                                    ? '#FFFFFF'
                                    : 'transparent',
                            },
                        ]}
                    >
                        {label}
                    </Text>
                    <TextInput
                        style={
                            value
                                ? styles.textInput
                                : [
                                      styles.textInput,
                                      {
                                          marginTop: 8,
                                      },
                                  ]
                        }
                        value={value}
                        maxLength={maxLength}
                        onEndEditing={onEndEditing}
                        onChangeText={onChangeText}
                        keyboardType={keyboardType}
                        editable={editable}
                        multiline={multiline}
                        numberOfLines={numberOfLines}
                        placeholder={placeholder}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    outline: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingBottom: 12,
        borderRadius: 6,
        borderWidth: 0.5,
        borderColor: ipctColors.borderGray,
    },
    textInput: {
        flexGrow: 1,
        zIndex: 1,
        fontSize: 15,
        fontFamily: 'Inter-Regular',
        lineHeight: 24,
        color: ipctColors.almostBlack,
    },
    label: {
        position: 'absolute',
        fontFamily: 'Inter-Regular',
        left: 12,
        top: -12,
        paddingHorizontal: 4,
        color: ipctColors.regentGray,
        backgroundColor: '#FFFFFF',
        zIndex: 1,
        fontWeight: '500',
        fontSize: 12,
        lineHeight: 20,
    },
});
