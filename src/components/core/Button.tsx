import { iptcColors } from 'styles/index';
import React, { Component } from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
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
    contentStyle?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>;
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
            height: 42,
            justifyContent: 'center',
            // borderRadius: 4,
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
                labelStyle={{
                    color: modeType === 'gray' ? '#32325D' : 'white',
                    fontFamily: bold ? 'Gelion-Bold' : 'Gelion-Regular',
                    fontSize: 15,
                    lineHeight: 17.58,
                    ...(this.props.labelStyle as any),
                }}
            >
                {children}
            </RNPButton>
        );
    }
}
