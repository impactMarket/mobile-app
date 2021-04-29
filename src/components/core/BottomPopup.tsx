import CloseStorySvg from 'components/svg/CloseStorySvg';
import React, { ReactElement } from 'react';
import {
    GestureResponderEvent,
    View,
    TextStyle,
    StyleProp,
} from 'react-native';
import { BottomSheet } from 'react-native-btr';
import { Headline } from 'react-native-paper';

import i18n from '../../assets/i18n';
import Card from './Card';

interface IBottomPopupProps {
    children: ReactElement;
    isVisible: boolean;
    hasCloseBtn?: boolean;
    title?: string;
    titleStyle?: StyleProp<TextStyle>;
    setIsVisible?: (event: GestureResponderEvent) => void;
}
export default class BottomPopup extends React.Component<
    IBottomPopupProps,
    object
> {
    constructor(props: any) {
        super(props);
    }

    render() {
        const {
            children,
            isVisible,
            setIsVisible,
            title,
            titleStyle,
            hasCloseBtn,
        } = this.props;
        return (
            <BottomSheet
                visible={isVisible}
                onBackButtonPress={setIsVisible}
                onBackdropPress={setIsVisible}
            >
                <Card
                    style={{
                        borderBottomEndRadius: 0,
                        borderBottomStartRadius: 0,
                    }}
                >
                    <Card.Content>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}
                        >
                            {title && (
                                <Headline
                                    style={
                                        titleStyle
                                            ? [
                                                  {
                                                      fontWeight: '800',
                                                      fontFamily:
                                                          'Manrope-Bold',
                                                  },
                                                  titleStyle,
                                              ]
                                            : {
                                                  fontWeight: '500',
                                                  textAlign: 'center',
                                                  fontFamily: 'Manrope-Bold',
                                              }
                                    }
                                >
                                    {i18n.t(title)}
                                </Headline>
                            )}
                            {hasCloseBtn && (
                                <CloseStorySvg
                                    onPress={() => setIsVisible(!isVisible)}
                                />
                            )}
                        </View>
                        <View
                            style={{
                                alignItems: 'center',
                                marginTop: 20,
                                marginBottom: 10,
                            }}
                        >
                            {children}
                        </View>
                    </Card.Content>
                </Card>
            </BottomSheet>
        );
    }
}
