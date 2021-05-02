/* eslint handle-callback-err: "warn" */
// Assets
import { useNavigation } from '@react-navigation/native';
import currenciesJSON from 'assets/currencies.json';
import i18n from 'assets/i18n';
// Components
import renderHeader from 'components/core/HeaderBottomSheetTitle';
import Input from 'components/core/Input';
import Select from 'components/core/Select';
import ArrowForwardSvg from 'components/svg/ArrowForwardSvg';
import AvatarPlaceholderSvg from 'components/svg/AvatarPlaceholderSvg';
import CheckSvg from 'components/svg/CheckSvg';
import ProfileSvg from 'components/svg/ProfileSvg';
import BackSvg from 'components/svg/header/BackSvg';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as ImagePicker from 'expo-image-picker';
import * as Linking from 'expo-linking';
import { imageTargets } from 'helpers/constants';
// Helpers
import { amountToCurrency, getCurrencySymbol } from 'helpers/currency';
import { getCountryFromPhoneNumber, getUserBalance } from 'helpers/index';
import {
    setUserExchangeRate,
    setUserLanguage,
    setUserMetadata,
    setUserWalletBalance,
} from 'helpers/redux/actions/user';
import { ITabBarIconProps } from 'helpers/types/common';
import { IRootState } from 'helpers/types/state';
import moment from 'moment';
import React, { useState, useEffect, useRef } from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    TextInputEndEditingEventData,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Modalize } from 'react-native-modalize';
import {
    Portal,
    Paragraph,
    RadioButton,
    Text,
    Headline,
    Searchbar,
    IconButton,
} from 'react-native-paper';
import { batch, useDispatch, useSelector } from 'react-redux';
// Services
import Api from 'services/api';
import CacheStore from 'services/cacheStore';
// Styles
import { ipctColors } from 'styles/index';

// Constants
const currencies: {
    [key: string]: {
        symbol: string;
        name: string;
        symbol_native: string;
    };
} = currenciesJSON;
function ProfileScreen() {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const user = useSelector((state: IRootState) => state.user.metadata);
    const userWallet = useSelector((state: IRootState) => state.user.wallet);
    const app = useSelector((state: IRootState) => state.app);

    const rates = app.exchangeRates;

    const modalizeCurrencyRef = useRef<Modalize>(null);
    const modalizeLanguageRef = useRef<Modalize>(null);
    const modalizeGenderRef = useRef<Modalize>(null);

    const [showingResults, setShowingResults] = useState(false);
    const [searchCurrency, setSearchCurrency] = useState('');
    const [fullCurrencyList, setFullCurrencyList] = useState<string[]>([]);
    const [searchCurrencyResult, setSearchCurrencyResult] = useState<string[]>(
        []
    );
    const [tooManyResultForQuery, setTooManyResultForQuery] = useState(false);

    const [name, setName] = useState('');
    const [userAvatarImage, setUserAvatarImage] = useState<string | null>('');
    const [currency, setCurrency] = useState('usd');
    const [userCusdBalance, setUserCusdBalance] = useState('0');
    const [language, setLanguage] = useState('en');
    const [gender, setGender] = useState<string | null>(null);
    const [age, setAge] = useState('');
    const [children, setChildren] = useState('');
    const [sending, setSending] = useState(false);

    const [selectedCurrencyId, setSelectedCurrencyId] = useState<string | null>(
        null
    );

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
                setUserAvatarImage(user?.avatar);
            }
        };
        navigation.setOptions({
            tabBarVisible: false,
        });
        renderAvailableCurrencies();
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
            avatar: userAvatarImage,
            username: name,
            //TODO: Change these props below to be optional
            blocked: false,
            suspect: false,
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

    const handleChangeAvatar = async (avatar: string) => {
        try {
            setSending(true);
            setUserAvatarImage(avatar);

            userAvatarImage &&
                (await Api.upload.uploadImage(
                    userAvatarImage,
                    imageTargets.PROFILE
                ));
            setSending(false);
        } catch (e) {
            Alert.alert(
                i18n.t('failure'),
                i18n.t('errorUploadingAvatar'),
                [{ text: 'OK' }],
                { cancelable: false }
            );
            setSending(false);
        }
        updateUserMetadataCache();
        dispatch(setUserMetadata({ ...user, avatar }));
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

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            handleChangeAvatar(result.uri);
        }
    };

    const renderAvailableCurrencies = () => {
        const currencyResult: string[] = [];
        for (const [key] of Object.entries(currencies)) {
            currencyResult.push(key);
        }
        setFullCurrencyList(currencyResult);
    };

    const handleSearchCurrency = (
        e: React.BaseSyntheticEvent<TextInputEndEditingEventData>
    ) => {
        if (tooManyResultForQuery) {
            setTooManyResultForQuery(false);
        }
        const currencyResult: string[] = [];
        for (const [key, value] of Object.entries(currencies)) {
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
            dispatch(setUserMetadata({ ...user, currency }));
            dispatch(setUserExchangeRate(exchangeRate));
        });
        setSelectedCurrencyId(currency);
        modalizeCurrencyRef.current?.close();
    };

    const renderItemCurrencyQuery = ({ item }: { item: string }) => (
        <TouchableOpacity onPress={() => handleSelectCurrency(item)}>
            <View style={styles.itemContainer}>
                <Text
                    style={styles.itemTitle}
                >{`[${currencies[item].symbol}] ${currencies[item].name}`}</Text>
                {item === selectedCurrencyId && (
                    <CheckSvg color={ipctColors.greenishTeal} />
                )}
            </View>
        </TouchableOpacity>
    );

    const renderSearchCurrencyResult = () => {
        if (searchCurrency.length === 0) {
            return (
                <FlatList
                    data={fullCurrencyList}
                    renderItem={renderItemCurrencyQuery}
                    keyExtractor={(item) => item}
                />
            );
        } else {
            if (searchCurrencyResult.length > 0) {
                return (
                    <FlatList
                        data={searchCurrencyResult}
                        renderItem={renderItemCurrencyQuery}
                        keyExtractor={(item) => item}
                        // extraData={selectedCurrencyId}
                        showsVerticalScrollIndicator={false}
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

    const renderLanguageContent = () => (
        <View style={{ flex: 1, height: '50%', paddingLeft: 8 }}>
            <RadioButton.Group
                onValueChange={(value) => {
                    handleChangeLanguage(value);
                }}
                value={language}
            >
                <RadioButton.Item key="en" label="English" value="en" />
                <RadioButton.Item key="pt" label="Português" value="pt" />
            </RadioButton.Group>
        </View>
    );

    const renderCurrencyContent = () => (
        <View
            style={{
                paddingHorizontal: 22,
                height: Dimensions.get('screen').height * 0.9,
            }}
        >
            <Searchbar
                placeholder={i18n.t('search')}
                style={styles.searchBarContainer}
                inputStyle={{
                    marginLeft: -14,
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
        </View>
    );

    const renderGenderContent = () => (
        <View style={{ flex: 1, height: '50%', paddingLeft: 8 }}>
            <RadioButton.Group
                onValueChange={(value) => {
                    handleChangeGender(value);
                }}
                value={gender ? gender : ''}
            >
                <RadioButton.Item key="f" label={i18n.t('female')} value="f" />
                <RadioButton.Item key="m" label={i18n.t('male')} value="m" />
                <RadioButton.Item key="o" label={i18n.t('others')} value="o" />
            </RadioButton.Group>
        </View>
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
                        <Text style={styles.balanceValue}>
                            {i18n.t('balance')}
                        </Text>
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'flex-end',
                            }}
                        >
                            <Headline style={styles.headlineBalanceCurrency}>
                                {getCurrencySymbol(user.currency)}
                            </Headline>
                            <Headline
                                style={{
                                    fontSize: 25,
                                    lineHeight: 28,
                                    ...styles.headlineBalance,
                                }}
                            >
                                {userBalance}
                            </Headline>
                            <ArrowForwardSvg
                                color={ipctColors.borderGray}
                                style={{
                                    position: 'absolute',
                                    right: 5,
                                    alignSelf: 'flex-start',
                                }}
                            />
                        </View>
                    </TouchableOpacity>
                    <View style={styles.avatarContainer}>
                        {userAvatarImage && userAvatarImage.length > 0 ? (
                            <View style={styles.avatar}>
                                <Image
                                    source={{ uri: userAvatarImage }}
                                    style={styles.avatar}
                                />
                                {/* TODO: Call remote avatar API call */}
                                <IconButton
                                    style={styles.removeAvatar}
                                    icon="close"
                                    size={14}
                                    onPress={() => setUserAvatarImage(null)}
                                />
                            </View>
                        ) : (
                            <AvatarPlaceholderSvg style={styles.avatar} />
                        )}

                        <TouchableOpacity
                            style={styles.avatar}
                            onPress={pickImage}
                        >
                            <View style={styles.avatarText}>
                                <Text style={styles.avatarCallToAction}>
                                    {i18n.t('uploadProfile')}
                                </Text>
                            </View>
                        </TouchableOpacity>
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
                        style={{ marginTop: 28, flex: 2, flexDirection: 'row' }}
                    >
                        <View style={{ flex: 1, marginRight: 10 }}>
                            <Select
                                label={i18n.t('gender')}
                                value={textGender(gender)}
                                onPress={() => {
                                    modalizeGenderRef.current?.open();
                                }}
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
                    <View style={{ marginTop: 28 }}>
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
                    <View style={{ marginTop: 28 }}>
                        <Select
                            label={i18n.t('currency')}
                            value={currencies[currency.toUpperCase()].name}
                            onPress={() => modalizeCurrencyRef.current?.open()}
                        />
                    </View>
                    <View style={{ marginTop: 28 }}>
                        <Select
                            label={i18n.t('language')}
                            value={language === 'en' ? 'English' : ' Português'}
                            onPress={() => modalizeLanguageRef.current?.open()}
                        />
                    </View>
                    <Input
                        label={i18n.t('country')}
                        style={{ marginTop: 28 }}
                        value={getCountryFromPhoneNumber(
                            userWallet.phoneNumber
                        )}
                        editable={false}
                    />
                    <Input
                        label={i18n.t('phoneNumber')}
                        style={{ marginTop: 28 }}
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
                <Modalize
                    ref={modalizeCurrencyRef}
                    HeaderComponent={renderHeader(
                        i18n.t('currency'),
                        modalizeCurrencyRef,
                        () => setSearchCurrency('')
                    )}
                >
                    {renderCurrencyContent()}
                </Modalize>
                <Modalize
                    ref={modalizeLanguageRef}
                    HeaderComponent={renderHeader(
                        i18n.t('language'),
                        modalizeLanguageRef
                    )}
                    adjustToContentHeight
                >
                    {renderLanguageContent()}
                </Modalize>
                <Modalize
                    ref={modalizeGenderRef}
                    HeaderComponent={renderHeader(
                        i18n.t('gender'),
                        modalizeGenderRef
                    )}
                    adjustToContentHeight
                >
                    {renderGenderContent()}
                </Modalize>
            </Portal>
        </>
    );
}

ProfileScreen.navigationOptions = () => {
    return {
        headerLeft: () => <BackSvg />,
        headerTitle: i18n.t('profile'),
        headerTitleStyle: {
            fontFamily: 'Manrope-Bold',
            fontSize: 22,
            lineHeight: 28,
            color: '#333239',
        },
        headerTitleContainerStyle: {
            left: 58,
        },
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

        paddingTop: 24,
        paddingBottom: 16,
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
    removeAvatar: {
        position: 'absolute',
        top: -2,
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
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 16,
        marginRight: 16,
    },
    avatarText: {
        height: 46,
        width: 140,
        marginLeft: 16,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingRight: 16,
    },
    itemTitle: {
        fontSize: 15,
        lineHeight: 24,
        fontFamily: 'Inter-Regular',
    },
    bottomSheetHeaderContainer: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 22,
    },
    bottomSheetHeaderText: {
        fontSize: 22,
        lineHeight: 28,
        fontFamily: 'Manrope-Bold',
    },
    balanceValue: {
        color: '#73839D',
        fontSize: 15,
        fontFamily: 'Inter-Regular',
        lineHeight: 15,
        letterSpacing: 0.7,
    },
    avatarCallToAction: {
        fontFamily: 'Inter-Regular',
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 23,
        letterSpacing: 0,
        textAlign: 'left',
        color: ipctColors.blueRibbon,
    },
    searchBarContainer: {
        borderColor: ipctColors.borderGray,
        borderWidth: 1,
        borderStyle: 'solid',
        shadowRadius: 0,
        elevation: 0,
        borderRadius: 6,
    },
});

export default ProfileScreen;
