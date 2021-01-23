import React, { Component } from 'react';
import { TextInput, TextInputProps, View } from 'react-native';
import { Paragraph } from 'react-native-paper';
import { iptcColors } from 'styles/index';

interface IInputProps extends TextInputProps {
    label: string;
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
            style,
        } = this.props;
        return (
            <View style={style}>
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
                <TextInput
                    style={{
                        backgroundColor:
                            editable === undefined || editable
                                ? 'rgba(206, 212, 218, 0.27)'
                                : 'white',
                        borderRadius: 6,
                        fontSize: 20,
                        lineHeight: 24,
                        color: iptcColors.almostBlack,
                        paddingVertical:
                            editable === undefined || editable ? 9 : 2,
                        paddingHorizontal:
                            editable === undefined || editable ? 14 : 0,
                        // marginBottom: 8,
                    }}
                    value={value}
                    maxLength={maxLength}
                    onEndEditing={onEndEditing}
                    onChangeText={onChangeText}
                    editable={editable}
                />
            </View>
        );
    }
}
