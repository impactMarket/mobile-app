import currenciesJSON from 'assets/currencies.json';
import i18n from 'assets/i18n';
import Input from 'components/core/Input';
import Select from 'components/core/Select';
import ProfileSvg from 'components/svg/ProfileSvg';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Linking from 'expo-linking';
import { amountToCurrency, getCurrencySymbol } from 'helpers/currency';
import { BottomSheet } from 'react-native-btr';
import { getCountryFromPhoneNumber, getUserBalance } from 'helpers/index';
import {
    setUserExchangeRate,
    setUserLanguage,
    setUserMetadata,
    setUserWalletBalance,
} from 'helpers/redux/actions/user';
import BackSvg from 'components/svg/header/BackSvg';
import AvatarPlaceholderSvg from 'components/svg/AvatarPlaceholderSvg';

import { ITabBarIconProps } from 'helpers/types/common';
import { IRootState } from 'helpers/types/state';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    TextInputEndEditingEventData,
    View,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
    Paragraph,
    Portal,
    Dialog,
    RadioButton,
    Text,
    Headline,
    List,
    Searchbar,
    IconButton,
} from 'react-native-paper';
import { batch, useDispatch, useSelector } from 'react-redux';
import Api from 'services/api';
import CacheStore from 'services/cacheStore';
import { ipctColors } from 'styles/index';

const currencies: {
    [key: string]: {
        symbol: string;
        name: string;
        symbol_native: string;
    };
} = currenciesJSON;
function ProfileScreen() {
    const dispatch = useDispatch();
    const user = useSelector((state: IRootState) => state.user.metadata);
    const userWallet = useSelector((state: IRootState) => state.user.wallet);
    const app = useSelector((state: IRootState) => state.app);
    const screen = Dimensions.get('screen');
    const rates = app.exchangeRates;

    const [name, setName] = useState('');
    const [showingResults, setShowingResults] = useState(false);
    const [searchCurrency, setSearchCurrency] = useState('');
    const [searchCurrencyResult, setSearchCurrencyResult] = useState<string[]>(
        []
    );
    const [tooManyResultForQuery, setTooManyResultForQuery] = useState(false);
    const [currency, setCurrency] = useState('usd');
    const [userCusdBalance, setUserCusdBalance] = useState('0');
    const [language, setLanguage] = useState('en');
    const [gender, setGender] = useState<string | null>(null);
    const [isDialogGenderOpen, setIsDialogGenderOpen] = useState(false);
    const [age, setAge] = useState('');
    const [children, setChildren] = useState('');
    const [isDialogCurrencyOpen, setIsDialogCurrencyOpen] = useState(false);
    const [isDialogLanguageOpen, setIsDialogLanguageOpen] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        const loadProfile = () => {
            if (userWallet.address.length > 0) {
                if (user.username !== null && user.username.length > 0) {
                    setName(user.username);
                }
                setCurrency(user.currency);
                setLanguage(user.language);
                if (user.gender !== null && user.gender !== undefined) {
                    setGender(user.gender);
                }
                if (user.year !== null && user.year !== undefined) {
                    setAge((new Date().getFullYear() - user.year).toString());
                }
                if (user.children !== null && user.children !== undefined) {
                    setChildren(user.children.toString());
                }
                setUserCusdBalance(userWallet.balance);
            }
        };
        loadProfile();
    }, [userWallet, user]);

    const updateUserMetadataCache = () => {
        CacheStore.cacheUser({
            address: userWallet.address,
            year:
                age && age.length > 0
                    ? new Date().getFullYear() - parseInt(age, 10)
                    : null,
            children:
                children && children.length > 0 ? parseInt(children, 10) : null,
            currency,
            gender,
            language,
            username: name,
        });
    };

    const onRefresh = () => {
        const updateBalance = async () => {
            const newBalanceStr = (
                await getUserBalance(app.kit, userWallet.address)
            ).toString();
            dispatch(setUserWalletBalance(newBalanceStr));
            setUserCusdBalance(newBalanceStr);
            setRefreshing(false);
        };
        updateBalance();
    };

    const handleChangeGender = async (gender: string) => {
        setGender(gender);
        Api.user.setGender(gender);
        updateUserMetadataCache();
        dispatch(setUserMetadata({ ...user, gender }));
    };

    const handleChangeLanguage = async (text: string) => {
        setLanguage(text);
        Api.user.setLanguage(text);
        updateUserMetadataCache();
        dispatch(setUserLanguage(text));
        i18n.changeLanguage(text);
        moment.locale(text);
    };

    const textGender = (g: string | null) => {
        switch (g) {
            case 'f':
                return i18n.t('female');
            case 'm':
                return i18n.t('male');
            case 'o':
                return i18n.t('others');
            default:
                return i18n.t('select');
        }
    };

    const handleSearchCurrency = (
        e: React.BaseSyntheticEvent<TextInputEndEditingEventData>
    ) => {
        if (tooManyResultForQuery) {
            setTooManyResultForQuery(false);
        }
        const currencyResult: string[] = [];
        for (var [key, value] of Object.entries(currencies)) {
            if (
                value.name.indexOf(searchCurrency) !== -1 ||
                value.symbol.indexOf(searchCurrency) !== -1 ||
                value.symbol_native.indexOf(searchCurrency) !== -1
            ) {
                currencyResult.push(key);
            }
        }
        //
        if (currencyResult.length > 15) {
            setTooManyResultForQuery(true);
        } else {
            setSearchCurrencyResult(currencyResult);
            setShowingResults(true);
        }
    };

    const handleSelectCurrency = (currency: string) => {
        setCurrency(currency);
        Api.user.setCurrency(currency);
        updateUserMetadataCache();
        // update exchange rate!
        const exchangeRate = (rates as any)[currency.toUpperCase()].rate;
        batch(() => {
            dispatch(setUserMetadata({ ...user, currency: currency }));
            dispatch(setUserExchangeRate(exchangeRate));
        });
        setIsDialogCurrencyOpen(false);
        setSearchCurrency('');
        setSearchCurrencyResult([]);
    };

    const renderItemCurrencyQuery = ({ item }: { item: string }) => (
        <List.Item
            title={`[${currencies[item].symbol}] ${currencies[item].name}`}
            onPress={() => handleSelectCurrency(item)}
            // left={(props) => <List.Icon {...props} icon="folder" />}
        />
    );

    const renderSearchCurrencyResult = () => {
        if (!isDialogCurrencyOpen) {
            return;
        }
        if (tooManyResultForQuery) {
            return <Paragraph>{i18n.t('tooManyResults')}</Paragraph>;
        }
        if (searchCurrency.length > 0) {
            if (searchCurrencyResult.length > 0) {
                return (
                    <FlatList
                        data={searchCurrencyResult}
                        renderItem={renderItemCurrencyQuery}
                        keyExtractor={(item) => item}
                    />
                );
            } else if (showingResults) {
                return (
                    <Paragraph
                        style={{
                            textAlign: 'center',
                            fontSize: 18,
                        }}
                    >
                        {i18n.t('noResults')}
                    </Paragraph>
                );
            }
        }
    };

    const userBalance = amountToCurrency(
        userCusdBalance,
        user.currency,
        rates,
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
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => Linking.openURL('celo://wallet')}
                    >
                        <Text
                            style={{
                                color: ipctColors.regentGray,
                                fontSize: 16,
                                fontFamily: 'Inter',
                                lineHeight: 16,
                                letterSpacing: 0.7,
                                opacity: 0.48,
                            }}
                        >
                            {i18n.t('balance')}
                        </Text>
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'flex-end',
                                marginTop: 8,
                            }}
                        >
                            <Headline style={styles.headlineBalanceCurrency}>
                                {getCurrencySymbol(user.currency)}
                            </Headline>
                            <Headline
                                style={{
                                    fontSize: 25,
                                    lineHeight: 24,
                                    ...styles.headlineBalance,
                                }}
                            >
                                {userBalance}
                            </Headline>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <AvatarPlaceholderSvg />
                            <IconButton
                                style={styles.addAvatar}
                                icon="close"
                                size={14}
                                onPress={() => {}}
                            />
                        </View>
                        <View style={styles.avatarText}>
                            <Text
                                style={{
                                    // fontFamily: 'Inter',
                                    fontSize: 16,
                                    fontWeight: '400',
                                    lineHeight: 23,
                                    letterSpacing: 0,
                                    textAlign: 'left',
                                    color: ipctColors.blueRibbon,
                                }}
                            >
                                {i18n.t('uploadProfile')}
                            </Text>
                        </View>
                    </View>
                    <Input
                        label={i18n.t('name')}
                        value={name}
                        maxLength={32}
                        onEndEditing={(e) => {
                            Api.user.setUsername(name);
                            updateUserMetadataCache();
                            dispatch(
                                setUserMetadata({ ...user, username: name })
                            );
                        }}
                        onChangeText={(value) => setName(value)}
                    />
                    <View
                        style={{ marginTop: 16, flex: 2, flexDirection: 'row' }}
                    >
                        <View style={{ flex: 1, marginRight: 10 }}>
                            <Select
                                label={i18n.t('gender')}
                                value={textGender(gender)}
                                onPress={() => setIsDialogGenderOpen(true)}
                            />
                        </View>
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Input
                                label={i18n.t('age')}
                                value={age}
                                maxLength={4}
                                keyboardType="numeric"
                                onEndEditing={(e) => {
                                    Api.user.setAge(parseInt(age, 10));
                                    updateUserMetadataCache();
                                    dispatch(
                                        setUserMetadata({
                                            ...user,
                                            year:
                                                age.length > 0
                                                    ? new Date().getFullYear() -
                                                      parseInt(age, 10)
                                                    : null,
                                        })
                                    );
                                }}
                                onChangeText={(value) => setAge(value)}
                            />
                        </View>
                    </View>
                    <View style={{ marginTop: 16 }}>
                        <Input
                            label={i18n.t('howManyChildren')}
                            value={children}
                            maxLength={4}
                            keyboardType="numeric"
                            onEndEditing={(e) => {
                                Api.user.setChildren(
                                    children.length > 0
                                        ? parseInt(children, 10)
                                        : null
                                );
                                updateUserMetadataCache();
                                dispatch(
                                    setUserMetadata({
                                        ...user,
                                        children:
                                            children.length > 0
                                                ? parseInt(children, 10)
                                                : null,
                                    })
                                );
                            }}
                            onChangeText={(value) => setChildren(value)}
                        />
                    </View>
                    <View style={{ marginTop: 16 }}>
                        <Select
                            label={i18n.t('currency')}
                            value={currencies[currency.toUpperCase()].name}
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
                            flexDirection: 'row',
                            marginTop: 36,
                            marginBottom: 31,
                            justifyContent: 'center',
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 15,
                                lineHeight: 17,
                                color: 'rgba(51,50,57,1)',
                                marginRight: 8,
                                fontWeight: '400',
                            }}
                        >
                            <Text style={{ fontWeight: '700' }}>Build: </Text>
                            {Constants.manifest.version}
                        </Text>
                        <Text
                            style={{
                                fontSize: 15,
                                lineHeight: 17,
                                color: 'rgba(51,50,57,1)',
                                marginLeft: 8,
                                fontWeight: '400',
                            }}
                        >
                            <Text style={{ fontWeight: '700' }}>
                                OS version:{' '}
                            </Text>
                            {Device.osVersion}
                        </Text>
                    </View>
                </View>
            </ScrollView>
            <Portal>
                {/* <BottomSheet
                    visible={isDialogCurrencyOpen}
                    onBackButtonPress={isDialogCurrencyOpen}
                    onBackdropPress={isDialogCurrencyOpen}
                > */}
                    <Dialog
                    visible={isDialogCurrencyOpen}
                    onDismiss={() => setIsDialogCurrencyOpen(false)}
                >
                    <Dialog.Content>
                        <Searchbar
                            placeholder={i18n.t('search')}
                            style={{
                                backgroundColor: 'rgba(206, 212, 218, 0.27)',
                                shadowRadius: 0,
                                elevation: 0,
                                borderRadius: 6,
                                flex: 1
                            }}
                            autoFocus
                            clearIcon={(p) => (
                                <IconButton
                                    icon="close"
                                    onPress={() => {
                                        setSearchCurrency('');
                                        setSearchCurrencyResult([]);
                                        setTooManyResultForQuery(false);
                                        setShowingResults(false);
                                    }}
                                />
                            )}
                            onChangeText={(e) => {
                                if (e.length === 0 && showingResults) {
                                    setSearchCurrencyResult([]);
                                    setShowingResults(false);
                                }
                                setSearchCurrency(e);
                            }}
                            value={searchCurrency}
                            onEndEditing={handleSearchCurrency}
                        />
                        {renderSearchCurrencyResult()}
                    </Dialog.Content>
                
                </Dialog>
                {/* </BottomSheet> */}
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
                <Dialog
                    visible={isDialogGenderOpen}
                    onDismiss={() => setIsDialogGenderOpen(false)}
                >
                    <Dialog.Content>
                        <RadioButton.Group
                            onValueChange={(value) => {
                                setIsDialogGenderOpen(false);
                                handleChangeGender(value);
                            }}
                            value={gender ? gender : ''}
                        >
                            <RadioButton.Item
                                key="f"
                                label={i18n.t('female')}
                                value="f"
                            />
                            <RadioButton.Item
                                key="m"
                                label={i18n.t('male')}
                                value="m"
                            />
                            <RadioButton.Item
                                key="o"
                                label={i18n.t('others')}
                                value="o"
                            />
                        </RadioButton.Group>
                    </Dialog.Content>
                </Dialog>
            </Portal>
        </>
    );
}

ProfileScreen.navigationOptions = () => {
    return {
        headerTitle: i18n.t('profile'),
        headerLeft: () => <BackSvg />,
        tabBarIcon: (props: ITabBarIconProps) => (
            <ProfileSvg focused={props.focused} />
        ),
    };
};

const styles = StyleSheet.create({
    scrollView: {},
    card: {
        borderTopWidth: 1,
        borderTopColor: '#E1E4E7',
        borderBottomWidth: 1,
        borderBottomColor: '#E1E4E7',
        marginTop: 10,

        paddingVertical: 16,
        paddingHorizontal: 22,
        width: Dimensions.get('screen').width,
        left: -20,
    },
    headlineBalanceCurrency: {
        fontFamily: 'Inter-Bold',
        fontSize: 25,
        color: ipctColors.almostBlack,
    },
    headlineBalance: {
        fontFamily: 'Inter-Bold',
        color: ipctColors.almostBlack,
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
        color: ipctColors.regentGray,
        marginVertical: 8,
    },
    avatarContainer: {
        flexDirection: 'row',
        height: 50,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 44,
    },
    addAvatar: {
        position: 'absolute',
        right: -4,
        zIndex: 2,
        height: 22,
        width: 22,
        borderRadius: 11,
        backgroundColor: 'white',
    },
    avatar: {
        height: 80,
        width: 81,
        borderRadius: 40,
    },
    avatarText: {
        height: 46,
        width: 140,
        paddingHorizontal: 16,
    },
});

export default ProfileScreen;
