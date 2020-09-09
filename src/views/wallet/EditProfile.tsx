import { useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import Header from 'components/Header';
import ValidatedTextInput from 'components/ValidatedTextInput';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { getCountryFromPhoneNumber, getUserAvatar } from 'helpers/index';
import {
    resetUserApp,
    resetNetworkContractsApp,
    setUserInfo,
    setUserExchangeRate,
} from 'helpers/redux/actions/ReduxActions';
import { IRootState, STORAGE_USER_FIRST_TIME } from 'helpers/types';
import React, { useState, useEffect } from 'react';
import { AsyncStorage, StyleSheet, View, Picker } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
    Button,
    Avatar,
    TextInput,
    Paragraph,
    Portal,
    Dialog,
    RadioButton,
    Text,
} from 'react-native-paper';
import { connect, ConnectedProps } from 'react-redux';
import Api from 'services/api';

interface IEditProfileProps {
    EditProfileCallback: () => void;
}
const mapStateToProps = (state: IRootState) => {
    const { user, network } = state;
    return { user, network };
};
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & IEditProfileProps;

function EditProfile(props: Props) {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [currency, setCurrency] = useState('usd');
    const [isDialogCurrencyOpen, setIsDialogCurrencyOpen] = useState(false);

    useEffect(() => {
        setName(props.user.user.name);
        setCurrency(props.user.user.currency);
    }, []);

    const handleLogout = async () => {
        await AsyncStorage.clear();
        await AsyncStorage.setItem(STORAGE_USER_FIRST_TIME, 'false');
        props.dispatch(resetUserApp());
        props.dispatch(resetNetworkContractsApp());
        navigation.goBack();
    };

    const handleChangeCurrency = async (text: string) => {
        setCurrency(text);
        Api.setUserCurrency(props.user.celoInfo.address, text);
        props.dispatch(setUserInfo({ ...props.user.user, currency: text }));
        // update exchange rate!
        const exchangeRate = await Api.getExchangeRate(
            props.user.user.currency.toUpperCase()
        );
        props.dispatch(setUserExchangeRate(exchangeRate));
    };

    return (
        <>
            <Header
                title={i18n.t('editProfile')}
                hasBack
                navigation={navigation}
            />
            <ScrollView style={styles.scrollView}>
                <View style={styles.container}>
                    <Avatar.Image
                        style={{
                            alignSelf: 'center',
                            marginVertical: 20,
                        }}
                        size={121}
                        source={getUserAvatar(props.user.user, true)}
                    />
                    <Button mode="contained" disabled>
                        {i18n.t('changePhoto')}
                    </Button>
                    <ValidatedTextInput
                        label={i18n.t('name')}
                        value={name}
                        maxLength={32}
                        required
                        onEndEditing={(e) => {
                            Api.setUsername(props.user.celoInfo.address, name);
                            props.dispatch(
                                setUserInfo({ ...props.user.user, name })
                            );
                        }}
                        onChangeText={(value) => setName(value)}
                    />
                    <Paragraph style={styles.inputTextFieldLabel}>
                        {i18n.t('currency')}
                    </Paragraph>
                    <Button
                        mode="contained"
                        style={{
                            marginVertical: 3,
                            backgroundColor: 'rgba(206,212,218,0.27)',
                        }}
                        onPress={() => setIsDialogCurrencyOpen(true)}
                    >
                        <Text style={{ color: 'black', opacity: 1 }}>
                            {currency === 'usd' ? 'Dollar (USD)' : 'Euro (EUR)'}
                        </Text>
                    </Button>
                    <TextInput
                        label={i18n.t('country')}
                        style={{ marginVertical: 3 }}
                        value={getCountryFromPhoneNumber(
                            props.user.celoInfo.phoneNumber
                        )}
                        disabled
                    />
                    <TextInput
                        label={i18n.t('phoneNumber')}
                        style={{ marginVertical: 3 }}
                        value={props.user.celoInfo.phoneNumber}
                        disabled
                    />
                    <Button
                        mode="contained"
                        style={{ marginVertical: 20 }}
                        onPress={handleLogout}
                    >
                        {i18n.t('logout')}
                    </Button>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                        }}
                    >
                        <Paragraph>
                            Build: {Constants.manifest.version}
                        </Paragraph>
                        <Paragraph>OS version: {Device.osVersion}</Paragraph>
                    </View>
                </View>
            </ScrollView>
            <Portal>
                <Dialog
                    visible={isDialogCurrencyOpen}
                    onDismiss={() => setIsDialogCurrencyOpen(false)}
                >
                    <Dialog.Content>
                        <RadioButton.Group
                            onValueChange={(value) => {
                                setIsDialogCurrencyOpen(false);
                                handleChangeCurrency(value);
                            }}
                            value={currency}
                        >
                            <RadioButton.Item
                                label="Dollar (USD)"
                                value="usd"
                            />
                            <RadioButton.Item label="Euro (EUR)" value="eur" />
                        </RadioButton.Group>
                    </Dialog.Content>
                </Dialog>
            </Portal>
        </>
    );
}

const styles = StyleSheet.create({
    scrollView: {},
    container: {
        marginHorizontal: 20,
    },
    picker: {
        height: 50,
        width: '100%',
        fontFamily: 'Gelion-Regular',
    },
    pickerBorder: {
        marginVertical: 10,
        borderStyle: 'solid',
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 5,
    },
    inputTextFieldLabel: {
        color: 'grey',
        fontFamily: 'Gelion-Regular',
    },
});

export default connector(EditProfile);
