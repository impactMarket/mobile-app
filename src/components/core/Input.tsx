import React, { Component } from 'react';
import {
    TextInput,
    Text,
    TextInputProps,
    View,
    StyleSheet,
    GestureResponderEvent,
    TouchableWithoutFeedback,
    StyleProp,
    ViewStyle,
} from 'react-native';
import { ipctColors } from 'styles/index';

interface IInputProps extends TextInputProps {
    label?: string;
    help?: boolean;
    isBig?: boolean;
    onPress?: (event: GestureResponderEvent) => void;
    boxStyle?: StyleProp<ViewStyle>;
    error?: string;
}
export default class Input extends Component<IInputProps, object> {
    constructor(props: any) {
        super(props);
    }

    render() {
        const { label, help, onPress, error } = this.props;

        return (
            <View style={this.props.boxStyle}>
                <View
                    style={[
                        styles.outline,
                        {
                            borderColor: error
                                ? '#EB5757'
                                : ipctColors.borderGray,
                        },
                    ]}
                />
                <Text
                    style={[
                        styles.label,
                        {
                            backgroundColor: label ? '#FFFFFF' : 'transparent',
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
                    {...this.props}
                    style={{
                        height: this.props.multiline ? 115 : undefined, // TODO: edit this once we need different sizes
                        minHeight: 38,
                        flexGrow: 1,
                        width: '100%',
                        paddingHorizontal: 10,
                        marginVertical: 5,
                        alignSelf: 'center',
                        zIndex: 1,
                        fontSize: 15,
                        fontFamily: 'Inter-Regular',
                        color: ipctColors.almostBlack,
                    }}
                />
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
