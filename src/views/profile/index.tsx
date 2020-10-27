import { useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import Card from 'components/Card';
import Header from 'components/Header';
import ValidatedTextInput from 'components/ValidatedTextInput';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { decrypt, encrypt } from 'helpers/encryption';
import {
    amountToCurrency,
    getCountryFromPhoneNumber,
    getCurrencySymbol,
    humanifyNumber,
    iptcColors,
} from 'helpers/index';
import {
    resetUserApp,
    resetNetworkContractsApp,
    setUserInfo,
    setUserExchangeRate,
    setUserIsBeneficiary,
    setUserIsCommunityManager,
    setUserLanguage,
} from 'helpers/redux/actions/ReduxActions';
import {
    CONSENT_ANALYTICS,
    IRootState,
    IStoreCombinedActionsTypes,
    IStoreCombinedState,
    STORAGE_USER_FIRST_TIME,
} from 'helpers/types';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { AsyncStorage, StyleSheet, View, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
    Button,
    TextInput,
    Paragraph,
    Portal,
    Dialog,
    RadioButton,
    Text,
    Switch,
    Headline,
} from 'react-native-paper';
import { useDispatch, useSelector, useStore } from 'react-redux';
import Api from 'services/api';
import Login from './Login';

function ProfileScreen() {
    const store = useStore<IStoreCombinedState, IStoreCombinedActionsTypes>();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const userAddress = useSelector(
        (state: IRootState) => state.user.celoInfo.address
    );

    const { user, app } = store.getState();
    const rates = app.exchangeRates;

    const [isConsentAnalytics, setIsConsentAnalytics] = React.useState(true);
    const [name, setName] = useState('');
    const [logingOut, setLogingOut] = useState(false);
    const [currency, setCurrency] = useState('usd');
    const [language, setLanguage] = useState('en');
    const [isDialogCurrencyOpen, setIsDialogCurrencyOpen] = useState(false);
    const [isDialogLanguageOpen, setIsDialogLanguageOpen] = useState(false);

    useEffect(() => {
        if (userAddress.length > 0) {
            if (user.user.name !== null && user.user.name.length > 0) {
                setName(decrypt(user.user.name));
            }
            setCurrency(user.user.currency);
            setLanguage(user.user.language);
            AsyncStorage.getItem(CONSENT_ANALYTICS).then((c) =>
                setIsConsentAnalytics(c === null || c === 'true' ? true : false)
            );
        }
    }, []);

    const onToggleSwitch = () => {
        AsyncStorage.setItem(CONSENT_ANALYTICS, `${!isConsentAnalytics}`);
        setIsConsentAnalytics(!isConsentAnalytics);
    };

    const handleLogout = async () => {
        setLogingOut(true);
        await AsyncStorage.clear();
        await AsyncStorage.setItem(STORAGE_USER_FIRST_TIME, 'false');
        const unsubscribe = store.subscribe(() => {
            const state = store.getState();
            if (
                state.user.celoInfo.address.length > 0 &&
                !state.user.community.isBeneficiary &&
                !state.user.community.isManager
            ) {
                unsubscribe();
                setLogingOut(false);
                // navigation.goBack();
                navigation.navigate('communities', { previous: 'profile' });
            }
        });
        store.dispatch(setUserIsBeneficiary(false));
        store.dispatch(setUserIsCommunityManager(false));
        store.dispatch(resetUserApp());
        store.dispatch(resetNetworkContractsApp());
    };

    const handleChangeCurrency = async (text: string) => {
        setCurrency(text);
        Api.setUserCurrency(user.celoInfo.address, text);
        dispatch(setUserInfo({ ...user.user, currency: text }));
        // update exchange rate!
        const exchangeRate = (rates as any)[text.toUpperCase()].rate;
        dispatch(setUserExchangeRate(exchangeRate));
    };

    const handleChangeLanguage = async (text: string) => {
        setLanguage(text);
        Api.setLanguage(user.celoInfo.address, text);
        dispatch(setUserLanguage(text));
        i18n.locale = text;
        moment.locale(text);
    };

    if (userAddress.length === 0) {
        return <Login />;
    }

    const userBalance = amountToCurrency(
        user.celoInfo.balance,
        user.user.currency,
        app.exchangeRates
    );

    return (
        <>
            <Header title={i18n.t('profile')} navigation={navigation} />
            <ScrollView style={styles.scrollView}>
                <View style={styles.container}>
                    <Card elevation={0} style={styles.card}>
                        <Card.Content>
                            <Text
                                style={{
                                    color: '#FFFFFF',
                                    textAlign: 'center',
                                }}
                            >
                                {i18n.t('balance').toUpperCase()}
                            </Text>
                            <View style={{ alignItems: 'center' }}>
                                <Headline
                                    style={{
                                        fontSize:
                                            userBalance.length > 6 ? 43 : 56,
                                        lineHeight:
                                            userBalance.length > 6 ? 43 : 56,
                                        ...styles.headlineBalance,
                                    }}
                                >
                                    {getCurrencySymbol(user.user.currency)}
                                    {userBalance}
                                </Headline>
                                <Text style={{ color: '#FFFFFF' }}>
                                    {humanifyNumber(user.celoInfo.balance)} cUSD
                                </Text>
                            </View>
                        </Card.Content>
                    </Card>
                    <ValidatedTextInput
                        label={i18n.t('name')}
                        value={name}
                        maxLength={32}
                        required
                        onEndEditing={(e) => {
                            let eName = '';
                            if (name.length > 0) {
                                eName = encrypt(name);
                            }
                            Api.setUsername(user.celoInfo.address, eName);
                            dispatch(
                                setUserInfo({ ...user.user, name: eName })
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
                            {currency}
                        </Text>
                    </Button>
                    <Paragraph style={styles.inputTextFieldLabel}>
                        {i18n.t('language')}
                    </Paragraph>
                    <Button
                        mode="contained"
                        style={{
                            marginVertical: 3,
                            backgroundColor: 'rgba(206,212,218,0.27)',
                        }}
                        onPress={() => setIsDialogLanguageOpen(true)}
                    >
                        <Text style={{ color: 'black', opacity: 1 }}>
                            {language === 'en' ? 'English' : ' Português'}
                        </Text>
                    </Button>
                    <TextInput
                        label={i18n.t('country')}
                        style={{ marginVertical: 3 }}
                        value={getCountryFromPhoneNumber(
                            user.celoInfo.phoneNumber
                        )}
                        disabled
                    />
                    <TextInput
                        label={i18n.t('phoneNumber')}
                        style={{ marginVertical: 3 }}
                        value={user.celoInfo.phoneNumber}
                        disabled
                    />
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginVertical: 10,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 15,
                                paddingVertical: 5,
                            }}
                        >
                            {i18n.t('consentAnonymousAnalytics')}
                        </Text>
                        <Switch
                            value={isConsentAnalytics}
                            onValueChange={onToggleSwitch}
                        />
                    </View>
                    <Button
                        mode="contained"
                        style={{ marginVertical: 10 }}
                        onPress={handleLogout}
                        loading={logingOut}
                        disabled={logingOut}
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
                            {Object.entries(rates).map((rate) => (
                                <RadioButton.Item
                                    key={rate[0]}
                                    label={`${(rate[1] as any).name} (${
                                        rate[0]
                                    })`}
                                    value={rate[0]}
                                />
                            ))}
                        </RadioButton.Group>
                    </Dialog.Content>
                </Dialog>
                <Dialog
                    visible={isDialogLanguageOpen}
                    onDismiss={() => setIsDialogLanguageOpen(false)}
                >
                    <Dialog.Content>
                        <RadioButton.Group
                            onValueChange={(value) => {
                                setIsDialogLanguageOpen(false);
                                handleChangeLanguage(value);
                            }}
                            value={language}
                        >
                            <RadioButton.Item
                                key="en"
                                label="English"
                                value="en"
                            />
                            <RadioButton.Item
                                key="pt"
                                label="Português"
                                value="pt"
                            />
                        </RadioButton.Group>
                    </Dialog.Content>
                </Dialog>
            </Portal>
        </>
    );
}

const styles = StyleSheet.create({
    scrollView: {},
    card: {
        backgroundColor: iptcColors.softBlue,
        marginVertical: 10,
    },
    headlineBalance: {
        fontFamily: 'Gelion-Bold',
        color: 'white',
        letterSpacing: 0,
        marginTop: 20,
    },
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

export default ProfileScreen;
