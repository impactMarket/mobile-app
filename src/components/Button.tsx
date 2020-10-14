import { iptcColors } from 'helpers/index';
import React, { Component } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Button as RNPButton, Text } from 'react-native-paper';

interface IButtonProps {
    modeType: 'green' | 'gray' | 'default';
    bold?: boolean;
    icon?: string;
    children?: any;
    loading?: boolean;
    disabled?: boolean;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
}
interface IButtonState {}

export default class Button extends Component<IButtonProps, IButtonState> {
    constructor(props: any) {
        super(props);
    }

    render() {
        const { style, disabled, children, modeType, bold } = this.props;
        let buttonStyle: StyleProp<ViewStyle> = {
            elevation: 0,
            borderRadius: 4,
        };
        if (!disabled) {
            if (modeType === 'green') {
                buttonStyle = {
                    ...buttonStyle,
                    backgroundColor: iptcColors.greenishTeal,
                };
            } else if (modeType === 'gray') {
                buttonStyle = {
                    ...buttonStyle,
                    backgroundColor: iptcColors.softGray,
                };
            } else {
                buttonStyle = {
                    ...buttonStyle,
                    backgroundColor: iptcColors.softBlue,
                };
            }
        }
        if (this.props.style) {
            buttonStyle = { ...buttonStyle, ...(style as any) };
        }
        return (
            <RNPButton
                mode="contained"
                uppercase={false}
                {...this.props}
                style={buttonStyle}
            >
                <Text
                    style={{
                        color: modeType === 'gray' ? '#32325D' : 'white',
                        fontWeight: bold ? 'bold' : 'normal',
                        fontSize: 15,
                        lineHeight: 18,
                    }}
                >
                    {children}
                </Text>
            </RNPButton>
        );
    }
}
