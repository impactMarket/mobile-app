import { useNavigation } from '@react-navigation/native';
import currenciesJSON from 'assets/currencies.json';
import i18n from 'assets/i18n';
import Divider from 'components/Divider';
import Modal from 'components/Modal';
import Button from 'components/core/Button';
import renderHeader from 'components/core/HeaderBottomSheetTitle';
import Input from 'components/core/Input';
import Select from 'components/core/Select';
import ArrowForwardSvg from 'components/svg/ArrowForwardSvg';
import AvatarPlaceholderSvg from 'components/svg/AvatarPlaceholderSvg';
import CheckSvg from 'components/svg/CheckSvg';
import CloseStorySvg from 'components/svg/CloseStorySvg';
import LockSvg from 'components/svg/LockSvg';
import WarningTriangle from 'components/svg/WarningTriangle';
import BackSvg from 'components/svg/header/BackSvg';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as ImagePicker from 'expo-image-picker';
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types';
import * as Linking from 'expo-linking';
import { Screens } from 'helpers/constants';
import {
    amountToCurrency,
    amountToCurrencyBN,
    getCurrencySymbol,
} from 'helpers/currency';
import {
    docsURL,
    getCountryFromPhoneNumber,
    getUserBalance,
    logout,
} from 'helpers/index';
import {
    setUserExchangeRate,
    setUserLanguage,
    setUserMetadata,
    setUserWalletBalance,
} from 'helpers/redux/actions/user';
import { IRootState } from 'helpers/types/state';
import moment from 'moment';
import Logout from 'navigator/header/Logout';
import React, { useState, useEffect, useRef } from 'react';
import { Trans } from 'react-i18next';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
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
    Card as RNPCard,
    Modal as RNPModal,
    Paragraph,
    RadioButton,
    Text,
    Headline,
    Searchbar,
} from 'react-native-paper';
import { WebView } from 'react-native-webview';
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
    const navigation = useNavigation();
    const user = useSelector((state: IRootState) => state.user.metadata);
    const userWallet = useSelector((state: IRootState) => state.user.wallet);
    const app = useSelector((state: IRootState) => state.app);

    const rates = app.exchangeRates;

    const modalizeCurrencyRef = useRef<Modalize>(null);
    const modalizeLanguageRef = useRef<Modalize>(null);
    const modalizeGenderRef = useRef<Modalize>(null);
    const modalizeStolenFAQRef = useRef<Modalize>(null);

    const [showingResults, setShowingResults] = useState(false);
    const [searchCurrency, setSearchCurrency] = useState('');
    const [fullCurrencyList, setFullCurrencyList] = useState<string[]>([]);
    const [searchCurrencyResult, setSearchCurrencyResult] = useState<string[]>(
        []
    );

    const [name, setName] = useState('');
    const [userAvatarImage, setUserAvatarImage] = useState<string | null>('');
    const [currency, setCurrency] = useState('usd');
    const [userCusdBalance, setUserCusdBalance] = useState('0');
    const [language, setLanguage] = useState('en');
    const [gender, setGender] = useState<string | null>(null);
    const [age, setAge] = useState('');
    const [children, setChildren] = useState('');
    const [toggleImageDimensionsModal, setToggleImageDimensionsModal] =
        useState<boolean>(false);
    const [toggleDeleteAccountModal, setToggleDeleteAccountModal] =
        useState<boolean>(false);

    const [selectedCurrencyId, setSelectedCurrencyId] = useState<string | null>(
        null
    );
    const [deleting, setDeleting] = useState(false);
    const [deleteAccountError, setDeleteAccountError] = useState<
        string | undefined
    >();

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
    }, [userWallet, user, navigation]);

    const updateUserMetadataCache = async (changes: any) => {
        const cache = await CacheStore.getUser();
        CacheStore.cacheUser({
            ...cache,
            ...changes,
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
        updateUserMetadataCache({ gender });
        dispatch(setUserMetadata({ ...user, gender }));
        modalizeGenderRef.current?.close();
    };

    const handleChangeAvatar = async (avatar: string) => {
        try {
            setUserAvatarImage(avatar);

            const res = await Api.user.preSignedUrl(avatar);
            await Api.user.uploadPicture(res, avatar);
            CacheStore.cacheUser({
                // TODO: we should use the generic method instead
                address: userWallet.address,
                year:
                    age && age.length > 0
                        ? new Date().getFullYear() - parseInt(age, 10)
                        : null,
                children:
                    children && children.length > 0
                        ? parseInt(children, 10)
                        : null,
                currency,
                gender,
                language,
                avatar: res.media.url,
                username: name,
                //TODO: Change these props below to be optional
                blocked: false,
                suspect: false,
            });
            dispatch(setUserMetadata({ ...user, avatar: res.media.url }));
        } catch (e) {
            Alert.alert(
                i18n.t('generic.failure'),
                i18n.t('errors.uploadingAvatar'),
                [{ text: 'OK' }],
                { cancelable: false }
            );
        }
    };

    const handleChangeLanguage = async (text: string) => {
        setLanguage(text);
        Api.user.setLanguage(text);
        updateUserMetadataCache({ language: text });
        dispatch(setUserLanguage(text));
        i18n.changeLanguage(text);
        moment.locale(text);
        modalizeLanguageRef.current?.close();
    };

    const textGender = (g: string | null) => {
        switch (g) {
            case 'f':
                return i18n.t('profile.female');
            case 'm':
                return i18n.t('profile.male');
            case 'o':
                return i18n.t('profile.others');
            default:
                return i18n.t('generic.select');
        }
    };

    const pickImage = async () => {
        const result = (await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        })) as {
            cancelled: false;
        } & ImageInfo;

        if (!result.cancelled) {
            Image.getSize(
                result.uri,
                (width, height) => {
                    if (width >= 300 && height >= 300) {
                        handleChangeAvatar(result.uri);
                    } else {
                        setToggleImageDimensionsModal(true);
                    }
                },
                (_error) => {
                    handleChangeAvatar(result.uri);
                }
            );
        }
    };

    const renderAvailableCurrencies = () => {
        const currencyResult: string[] = [];
        for (const [key] of Object.entries(currencies)) {
            currencyResult.push(key);
        }
        setFullCurrencyList(currencyResult);
    };

    const handleSearchCurrency = (e: string) => {
        setSearchCurrency(e);

        if (searchCurrency.length <= 0) {
            return;
        }
        const currencyResult: string[] = [];
        for (const [key, value] of Object.entries(currencies)) {
            if (
                value.name.toLowerCase().indexOf(e.toLowerCase()) !== -1
                // value.symbol.toLowerCase().indexOf(e.toLowerCase()) !== -1 ||
                // value.symbol_native.toLowerCase().indexOf(e.toLowerCase()) !==
                //     -1
            ) {
                currencyResult.push(key);
            }
        }
        setSearchCurrencyResult(currencyResult);
        setShowingResults(true);
        // }
    };

    const handleSelectCurrency = (currency: string) => {
        setCurrency(currency);
        Api.user.setCurrency(currency);
        updateUserMetadataCache({ currency });
        // update exchange rate!
        const exchangeRate = rates[currency.toUpperCase()];
        batch(() => {
            dispatch(setUserMetadata({ ...user, currency }));
            dispatch(setUserExchangeRate(exchangeRate));
        });
        setSelectedCurrencyId(currency);
        modalizeCurrencyRef.current?.close();
    };

    const handlePressDeleteAccount = () => {
        setToggleDeleteAccountModal(true);
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
                        {i18n.t('generic.noResults')}
                    </Paragraph>
                );
            }
        }
    };

    const userBalance = amountToCurrencyBN(
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
                <RadioButton.Item key="es" label="Español" value="es" />
                <RadioButton.Item key="fr" label="Français" value="fr" />
            </RadioButton.Group>
        </View>
    );

    const renderCurrencyContent = () => (
        <View
            style={{
                paddingHorizontal: 22,
                // height: Dimensions.get('screen').height * 0.9,
            }}
        >
            <Searchbar
                placeholder={i18n.t('generic.search')}
                style={styles.searchBarContainer}
                inputStyle={{
                    marginLeft: -14,
                }}
                autoFocus
                onChangeText={(e) => {
                    if (e.length === 0 && showingResults) {
                        setSearchCurrencyResult([]);
                        setShowingResults(false);
                    }
                    handleSearchCurrency(e);
                }}
                value={searchCurrency}
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
                <RadioButton.Item
                    key="f"
                    label={i18n.t('profile.female')}
                    value="f"
                />
                <RadioButton.Item
                    key="m"
                    label={i18n.t('profile.male')}
                    value="m"
                />
                <RadioButton.Item
                    key="o"
                    label={i18n.t('profile.others')}
                    value="o"
                />
            </RadioButton.Group>
        </View>
    );

    const DeleteAccountModalContent = () => {
        if (deleteAccountError !== undefined) {
            return (
                <Text
                    style={{
                        fontFamily: 'Inter-Regular',
                        fontSize: 14,
                        lineHeight: 24,
                    }}
                >
                    {i18n.t('errors.notAllowedToDeleteProfile')}
                </Text>
            );
        } else if (toggleDeleteAccountModal) {
            return (
                <>
                    <Text
                        style={{
                            fontFamily: 'Inter-Regular',
                            fontSize: 14,
                            lineHeight: 24,
                        }}
                    >
                        {i18n.t('profile.deleteAccountWarn.msg1')}
                    </Text>
                    <Text
                        style={{
                            fontFamily: 'Inter-Bold',
                            fontSize: 14,
                            lineHeight: 24,
                        }}
                    >
                        {i18n.t('profile.deleteAccountWarn.msg2')}
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: 16,
                        }}
                    >
                        <Button
                            modeType="gray"
                            style={{ width: '45%' }}
                            onPress={() => setToggleDeleteAccountModal(false)}
                            disabled={deleting}
                        >
                            {i18n.t('generic.dismiss')}
                        </Button>
                        <Button
                            modeType="default"
                            style={{ width: '45%' }}
                            onPress={() => {
                                setDeleting(true);
                                Api.user.delete().then((r) => {
                                    if (r.error !== undefined) {
                                        setDeleteAccountError(r.error.name);
                                        setDeleting(false);
                                    } else {
                                        logout(dispatch).then(() => {
                                            // TODO: clear navigator history
                                            navigation.navigate(
                                                Screens.Communities
                                            );
                                        });
                                    }
                                });
                            }}
                            loading={deleting}
                            disabled={deleting}
                        >
                            {i18n.t('generic.delete')}
                        </Button>
                    </View>
                </>
            );
        }
        return null;
    };

    if (toggleImageDimensionsModal) {
        return (
            <Portal>
                <RNPModal visible dismissable={false}>
                    <RNPCard
                        style={{
                            marginHorizontal: 22,
                            borderRadius: 12,
                            paddingHorizontal: 22,
                            paddingVertical: 16,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: '100%',
                                marginBottom: 13.5,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'Manrope-Bold',
                                    fontSize: 18,
                                    lineHeight: 20,
                                    textAlign: 'left',
                                }}
                            >
                                {i18n.t('errors.modals.title')}
                            </Text>
                            <CloseStorySvg
                                onPress={() => {
                                    setToggleImageDimensionsModal(false);
                                }}
                            />
                        </View>
                        <View
                            style={{
                                paddingVertical: 16,
                                paddingHorizontal: 22,
                                borderStyle: 'solid',
                                borderColor: '#EB5757',
                                borderWidth: 2,
                                borderRadius: 8,
                                width: '100%',
                                flexDirection: 'row',
                                marginBottom: 16,
                            }}
                        >
                            <WarningTriangle
                                style={{
                                    alignSelf: 'flex-start',
                                    marginRight: 16,
                                    marginTop: 8,
                                }}
                            />
                            <Text
                                style={{
                                    fontFamily: 'Inter-Regular',
                                    fontSize: 14,
                                    lineHeight: 24,
                                    color: ipctColors.almostBlack,
                                    // textAlign: 'justify',
                                    marginRight: 12,
                                }}
                            >
                                {i18n.t(
                                    'createCommunity.imageDimensionsNotFit'
                                )}
                            </Text>
                        </View>
                        <Button
                            modeType="gray"
                            style={{ width: '100%' }}
                            onPress={() => {
                                setToggleImageDimensionsModal(false);
                            }}
                        >
                            {i18n.t('generic.close')}
                        </Button>
                    </RNPCard>
                </RNPModal>
            </Portal>
        );
    }

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
                            {i18n.t('profile.balance')}
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
                            <TouchableOpacity
                                style={styles.avatar}
                                onPress={pickImage}
                            >
                                <Image
                                    source={{ uri: userAvatarImage }}
                                    style={styles.avatar}
                                />
                                {/* TODO: Call remote avatar API call  */}
                                {/* <View style={styles.removeAvatar}>
                                    <IconButton
                                        style={styles.removeAvatar}
                                        icon="close"
                                        size={14}
                                        onPress={() => setUserAvatarImage(null)}
                                    />
                                </View> */}
                            </TouchableOpacity>
                        ) : (
                            <AvatarPlaceholderSvg style={styles.avatar} />
                        )}

                        <TouchableOpacity
                            style={styles.avatar}
                            onPress={pickImage}
                        >
                            <View style={styles.avatarText}>
                                <Text style={styles.avatarCallToAction}>
                                    {i18n.t('profile.uploadProfilePicture')}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Input
                        label={i18n.t('generic.name')}
                        value={name}
                        maxLength={32}
                        onEndEditing={(_e) => {
                            Api.user.setUsername(name);
                            updateUserMetadataCache({ username: name });
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
                                label={i18n.t('profile.gender')}
                                value={textGender(gender)}
                                onPress={() => {
                                    modalizeGenderRef.current?.open();
                                }}
                            />
                        </View>
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Input
                                label={i18n.t('profile.age')}
                                value={age}
                                maxLength={4}
                                keyboardType="numeric"
                                onEndEditing={(_e) => {
                                    Api.user.setAge(parseInt(age, 10));
                                    updateUserMetadataCache({
                                        year:
                                            age.length > 0
                                                ? new Date().getFullYear() -
                                                  parseInt(age, 10)
                                                : null,
                                    });
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
                            label={i18n.t('profile.howManyChildren')}
                            value={children}
                            maxLength={4}
                            keyboardType="numeric"
                            onEndEditing={(_e) => {
                                Api.user.setChildren(
                                    children.length > 0
                                        ? parseInt(children, 10)
                                        : null
                                );
                                updateUserMetadataCache({
                                    children:
                                        children.length > 0
                                            ? parseInt(children, 10)
                                            : null,
                                });
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
                            label={i18n.t('generic.currency')}
                            value={currencies[currency.toUpperCase()].name}
                            onPress={() => modalizeCurrencyRef.current?.open()}
                        />
                    </View>
                    <View style={{ marginTop: 28 }}>
                        <Select
                            label={i18n.t('generic.language')}
                            value={
                                language === 'en'
                                    ? 'English'
                                    : language === 'pt'
                                    ? ' Português'
                                    : language === 'es'
                                    ? 'Español'
                                    : 'Français'
                            }
                            onPress={() => modalizeLanguageRef.current?.open()}
                        />
                    </View>
                    <Divider />
                    <Text style={styles.itemTitle}>
                        <Trans
                            i18nKey="profile.stolenOrChangedPhone"
                            components={{
                                blue: (
                                    <Text
                                        onPress={() =>
                                            modalizeStolenFAQRef.current?.open()
                                        }
                                        style={{
                                            fontFamily: 'Inter-Regular',
                                            fontSize: 15,
                                            lineHeight: 24,
                                            color: ipctColors.blueRibbon,
                                        }}
                                    />
                                ),
                            }}
                        />
                    </Text>
                    <Input
                        label={i18n.t('profile.phoneNumber')}
                        boxStyle={{ marginTop: 28 }}
                        value={userWallet.phoneNumber}
                        editable={false}
                        rightElement={<LockSvg color={ipctColors.borderGray} />}
                    />
                    <Input
                        label={i18n.t('generic.country')}
                        boxStyle={{ marginTop: 28 }}
                        value={getCountryFromPhoneNumber(
                            userWallet.phoneNumber
                        )}
                        editable={false}
                        rightElement={<LockSvg color={ipctColors.borderGray} />}
                    />
                    <Divider />
                    <Button modeType="gray" onPress={handlePressDeleteAccount}>
                        {i18n.t('profile.deleteAccount')}
                    </Button>
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
                            {Constants.manifest2 !== null
                                ? Constants.manifest2.runtimeVersion
                                : Constants.manifest !== null &&
                                  Constants.manifest.version !== undefined
                                ? Constants.manifest.version
                                : 'unkown'}
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
                <Modal
                    title={i18n.t('profile.deleteAccount')}
                    visible={toggleDeleteAccountModal}
                    onDismiss={() => {
                        setToggleDeleteAccountModal(false);
                        setDeleteAccountError(undefined);
                    }}
                >
                    <DeleteAccountModalContent />
                </Modal>
                <Modalize
                    ref={modalizeCurrencyRef}
                    HeaderComponent={renderHeader(
                        i18n.t('generic.currency'),
                        modalizeCurrencyRef,
                        () => setSearchCurrency('')
                    )}
                >
                    {renderCurrencyContent()}
                </Modalize>
                <Modalize
                    ref={modalizeLanguageRef}
                    HeaderComponent={renderHeader(
                        i18n.t('generic.language'),
                        modalizeLanguageRef
                    )}
                    adjustToContentHeight
                >
                    {renderLanguageContent()}
                </Modalize>
                <Modalize
                    ref={modalizeGenderRef}
                    HeaderComponent={renderHeader(
                        i18n.t('profile.gender'),
                        modalizeGenderRef
                    )}
                    adjustToContentHeight
                >
                    {renderGenderContent()}
                </Modalize>
                <Modalize
                    ref={modalizeStolenFAQRef}
                    HeaderComponent={renderHeader(
                        null,
                        modalizeStolenFAQRef,
                        () => {},
                        true
                    )}
                >
                    <WebView
                        originWhitelist={['*']}
                        source={{
                            uri: docsURL(
                                '/general/stolen-lost-phone',
                                language
                            ),
                        }}
                        style={{
                            height: Dimensions.get('screen').height * 0.85,
                        }}
                    />
                </Modalize>
            </Portal>
        </>
    );
}

ProfileScreen.navigationOptions = () => {
    return {
        headerLeft: () => <BackSvg />,
        headerRight: () => <Logout />,
        headerTitle: i18n.t('profile.profile'),
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
        top: -1,
        right: -3,
        zIndex: 2,
        height: 22,
        width: 22,
        borderRadius: 11,
        backgroundColor: ipctColors.white,
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
