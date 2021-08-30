import React, { Component } from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Button as RNPButton } from 'react-native-paper';
import { ipctColors } from 'styles/index';

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
    accessibilityLabel?: string;
}
interface IButtonState {}

export default class Button extends Component<IButtonProps, IButtonState> {
    render() {
        const {
            style,
            disabled,
            children,
            modeType,
            bold,
            icon,
            accessibilityLabel,
        } = this.props;
        let buttonStyle: StyleProp<ViewStyle> = {
            elevation: 0,
            height: 44,
            justifyContent: 'center',
            // borderRadius: 4,
        };
        if (!disabled) {
            if (modeType === 'green') {
                buttonStyle = {
                    ...buttonStyle,
                    backgroundColor: ipctColors.greenishTeal,
                };
            } else if (modeType === 'gray') {
                buttonStyle = {
                    ...buttonStyle,
                    backgroundColor: ipctColors.softGray,
                };
            } else if (modeType === 'default') {
                buttonStyle = {
                    ...buttonStyle,
                    backgroundColor: ipctColors.blueRibbon,
                };
            } else {
                buttonStyle = {
                    ...buttonStyle,
                    backgroundColor: ipctColors.blueRibbon,
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
                icon={icon}
                {...this.props}
                style={buttonStyle}
                labelStyle={{
                    color: modeType === 'gray' ? '#32325D' : 'white',
                    fontFamily: bold ? 'Inter-Bold' : 'Inter-Regular',
                    fontSize: 15,
                    lineHeight: 17.58,
                    ...(this.props.labelStyle as any),
                }}
                accessibilityLabel={accessibilityLabel}
            >
                {children}
            </RNPButton>
        );
    }
}
