import React, { Component } from 'react';
import {
    TextInput,
    Text,
    TextInputProps,
    View,
    StyleSheet,
    GestureResponderEvent,
    TouchableWithoutFeedback,
} from 'react-native';
import { ipctColors } from 'styles/index';

interface IInputProps extends TextInputProps {
    label?: string;
    help?: boolean;
    isBig?: boolean;
    onPress?: (event: GestureResponderEvent) => void;
}
export default class Input extends Component<IInputProps, object> {
    constructor(props: any) {
        super(props);
    }

    render() {
        const {
            label,
            help,
            onPress,
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
                        height: isBig ? 200 : 48,
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
                        {label}{' '}
                        {help && (
                            <TouchableWithoutFeedback
                                onPress={onPress}
                                style={{ width: 50, height: 30 }}
                            >
                                <Text style={{ color: ipctColors.blueRibbon }}>
                                    [?]
                                </Text>
                            </TouchableWithoutFeedback>
                        )}
                    </Text>
                    <TextInput
                        style={styles.textInput}
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
        paddingTop: 16,
        paddingBottom: 12,
        borderRadius: 6,
        borderWidth: 0.5,
        borderColor: ipctColors.borderGray,
    },
    textInput: {
        flexGrow: 1,
        alignSelf: 'center',
        textAlignVertical: 'top',
        zIndex: 1,
        fontSize: 15,
        fontFamily: 'Inter-Regular',
        color: ipctColors.almostBlack,
        justifyContent: 'flex-start',
    },
    label: {
        position: 'absolute',
        fontFamily: 'Inter-Regular',
        left: 12,
        top: -8,
        paddingHorizontal: 4,
        color: ipctColors.regentGray,
        backgroundColor: '#FFFFFF',
        zIndex: 1,
        fontWeight: '500',
        fontSize: 12,
        lineHeight: 14,
    },
});
