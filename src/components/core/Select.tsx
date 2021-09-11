import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    GestureResponderEvent,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ipctColors } from 'styles/index';

interface ISelectProps {
    label?: string;
    value: string;
    help?: boolean;
    onHelpPress?: (event: GestureResponderEvent) => void;
    onPress?: (event: GestureResponderEvent) => void;
    error?: string;
    testID?: string;
}
export default class Select extends Component<ISelectProps, object> {
    render() {
        const {
            label,
            value,
            help,
            onPress,
            onHelpPress,
            error,
            testID,
        } = this.props;
        return (
            <>
                <View
                    style={{
                        width: '100%',
                        height: 48,
                    }}
                    testID={testID}
                    accessibilityLabel={label}
                >
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
                                onPress={onHelpPress}
                                style={{ width: 70, height: 40 }}
                            >
                                <Text style={{ color: ipctColors.blueRibbon }}>
                                    [?]
                                </Text>
                            </TouchableWithoutFeedback>
                        )}
                    </Text>
                    <TouchableWithoutFeedback onPress={onPress}>
                        <View
                            style={[
                                styles.outline,
                                {
                                    borderColor: error
                                        ? '#EB5757'
                                        : ipctColors.borderGray,
                                },
                            ]}
                        >
                            <Text
                                style={styles.textInput}
                                testID="selected-value"
                            >
                                {value}
                            </Text>
                            <Svg
                                width={14}
                                height={9}
                                viewBox="0 0 14 9"
                                fill="none"
                                style={{ alignSelf: 'center' }}
                            >
                                <Path
                                    opacity={0.833}
                                    d="M6.997 5.812L11.861.717a.69.69 0 011.005 0l.426.447c.134.14.208.327.208.527s-.074.386-.208.526l-5.79 6.066a.69.69 0 01-.504.217.69.69 0 01-.505-.217L.708 2.223A.757.757 0 01.5 1.696c0-.2.074-.386.208-.527l.426-.446a.69.69 0 011.005 0l4.858 5.089z"
                                    fill="#73839D"
                                />
                            </Svg>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                {error && (
                    <Text
                        style={{
                            color: '#EB5757',
                            fontSize: 12,
                            lineHeight: 20,
                            fontFamily: 'Inter-Regular',
                            justifyContent: 'flex-start',
                        }}
                    >
                        {error}
                    </Text>
                )}
            </>
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
        // paddingTop: 6,
        // paddingBottom: 6,
        borderRadius: 6,
        borderWidth: 0.5,
    },
    textInput: {
        flexGrow: 1,
        alignSelf: 'center',
        zIndex: 1,
        fontSize: 15,
        fontFamily: 'Inter-Regular',
        color: ipctColors.almostBlack,
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
