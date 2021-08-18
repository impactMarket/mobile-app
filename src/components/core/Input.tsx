import LockSvg from 'components/svg/LockSvg';
import React, { Component } from 'react';
import {
    TextInput,
    Text,
    TextInputProps,
    View,
    StyleSheet,
    GestureResponderEvent,
    Pressable,
    StyleProp,
    ViewStyle,
} from 'react-native';
import { ipctColors } from 'styles/index';

interface IInputProps extends TextInputProps {
    label?: string;
    help?: boolean;
    isBig?: boolean;
    rightIcon?: JSX.Element;
    onPress?: (event: GestureResponderEvent) => void;
    boxStyle?: StyleProp<ViewStyle>;
    error?: string;
}
export default class Input extends Component<IInputProps, object> {
    constructor(props: any) {
        super(props);
    }

    render() {
        const { label, help, onPress, error, rightIcon } = this.props;

        return (
            <>
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
                    <View
                        style={[
                            styles.label,
                            {
                                alignItems: 'center',
                                flexDirection: 'row',
                            },
                        ]}
                    >
                        <Text
                            style={{
                                fontFamily: 'Inter-Regular',
                                color: ipctColors.regentGray,
                                fontWeight: '500',
                                fontSize: 12,
                                lineHeight: 14,
                            }}
                        >
                            {label}
                        </Text>
                        {help && (
                            <Pressable onPress={onPress} hitSlop={20}>
                                <Text
                                    style={{
                                        color: ipctColors.blueRibbon,
                                        fontSize: 12,
                                        paddingLeft: 3,
                                    }}
                                >
                                    [?]
                                </Text>
                            </Pressable>
                        )}
                    </View>
                    <View style={styles.innerInput}>
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
                                textAlignVertical: this.props.multiline
                                    ? 'top'
                                    : undefined,
                            }}
                        />
                        {rightIcon}
                    </View>
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
    innerInput: {
        flexDirection: 'row',
        alignItems: 'center',
    },
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
        left: 12,
        top: -8,
        paddingHorizontal: 4,
        backgroundColor: '#FFFFFF',
        zIndex: 1,
    },
});
