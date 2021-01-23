import React, { Component } from 'react';
import {
    GestureResponderEvent,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { Paragraph, Text } from 'react-native-paper';
import Svg, { Path } from 'react-native-svg';
import { iptcColors } from 'styles/index';

interface ISelectProps {
    label: string;
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
            <View style={{ flexDirection: 'column' }}>
                <Paragraph
                    style={{
                        fontSize: 17,
                        lineHeight: 17,
                        letterSpacing: 0.245455,
                        color: iptcColors.textGray,
                        marginBottom: 10,
                    }}
                >
                    {label}
                </Paragraph>
                <TouchableWithoutFeedback onPress={onPress}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingVertical: 8,
                            paddingHorizontal: 15,
                            elevation: 0,
                            height: 46,
                            backgroundColor: 'rgba(206,212,218,0.27)',
                            borderRadius: 6,
                        }}
                    >
                        <Text
                            style={{
                                color: iptcColors.almostBlack,
                                opacity: 1,
                                fontSize: 20,
                                lineHeight: 24,
                                textAlignVertical: 'center',
                            }}
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
                                fill="#172B4D"
                            />
                        </Svg>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}
