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
    onPress?: (event: GestureResponderEvent) => void;
}
export default class Select extends Component<ISelectProps, object> {
    constructor(props: any) {
        super(props);
    }

    render() {
        const { label, value, onPress } = this.props;
        return (
            <View
                style={{
                    width: '100%',
                    height: 48,
                }}
            >
                <Text
                    style={[
                        styles.label,
                        {
                            backgroundColor: label ? '#FFFFFF' : 'transparent',
                        },
                    ]}
                >
                    {label}
                </Text>
                <TouchableWithoutFeedback onPress={onPress}>
                    <View style={styles.outline}>
                        <Text style={styles.textInput}>{value}</Text>
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
                                fill="#172B4D"
                            />
                        </Svg>
                    </View>
                </TouchableWithoutFeedback>
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
        borderRadius: 6,
        borderWidth: 0.5,
        borderColor: ipctColors.borderGray,
    },
    //TODO: add font inter
    textInput: {
        flexGrow: 1,
        marginTop: 12,
        zIndex: 1,
        fontSize: 15,
        fontFamily: 'Inter-Regular',
        lineHeight: 24,
        color: ipctColors.almostBlack,
    },
    label: {
        position: 'absolute',
        left: 12,
        top: -8,
        paddingHorizontal: 4,
        color: ipctColors.regentGray,
        backgroundColor: '#FFFFFF',
        zIndex: 1,
        fontWeight: '400',
        fontSize: 17,
        lineHeight: 17,
        letterSpacing: 0.245455,
    },
});
