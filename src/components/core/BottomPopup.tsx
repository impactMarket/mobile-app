import React, { ReactElement } from 'react';
import { GestureResponderEvent, View } from 'react-native';
import { BottomSheet } from 'react-native-btr';
import Card from './Card';
import { Headline } from 'react-native-paper';
import i18n from '../../assets/i18n';

interface IBottomPopupProps {
    children: ReactElement;
    isVisible: boolean;
    title?: string;
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
        const { children, isVisible, setIsVisible, title } = this.props;
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
                        {title && (
                            <Headline style={{ textAlign: 'center' }}>
                                {i18n.t(title)}
                            </Headline>
                        )}
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
