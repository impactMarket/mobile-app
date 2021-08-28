import { NavigationState, NavigationProp } from '@react-navigation/native';
import i18n from 'assets/i18n';
import { IRootState } from 'helpers/types/state';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { BottomSheet } from 'react-native-btr';
import { Appbar, Headline } from 'react-native-paper';
import SvgQRCode from 'react-native-qrcode-svg';
import { connect, ConnectedProps } from 'react-redux';

import Card from './core/Card';

const mapStateToProps = (state: IRootState) => {
    const { user } = state;
    return { user };
};
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

interface IHeaderProps {
    title: string;
    hasHelp?: boolean;
    hasBack?: boolean;
    hasQr?: boolean;
    hasShare?: boolean;
    navigation: NavigationProp<
        Record<string, object | undefined>,
        string,
        NavigationState,
        object,
        Record<string, { data?: any; canPreventDefault?: boolean | undefined }>
    >;
    // just a little annoying lint bug because of mapped redux props
    children?: any;
}
interface IHeaderState {
    openQR: boolean;
}

class Header extends Component<PropsFromRedux & IHeaderProps, IHeaderState> {
    constructor(props: any) {
        super(props);
        this.state = {
            openQR: false,
        };
    }

    toggleQR = () =>
        this.setState((previousState) => ({ openQR: !previousState.openQR }));

    render() {
        const {
            children,
            navigation,
            hasHelp,
            hasBack,
            hasQr,
            hasShare,
            title,
        } = this.props;
        const { openQR } = this.state;

        let appBarContent;
        if (children === undefined) {
            appBarContent = (
                <>
                    {hasHelp && (
                        <Appbar.Action
                            icon="help"
                            style={styles.appbarIcon}
                            onPress={() => navigation.navigate('FAQScreen')}
                        />
                    )}
                    {hasQr && (
                        <Appbar.Action
                            icon="qrcode"
                            style={styles.appbarIcon}
                            onPress={() => this.setState({ openQR: true })}
                        />
                    )}
                    {hasShare && (
                        <Appbar.Action icon="share" style={styles.appbarIcon} />
                    )}
                </>
            );
        } else {
            appBarContent = children;
        }
        return (
            <>
                <Appbar.Header style={styles.appbar}>
                    {hasBack && (
                        <Appbar.Action
                            icon="chevron-left"
                            style={styles.appbarIcon}
                            onPress={() => navigation.goBack()}
                        />
                    )}
                    <Appbar.Content
                        title={title}
                        titleStyle={{
                            fontFamily: 'Gelion-Bold',
                            fontSize: 30,
                            lineHeight: 36,
                            color: '#1E3252',
                        }}
                    />
                    {appBarContent}
                </Appbar.Header>
                <BottomSheet
                    visible={openQR}
                    onBackButtonPress={this.toggleQR}
                    onBackdropPress={this.toggleQR}
                >
                    <Card
                        style={{
                            borderBottomEndRadius: 0,
                            borderBottomStartRadius: 0,
                        }}
                    >
                        <Card.Content>
                            <Headline style={{ textAlign: 'center' }}>
                                {i18n.t('generic.yourQRCode')}
                            </Headline>
                            <View style={styles.qrView}>
                                <SvgQRCode
                                    value={this.props.user.wallet.address}
                                    size={200}
                                />
                            </View>
                        </Card.Content>
                    </Card>
                </BottomSheet>
            </>
        );
    }
}

const styles = StyleSheet.create({
    appbar: {
        backgroundColor: 'transparent',
    },
    appbarIcon: {
        backgroundColor: '#eaedf0',
    },
    qrView: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
});

export default connector(Header);
