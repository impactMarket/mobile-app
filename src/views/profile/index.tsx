import i18n from 'assets/i18n';
import Card from 'components/core/Card';
import Header from 'components/Header';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { decrypt, encrypt } from 'helpers/encryption';
import { getCountryFromPhoneNumber, getUserBalance } from 'helpers/index';
import { amountToCurrency, humanifyCurrencyAmount } from 'helpers/currency';
import { iptcColors } from 'styles/index';
import {
    resetUserApp,
    resetNetworkContractsApp,
    setUserInfo,
    setUserExchangeRate,
    setUserIsBeneficiary,
    setUserIsCommunityManager,
    setUserLanguage,
    setUserWalletBalance,
} from 'helpers/redux/actions/ReduxActions';
import {
    CONSENT_ANALYTICS,
    IRootState,
    IStoreCombinedActionsTypes,
    IStoreCombinedState,
} from 'helpers/types';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
import {
    Button,
    Paragraph,
    Portal,
    Dialog,
    RadioButton,
    Text,
    Headline,
} from 'react-native-paper';
import { batch, useDispatch, useSelector, useStore } from 'react-redux';
import Api from 'services/api';
import * as Linking from 'expo-linking';
import Input from 'components/core/Input';
import Select from 'components/core/Select';
import { Screens } from 'helpers/constants';
import { StackNavigationProp } from '@react-navigation/stack';

function ProfileScreen({
    navigation,
}: {
    navigation: StackNavigationProp<any, any>;
}) {
    const store = useStore<IStoreCombinedState, IStoreCombinedActionsTypes>();
    // const navigation = useNavigation();
    const dispatch = useDispatch();
    const user = useSelector((state: IRootState) => state.user.user);
    const userWallet = useSelector((state: IRootState) => state.user.celoInfo);
    const app = useSelector((state: IRootState) => state.app);

    const rates = app.exchangeRates;

    const [isConsentAnalytics, setIsConsentAnalytics] = React.useState(true);
    const [name, setName] = useState('');
    const [logingOut, setLogingOut] = useState(false);
    const [currency, setCurrency] = useState('usd');
    const [language, setLanguage] = useState('en');
    const [isDialogCurrencyOpen, setIsDialogCurrencyOpen] = useState(false);
    const [isDialogLanguageOpen, setIsDialogLanguageOpen] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (userWallet.address.length > 0) {
            if (user.name !== null && user.name.length > 0) {
                setName(decrypt(user.name));
            }
            setCurrency(user.currency);
            setLanguage(user.language);
            AsyncStorage.getItem(CONSENT_ANALYTICS).then((c) =>
                setIsConsentAnalytics(c === null || c === 'true' ? true : false)
            );
        }
    }, [userWallet]);

    const onRefresh = () => {
        const updateBalance = async () => {
            dispatch(
                setUserWalletBalance(
                    getUserBalance(app.kit, userWallet.address).toString()
                )
            );
            setRefreshing(false);
        };
        updateBalance();
    };

    const onToggleSwitch = () => {
        AsyncStorage.setItem(CONSENT_ANALYTICS, `${!isConsentAnalytics}`);
        setIsConsentAnalytics(!isConsentAnalytics);
    };

    const handleChangeCurrency = async (text: string) => {
        setCurrency(text);
        Api.setUserCurrency(userWallet.address, text);
        // update exchange rate!
        const exchangeRate = (rates as any)[text.toUpperCase()].rate;
        batch(() => {
            dispatch(setUserInfo({ ...user, currency: text }));
            dispatch(setUserExchangeRate(exchangeRate));
        });
    };

    const handleChangeLanguage = async (text: string) => {
        setLanguage(text);
        Api.setLanguage(userWallet.address, text);
        dispatch(setUserLanguage(text));
        i18n.changeLanguage(text);
        moment.locale(text);
    };

    const userBalance = amountToCurrency(
        userWallet.balance,
        user.currency,
        app.exchangeRates
    );

    return (
        <>
            <ScrollView
                style={styles.scrollView}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <View style={styles.container}>
                    <Card
                        elevation={0}
                        style={styles.card}
                        onPress={() => Linking.openURL('celo://wallet')}
                    >
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
                                    {userBalance}
                                </Headline>
                                <Text style={{ color: '#FFFFFF' }}>
                                    {humanifyCurrencyAmount(userWallet.balance)}{' '}
                                    cUSD
                                </Text>
                            </View>
                        </Card.Content>
                    </Card>
                    {/* <ValidatedTextInput
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
                    /> */}
                    <Input
                        label={i18n.t('name')}
                        style={{
                            backgroundColor: 'rgba(206, 212, 218, 0.27)',
                            borderRadius: 6,
                            fontSize: 20,
                            lineHeight: 24,
                            height: 24,
                            color: iptcColors.almostBlack,
                            paddingVertical: 9,
                            paddingHorizontal: 14,
                        }}
                        value={name}
                        maxLength={32}
                        onEndEditing={(e) => {
                            let eName = '';
                            if (name.length > 0) {
                                eName = encrypt(name);
                            }
                            Api.setUsername(userWallet.address, eName);
                            dispatch(setUserInfo({ ...user, name: eName }));
                        }}
                        onChangeText={(value) => setName(value)}
                    />
                    <Select
                        label={i18n.t('currency')}
                        value={currency}
                        onPress={() => setIsDialogCurrencyOpen(true)}
                    />
                    <Select
                        label={i18n.t('language')}
                        value={language === 'en' ? 'English' : ' Português'}
                        onPress={() => setIsDialogLanguageOpen(true)}
                    />
                    <Input
                        label={i18n.t('country')}
                        style={{ marginVertical: 3 }}
                        value={getCountryFromPhoneNumber(
                            userWallet.phoneNumber
                        )}
                        editable={false}
                    />
                    <Input
                        label={i18n.t('phoneNumber')}
                        style={{ marginVertical: 3 }}
                        value={userWallet.phoneNumber}
                        editable={false}
                    />
                    {/* <View
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
                    </View> */}
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'column',
                            justifyContent: 'space-around',
                            marginBottom: 31,
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
        marginTop: 10,
        marginBottom: 45,
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
        fontSize: 17,
        lineHeight: 17,
        letterSpacing: 0.245455,
        color: iptcColors.textGray,
        marginVertical: 8,
    },
});

export default ProfileScreen;
