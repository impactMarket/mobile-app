import i18n from 'assets/i18n';
import Card from 'components/core/Card';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { decrypt, encrypt } from 'helpers/encryption';
import { getCountryFromPhoneNumber, getUserBalance } from 'helpers/index';
import {
    amountToCurrency,
    getCurrencySymbol,
    humanifyCurrencyAmount,
} from 'helpers/currency';
import { iptcColors } from 'styles/index';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
    Paragraph,
    Portal,
    Dialog,
    RadioButton,
    Text,
    Headline,
} from 'react-native-paper';
import { batch, useDispatch, useSelector } from 'react-redux';
import Api from 'services/api';
import * as Linking from 'expo-linking';
import Input from 'components/core/Input';
import Select from 'components/core/Select';
import { IRootState } from 'helpers/types/state';
import { setUserExchangeRate, setUserLanguage, setUserMetadata, setUserWalletBalance } from 'helpers/redux/actions/user';

function ProfileScreen() {
    const dispatch = useDispatch();
    const user = useSelector((state: IRootState) => state.user.metadata);
    const userWallet = useSelector((state: IRootState) => state.user.wallet);
    const app = useSelector((state: IRootState) => state.app);

    const rates = app.exchangeRates;

    const [name, setName] = useState('');
    const [currency, setCurrency] = useState('usd');
    const [language, setLanguage] = useState('en');
    const [isDialogCurrencyOpen, setIsDialogCurrencyOpen] = useState(false);
    const [isDialogLanguageOpen, setIsDialogLanguageOpen] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (userWallet.address.length > 0) {
            if (user.username !== null && user.username.length > 0) {
                setName(decrypt(user.username));
            }
            setCurrency(user.currency);
            setLanguage(user.language);
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

    const handleChangeCurrency = async (text: string) => {
        setCurrency(text);
        Api.setUserCurrency(userWallet.address, text);
        // update exchange rate!
        const exchangeRate = (rates as any)[text.toUpperCase()].rate;
        batch(() => {
            dispatch(setUserMetadata({ ...user, currency: text }));
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
        app.exchangeRates,
        false
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
                        <Card.Content style={{ alignItems: 'center' }}>
                            <Text
                                style={{
                                    color: '#FFFFFF',
                                    fontSize: 16,
                                    lineHeight: 16,
                                    letterSpacing: 0.7,
                                    opacity: 0.48,
                                }}
                            >
                                {i18n.t('balance').toUpperCase()}
                            </Text>
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    // backgroundColor: 'red',
                                    alignItems: 'flex-end',
                                    marginTop: 19,
                                    marginBottom: 8
                                }}
                            >
                                <Headline
                                    style={styles.headlineBalanceCurrency}
                                >
                                    {getCurrencySymbol(user.currency)}
                                </Headline>
                                <Headline
                                    style={{
                                        fontSize:
                                            userBalance.length > 12 ? 43 : 56,
                                        lineHeight:
                                            userBalance.length > 12 ? 43 : 56,
                                        ...styles.headlineBalance,
                                        // backgroundColor: 'yellow'
                                    }}
                                >
                                    {userBalance}
                                </Headline>
                            </View>
                            <Text
                                style={{
                                    color: '#FFFFFF',
                                    fontSize: 17,
                                    lineHeight: 20,
                                    letterSpacing: 0.7,
                                    opacity: 0.56,
                                }}
                            >
                                {humanifyCurrencyAmount(userWallet.balance)}{' '}
                                cUSD
                            </Text>
                        </Card.Content>
                    </Card>
                    <Input
                        label={i18n.t('name')}
                        value={name}
                        maxLength={32}
                        onEndEditing={(e) => {
                            let eName = '';
                            if (name.length > 0) {
                                eName = encrypt(name);
                            }
                            Api.setUsername(userWallet.address, eName);
                            dispatch(setUserMetadata({ ...user, username: eName }));
                        }}
                        onChangeText={(value) => setName(value)}
                    />
                    <View style={{ marginTop: 16 }}>
                        <Select
                            label={i18n.t('currency')}
                            value={currency}
                            onPress={() => setIsDialogCurrencyOpen(true)}
                        />
                    </View>
                    <View style={{ marginTop: 16 }}>
                        <Select
                            label={i18n.t('language')}
                            value={language === 'en' ? 'English' : ' Português'}
                            onPress={() => setIsDialogLanguageOpen(true)}
                        />
                    </View>
                    <Input
                        label={i18n.t('country')}
                        style={{ marginTop: 16 }}
                        value={getCountryFromPhoneNumber(
                            userWallet.phoneNumber
                        )}
                        editable={false}
                    />
                    <Input
                        label={i18n.t('phoneNumber')}
                        style={{ marginTop: 16 }}
                        value={userWallet.phoneNumber}
                        editable={false}
                    />
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'column',
                            marginTop: 36,
                            marginBottom: 31,
                        }}
                    >
                        <Paragraph
                            style={{
                                fontSize: 14,
                                lineHeight: 17,
                                color: 'rgba(30, 50, 82, 0.59)',
                            }}
                        >
                            Build: {Constants.manifest.version}
                        </Paragraph>
                        <Paragraph
                            style={{
                                fontSize: 14,
                                lineHeight: 17,
                                color: 'rgba(30, 50, 82, 0.59)',
                            }}
                        >
                            OS version: {Device.osVersion}
                        </Paragraph>
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
    headlineBalanceCurrency: {
        fontFamily: 'Gelion-Bold',
        color: 'white',
        paddingVertical: 6,
        // backgroundColor: 'green',
    },
    headlineBalance: {
        fontFamily: 'Gelion-Bold',
        color: 'white',
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
