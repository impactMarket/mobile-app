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
    Avatar,
    TextInput,
    Paragraph,
    Portal,
    Dialog,
    RadioButton,
    Text,
    Switch,
} from 'react-native-paper';
import { connect, ConnectedProps, useStore } from 'react-redux';
import Api from 'services/api';
import { uploadLogs } from 'services/logger';

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
    const store = useStore<IStoreCombinedState, IStoreCombinedActionsTypes>();
    const navigation = useNavigation();
    const rates = store.getState().app.exchangeRates;
    const [isConsentAnalytics, setIsConsentAnalytics] = React.useState(true);
    const [sendingLogs, setSendingLogs] = useState(false);
    const [name, setName] = useState('');
    const [logingOut, setLogingOut] = useState(false);
    const [currency, setCurrency] = useState('usd');
    const [language, setLanguage] = useState('en');
    const [isDialogCurrencyOpen, setIsDialogCurrencyOpen] = useState(false);
    const [isDialogLanguageOpen, setIsDialogLanguageOpen] = useState(false);

    useEffect(() => {
        setName(props.user.user.name);
        setCurrency(props.user.user.currency);
        setLanguage(props.user.user.language);
        AsyncStorage.getItem(CONSENT_ANALYTICS).then((c) =>
            setIsConsentAnalytics(c === null || c === 'true' ? true : false)
        );
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
                navigation.goBack();
                navigation.navigate('communities');
            }
        });
        store.dispatch(setUserIsBeneficiary(false));
        store.dispatch(setUserIsCommunityManager(false));
        store.dispatch(resetUserApp());
        store.dispatch(resetNetworkContractsApp());
    };

    const handleChangeCurrency = async (text: string) => {
        setCurrency(text);
        Api.setUserCurrency(props.user.celoInfo.address, text);
        props.dispatch(setUserInfo({ ...props.user.user, currency: text }));
        // update exchange rate!
        const exchangeRate = (rates as any)[text.toUpperCase()].rate;
        props.dispatch(setUserExchangeRate(exchangeRate));
    };

    const handleChangeLanguage = async (text: string) => {
        setLanguage(text);
        Api.setLanguage(props.user.celoInfo.address, text);
        props.dispatch(setUserLanguage(text));
        i18n.locale = text;
        moment.locale(text);
    };

    const handleSendLogs = () => {
        setSendingLogs(true);
        uploadLogs()
            .then((uploaded) => {
                if (uploaded === 0) {
                    Alert.alert(
                        i18n.t('success'),
                        i18n.t('logsSent'),
                        [{ text: 'OK' }],
                        { cancelable: false }
                    );
                } else if (uploaded === 1) {
                    Alert.alert(
                        i18n.t('failure'),
                        i18n.t('errorSendingLogs'),
                        [{ text: 'OK' }],
                        { cancelable: false }
                    );
                } else {
                    Alert.alert(
                        i18n.t('failure'),
                        i18n.t('logsNotFound'),
                        [{ text: 'OK' }],
                        { cancelable: false }
                    );
                }
            })
            .catch((e) => {
                Alert.alert(
                    i18n.t('failure'),
                    i18n.t('errorSendingLogs'),
                    [{ text: 'OK' }],
                    { cancelable: false }
                );
            })
            .finally(() => setSendingLogs(false));
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
                            {currency}
                        </Text>
                    </Button>
                    <Paragraph style={styles.inputTextFieldLabel}>
                        Language
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
                        onPress={handleSendLogs}
                        loading={sendingLogs}
                        disabled={sendingLogs}
                    >
                        {i18n.t('sendLogs')}
                    </Button>
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
