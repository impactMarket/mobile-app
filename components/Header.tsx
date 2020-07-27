import React, { Component } from 'react';
import {
    StyleSheet, View,
} from 'react-native';
import {
    Appbar,
    Text,
    Card,
    Subheading,
    Avatar,
    Headline,
} from 'react-native-paper';
import { NavigationState, NavigationProp } from '@react-navigation/native';
import { BottomSheet } from 'react-native-btr';
import { getUserAvatar, iptcColors } from '../helpers';
import ModalScanQR from '../views/common/ModalScanQR';
import i18n from '../assets/i18n';
import SvgQRCode from 'react-native-qrcode-svg';
import { IRootState } from '../helpers/types';
import { connect, ConnectedProps } from 'react-redux';
import { setAppPaymentToAction } from '../helpers/redux/actions/ReduxActions';


const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};
const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>

interface IHeaderProps {
    title: string;
    hasHelp?: boolean;
    hasBack?: boolean;
    hasQr?: boolean;
    hasShare?: boolean;
    navigation: NavigationProp<Record<string, object | undefined>, string, NavigationState, {}, {}>
}
interface IHeaderState {
    openQR: boolean;
}

class Header extends Component<PropsFromRedux & IHeaderProps, IHeaderState> {
    constructor(props: any) {
        super(props);
        this.state = {
            openQR: false,
        }
    }

    toggleQR = () => this.setState({ openQR: !this.state.openQR })

    handleModalScanQR = async (inputAddress: string) => {
        this.props.dispatch(setAppPaymentToAction(inputAddress));
        this.setState({ openQR: false });
    }

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
            appBarContent = <>
                {hasHelp && <Appbar.Action
                    icon="help"
                    style={styles.appbarIcon}
                    onPress={() => navigation.navigate('FAQScreen')}
                />}
                {hasQr && <Appbar.Action
                    icon="qrcode"
                    style={styles.appbarIcon}
                    onPress={() => this.setState({ openQR: true })}
                />}
                {hasShare && <Appbar.Action
                    icon="share"
                    style={styles.appbarIcon}
                />}
            </>
        } else {
            appBarContent = children;
        }
        return <>
            <Appbar.Header style={styles.appbar}>
                {hasBack && <Appbar.Action
                    icon="chevron-left"
                    style={styles.appbarIcon}
                    onPress={() => navigation.goBack()}
                />}
                <Appbar.Content title={title} />
                {appBarContent}
            </Appbar.Header>
            <BottomSheet
                visible={openQR}
                onBackButtonPress={this.toggleQR}
                onBackdropPress={this.toggleQR}
            >
                <Card elevation={8} style={styles.card}>
                    <Card.Content>
                        <View style={styles.cardHeadView}>
                            <View style={styles.nameCountry}>
                                <Headline style={styles.headingSubHeading}>
                                    {i18n.t('scanToPay')}
                                </Headline>
                                <Subheading style={styles.headingSubHeading}>
                                    {i18n.t('showQRToScan')}
                                </Subheading>
                            </View>
                            {/* <Avatar.Image
                                style={styles.avatar}
                                size={58}
                                source={getUserAvatar(this.props.user.user, true)}
                            /> */}
                        </View>
                        <View style={styles.qrView}>
                            <SvgQRCode
                                value={this.props.user.celoInfo.address}
                                size={200}
                            />
                        </View>
                        <ModalScanQR
                            buttonText={i18n.t('scanToPay')}
                            buttonStyle={{ backgroundColor: iptcColors.greenishTeal }}
                            callback={this.handleModalScanQR}
                        />
                    </Card.Content>
                </Card>
            </BottomSheet>
        </>
    }
}

const styles = StyleSheet.create({
    appbar: {
        backgroundColor: 'transparent',
    },
    appbarIcon: {
        backgroundColor: '#eaedf0'
    },
    nameCountry: {
        // flex: 1,
        // flexDirection: 'column',
        // alignItems: 'flex-start'
    },
    headingSubHeading: {
        paddingHorizontal: 20,
    },
    card: {
        // height: 500,
    },
    cardHeadView: {
        // flex: 1,
        // flexDirection: 'row'
    },
    avatar: {
        alignSelf: 'center',
        marginLeft: 'auto'
    },
    qrView: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
    }
});

export default connector(Header);