import Card from 'components/core/Card';
import CloseSvg from 'components/svg/CloseSvg';
import React, { Component, ReactNode } from 'react';
import {
    View,
    Keyboard,
    LayoutAnimation,
    Platform,
    Pressable,
    Text,
} from 'react-native';
import { Modal as ModalRNP } from 'react-native-paper';
import { ipctColors } from 'styles/index';

interface IModalProps {
    visible: boolean;
    onDismiss?: () => void;
    title: string;
    buttons?: ReactNode;
    children?: ReactNode;
}
interface IModalState {
    keyboardOpen: boolean;
    bottom: number;
}
export default class Modal extends Component<IModalProps, IModalState> {
    private keyboardShowListener: any;
    private keyboardHideListener: any;

    constructor(props: any) {
        super(props);
        this.state = {
            keyboardOpen: false,
            bottom: 0,
        };
    }

    componentDidMount() {
        this.keyboardShowListener = Keyboard.addListener(
            'keyboardWillShow',
            this.keyboardShow
        );
        this.keyboardHideListener = Keyboard.addListener(
            'keyboardWillHide',
            this.keyboardHide
        );
    }

    componentWillUnmount() {
        this.keyboardShowListener && this.keyboardShowListener.remove();
        this.keyboardHideListener && this.keyboardHideListener.remove();
    }

    keyboardShow = (e: any) => {
        LayoutAnimation.easeInEaseOut();
        this.setState({ keyboardOpen: true, bottom: e.endCoordinates.height });
    };

    keyboardHide = (_e: any) => {
        LayoutAnimation.easeInEaseOut();
        this.setState({ keyboardOpen: false, bottom: 0 });
    };

    render() {
        const { visible, onDismiss, title, buttons, children } = this.props;
        const { keyboardOpen, bottom } = this.state;

        // yeah, modals on iOS get hidden below the keyboard
        let cardModalStyle = {};
        if (Platform.OS === 'ios') {
            cardModalStyle = {
                ...cardModalStyle,
                position: 'absolute',
            };
            if (keyboardOpen) {
                cardModalStyle = {
                    ...cardModalStyle,
                    bottom: bottom - 255,
                };
            }
        }

        return (
            <ModalRNP
                visible={visible}
                dismissable={onDismiss !== undefined} // TODO: change to false and test all modals
                onDismiss={onDismiss}
            >
                <Card
                    style={{
                        marginHorizontal: 22,
                        ...cardModalStyle,
                    }}
                >
                    <Card.Content
                        style={{ paddingHorizontal: 22, paddingVertical: 16 }}
                    >
                        <View
                            style={{
                                height: 24,
                                marginTop: 4,
                                marginBottom: 19,
                            }}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'Manrope-ExtraBold',
                                        fontSize: 22,
                                        lineHeight: 28,
                                        height: 28,
                                        color: ipctColors.darBlue,
                                    }}
                                >
                                    {title}
                                </Text>
                                {onDismiss !== undefined && (
                                    <Pressable
                                        hitSlop={15}
                                        onPress={onDismiss}
                                        testID="close-modal"
                                    >
                                        <CloseSvg />
                                    </Pressable>
                                )}
                            </View>
                        </View>
                        {children}
                        {/* <View
                            style={{
                                height: 42
                            }}
                        >
                            <View
                                style={{
                                    flex: 2,
                                    flexDirection: 'row',
                                }}
                            >
                                {buttons}
                            </View>
                        </View> */}
                        {buttons}
                    </Card.Content>
                </Card>
            </ModalRNP>
        );
    }
}
