import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    AsyncStorage
} from 'react-native';
import {
    connect,
    ConnectedProps
} from 'react-redux';
import {
    IRootState
} from '../../helpers/types';
import SvgQRCode from 'react-native-qrcode-svg';
import {
    Headline,
    Subheading,
    Card,
    Avatar
} from 'react-native-paper';
import { getCountryFromPhoneNumber, getUserAvatar } from '../../helpers';
import Api from '../../services/api';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import i18n from '../../assets/i18n';
import ModalScanQR from './ModalScanQR';
import { setAppPaymentToAction } from '../../helpers/redux/actions/ReduxActions';


const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};
const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>

function UserShowScanQRScreen(props: PropsFromRedux) {
    const navigation = useNavigation();
    const [name, setName] = useState('');

    useEffect(() => {
        Api.getUser(props.user.celoInfo.address).then((user) => {
            if (user !== undefined) {
                if (user.username !== null) {
                    setName(user.username);
                }
            }
        });
    });

    const handleModalScanQR = async (inputAddress: string) => {
        props.dispatch(setAppPaymentToAction(inputAddress));
        navigation.goBack();
    }

    return (
        <>
            <Header
                title={i18n.t('yourQRCode')}
                navigation={navigation}
                hasBack={true}
            />
            <ScrollView>
                <Headline style={styles.headingSubHeading}>
                    {i18n.t('scanToPay')}
                </Headline>
                <Subheading style={styles.headingSubHeading}>
                    {i18n.t('showQRToScan')}
                </Subheading>
                <Card elevation={8} style={styles.card}>
                    <Card.Content>
                        <View style={styles.cardHeadView}>
                            <View style={styles.nameCountry}>
                                <Subheading>{name}</Subheading>
                                <Subheading style={{ color: 'grey' }}>
                                    {getCountryFromPhoneNumber(props.user.celoInfo.phoneNumber)}
                                </Subheading>
                            </View>
                            <Avatar.Image
                                style={styles.avatar}
                                size={58}
                                source={getUserAvatar(props.user.user, true)}
                            />
                        </View>
                        <View style={styles.qrView}>
                            <SvgQRCode
                                value={props.user.celoInfo.address}
                                size={200}
                            />
                        </View>
                        <ModalScanQR
                            buttonText={i18n.t('scanToPay')}
                            callback={handleModalScanQR}
                        />
                    </Card.Content>
                </Card>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    nameCountry: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start'
    },
    headingSubHeading: {
        paddingHorizontal: 20,
    },
    card: {
        margin: 20
    },
    cardHeadView: {
        flex: 1,
        flexDirection: 'row'
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

export default connector(UserShowScanQRScreen);