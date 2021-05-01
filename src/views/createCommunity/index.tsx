/* eslint handle-callback-err: "warn" */
import { useNavigation } from '@react-navigation/native';
import countriesJSON from 'assets/countries.json';
import currenciesJSON from 'assets/currencies.json';
import i18n from 'assets/i18n';
import BigNumber from 'bignumber.js';
import renderHeader from 'components/core/HeaderBottomSheetTitle';
import Input from 'components/core/Input';
import Select from 'components/core/Select';
import CloseStorySvg from 'components/svg/CloseStorySvg';
import BackSvg from 'components/svg/header/BackSvg';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { celoNetwork, imageTargets } from 'helpers/constants';
import {
    formatInputAmountToTransfer,
    amountToCurrency,
} from 'helpers/currency';
import { validateEmail, updateCommunityInfo } from 'helpers/index';
import { setUserIsCommunityManager } from 'helpers/redux/actions/user';
import { CommunityCreationAttributes } from 'helpers/types/endpoints';
import { IRootState } from 'helpers/types/state';
import React, {
    useState,
    useEffect,
    useRef,
    useLayoutEffect,
    Dispatch,
} from 'react';
import {
    StyleSheet,
    ScrollView,
    Alert,
    View,
    Image,
    FlatList,
    TextInputEndEditingEventData,
    TouchableOpacity,
    Dimensions,
    KeyboardAvoidingView,
} from 'react-native';
import { Modalize } from 'react-native-modalize';
import {
    Portal,
    Button,
    Paragraph,
    Headline,
    RadioButton,
    HelperText,
    IconButton,
    Text,
    Searchbar,
} from 'react-native-paper';
import EIcon from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import * as Sentry from 'sentry-expo';
import Api from 'services/api';
import { celoWalletRequest } from 'services/celoWallet';
import { ipctColors } from 'styles/index';

import config from '../../../config';
import CommunityContractABI from '../../contracts/CommunityABI.json';
import CommunityBytecode from '../../contracts/CommunityBytecode.json';
import SubmitCommunity from '../../navigator/header/SubmitCommunity';

const countries: {
    [key: string]: {
        name: string;
        native: string;
        phone: string;
        currency: string;
        languages: string[];
        emoji: string;
    };
} = countriesJSON;

const currencies: {
    [key: string]: {
        symbol: string;
        name: string;
        symbol_native: string;
    };
} = currenciesJSON;

BigNumber.config({ EXPONENTIAL_AT: [-7, 30] });
function CreateCommunityScreen() {
    const dispatch = useDispatch();
    const userAddress = useSelector(
        (state: IRootState) => state.user.wallet.address
    );
    const userCurrency = useSelector(
        (state: IRootState) => state.user.metadata.currency
    );
    const userPhoneNumber = useSelector(
        (state: IRootState) => state.user.wallet.phoneNumber
    );
    const userLanguage = useSelector(
        (state: IRootState) => state.user.metadata.language
    );

    const avatar = useSelector(
        (state: IRootState) => state.user.metadata.avatar
    );
    const exchangeRates = useSelector(
        (state: IRootState) => state.app.exchangeRates
    );
    const kit = useSelector((state: IRootState) => state.app.kit);
    const navigation = useNavigation();

    const [sending, setSending] = useState(false);
    const [gpsLocation, setGpsLocation] = useState<Location.LocationObject>();
    const [isNameValid, setIsNameValid] = useState(true);
    const [isEditable, setIsEditable] = useState(false);

    const [isCoverImageValid, setIsCoverImageValid] = useState(true);
    const [isProfileImageValid, setIsProfileImageValid] = useState(true);
    const [isCommunityLogoValid, setIsCommunityLogoValid] = useState(true);

    const [isDescriptionValid, setIsDescriptionValid] = useState(true);
    const [isCityValid, setIsCityValid] = useState(true);
    const [isCountryValid, setIsCountryValid] = useState(true);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isClaimAmountValid, setIsClaimAmountValid] = useState(true);
    const [isEnablingGPS, setIsEnablingGPS] = useState(false);
    const [isEnabledGPS, setIsEnabledGPS] = useState(true);
    const [
        isIncrementalIntervalValid,
        setIsIncrementalIntervalValid,
    ] = useState(true);
    const [isMaxClaimValid, setIsMaxClaimValid] = useState(true);
    //
    const [showingResults, setShowingResults] = useState(false);
    const [searchCurrency, setSearchCurrency] = useState('');
    const [fullCurrencyList, setFullCurrencyList] = useState<string[]>([]);
    const [searchCurrencyResult, setSearchCurrencyResult] = useState<string[]>(
        []
    );
    const [currency, setCurrency] = useState<string>(userCurrency);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [city, setCity] = useState('');
    const [searchCountryQuery, setSearchCountryQuery] = useState('');

    const [fullCountryList, setFullCountryList] = useState<string[]>([]);
    const [searchCountryISOResult, setSearchCountryISOResult] = useState<
        string[]
    >([]);
    const [tooManyResultForQuery, setTooManyResultForQuery] = useState(false);
    const [country, setCountry] = useState('');
    const [email, setEmail] = useState('');
    const [coverImage, setCoverImage] = useState('');

    const [profileImage, setProfileImage] = useState<string>(avatar || '');
    const [isAlertVisible, setIsAlertVisible] = useState(true);
    const [communityLogo, setCommunityLogo] = useState('');

    const [claimAmount, setClaimAmount] = useState('');
    const [baseInterval, setBaseInterval] = useState('86400');
    const [incrementInterval, setIncrementalInterval] = useState('');
    const [
        incrementalIntervalUnit,
        setIncrementalIntervalUnit,
    ] = useState<number>(60);

    const [maxClaim, setMaxClaim] = useState('');
    const [visibility, setVisibility] = useState('public');

    const modalizeCurrencyRef = useRef<Modalize>(null);
    const modalizeCountryRef = useRef<Modalize>(null);
    const modalizeFrequencyRef = useRef<Modalize>(null);
    const modalizeVisibilityRef = useRef<Modalize>(null);
    const modalizeClaimImcrementRef = useRef<Modalize>(null);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <SubmitCommunity
                    submit={submitNewCommunity}
                    submitting={sending}
                />
            ),
        });
        // TODO: this next line should change though.
    }, [
        navigation,
        coverImage,
        profileImage,
        communityLogo,
        name,
        description,
        city,
        country,
        email,
        gpsLocation,
        claimAmount,
        incrementInterval,
        maxClaim,
        baseInterval,
        sending,
    ]);

    useEffect(() => {
        const setCountryAndCurrencyBasedOnPhoneNumber = () => {
            for (const [key, value] of Object.entries(countries)) {
                if (
                    value.phone ===
                    userPhoneNumber.slice(1, value.phone.length + 1)
                ) {
                    setCountry(key);
                    setCurrency(value.currency);
                    break;
                }
            }
        };
        setCountryAndCurrencyBasedOnPhoneNumber();
        renderAvailableCountries();
        renderAvailableCurrencies();
    }, []);

    const deployPrivateCommunity = async () => {
        const decimals = new BigNumber(10).pow(config.cUSDDecimals);
        const CommunityContract = new kit.web3.eth.Contract(
            CommunityContractABI as any
        );
        const txObject = await CommunityContract.deploy({
            data: CommunityBytecode.bytecode,
            arguments: [
                userAddress,
                new BigNumber(formatInputAmountToTransfer(claimAmount))
                    .multipliedBy(decimals)
                    .toString(),
                new BigNumber(formatInputAmountToTransfer(maxClaim))
                    .multipliedBy(decimals)
                    .toString(),
                baseInterval,
                (
                    parseInt(incrementInterval, 10) * incrementalIntervalUnit
                ).toString(),
                celoNetwork.noAddress,
                config.cUSDContract,
                userAddress,
            ],
        });
        // exception is handled outside
        // receipt as undefined is handled outside
        const receipt = await celoWalletRequest(
            userAddress,
            celoNetwork.noAddress,
            txObject,
            'createcommunity',
            kit
        );
        return receipt;
    };

    const submitNewCommunity = async () => {
        const _isCoverImageValid = coverImage.length > 0;
        if (!_isCoverImageValid) {
            setIsCoverImageValid(false);
        }
        //TODO: Will be added in later version
        // const _isProfileImageValid = profileImage.length > 0;
        // if (!_isProfileImageValid) {
        //     setIsProfileImageValid(false);
        // }

        // const _isCommunityLogoValid = communityLogo.length > 0;
        // if (!_isCommunityLogoValid) {
        //     setIsCommunityLogoValid(false);
        // }

        const _isNameValid = name.length > 0;
        if (!_isNameValid) {
            setIsNameValid(false);
        }
        const _isDescriptionValid = description.length > 0;
        if (!_isDescriptionValid) {
            setIsDescriptionValid(false);
        }
        const _isCityValid = city.length > 0;
        if (!_isCityValid) {
            setIsCityValid(false);
        }
        const _isCountryValid = country.length > 0;
        if (!_isCountryValid) {
            setIsCountryValid(false);
        }
        const _isEmailValid = validateEmail(email);
        if (!_isEmailValid) {
            setIsEmailValid(false);
        }
        const _isEnabledGPS = gpsLocation !== undefined;
        if (!_isEnabledGPS) {
            setIsEnabledGPS(false);
        }
        const _isClaimAmountValid =
            claimAmount.length > 0 && /^\d*[\.\,]?\d*$/.test(claimAmount);
        if (!_isClaimAmountValid) {
            setIsClaimAmountValid(false);
        }
        const _isIncrementalIntervalValid = incrementInterval.length > 0;
        if (!_isIncrementalIntervalValid) {
            setIsIncrementalIntervalValid(false);
        }
        const _isMaxClaimValid =
            maxClaim.length > 0 && /^\d*[\.\,]?\d*$/.test(maxClaim);
        if (!_isMaxClaimValid) {
            setIsMaxClaimValid(false);
        }

        const isSubmitAvailable =
            _isNameValid &&
            _isDescriptionValid &&
            _isCityValid &&
            _isCountryValid &&
            _isEmailValid &&
            _isClaimAmountValid &&
            _isIncrementalIntervalValid &&
            _isMaxClaimValid &&
            _isCoverImageValid;

        if (!isSubmitAvailable) {
            return;
        }
        if (new BigNumber(maxClaim).lte(claimAmount)) {
            Alert.alert(
                i18n.t('failure'),
                i18n.t('claimBiggerThanMax'),
                [{ text: 'OK' }],
                { cancelable: false }
            );
            return;
        }
        if (new BigNumber(claimAmount).eq(0)) {
            Alert.alert(
                i18n.t('failure'),
                i18n.t('claimNotZero'),
                [{ text: 'OK' }],
                { cancelable: false }
            );
            return;
        }
        if (new BigNumber(maxClaim).eq(0)) {
            Alert.alert(
                i18n.t('failure'),
                i18n.t('maxNotZero'),
                [{ text: 'OK' }],
                { cancelable: false }
            );
            return;
        }

        const decimals = new BigNumber(10).pow(config.cUSDDecimals);
        let txReceipt = null;
        let communityAddress = null;

        try {
            setSending(true);
            const contractParams = {
                claimAmount: new BigNumber(
                    formatInputAmountToTransfer(claimAmount)
                )
                    .multipliedBy(decimals)
                    .toString(),
                maxClaim: new BigNumber(formatInputAmountToTransfer(maxClaim))
                    .multipliedBy(decimals)
                    .toString(),
                baseInterval: parseInt(baseInterval),
                incrementInterval:
                    parseInt(incrementInterval, 10) * incrementalIntervalUnit,
            };
            let privateParamsIfAvailable = {};
            if (visibility === 'private') {
                txReceipt = await deployPrivateCommunity();
                if (txReceipt === undefined) {
                    return;
                }
                communityAddress = txReceipt.contractAddress;
                privateParamsIfAvailable = {
                    contractAddress: communityAddress,
                    txReceipt,
                };
            }

            const apiRequestResult = await Api.upload.uploadImage(
                coverImage,
                imageTargets.COVER
            );

            if (apiRequestResult) {
                const communityDetails: CommunityCreationAttributes = {
                    requestByAddress: userAddress,
                    name,
                    description,
                    language: userLanguage,
                    currency,
                    city,
                    country,
                    gps: {
                        latitude:
                            gpsLocation!.coords.latitude +
                            config.locationErrorMargin,
                        longitude:
                            gpsLocation!.coords.longitude +
                            config.locationErrorMargin,
                    },
                    email,
                    coverMediaId: apiRequestResult.data.data.id,
                    contractParams,
                    ...privateParamsIfAvailable,
                };

                const communityApiRequestResult = await Api.community.create(
                    communityDetails
                );
                if (communityApiRequestResult) {
                    await updateCommunityInfo(
                        communityApiRequestResult.publicId,
                        dispatch
                    );
                    dispatch(setUserIsCommunityManager(true));
                }
            } else {
                Alert.alert(
                    i18n.t('failure'),
                    i18n.t('errorCreatingCommunity'),
                    [{ text: 'OK' }],
                    { cancelable: false }
                );
                setSending(false);
            }
        } catch (e) {
            Sentry.Native.captureException(e);
            Alert.alert(
                i18n.t('failure'),
                i18n.t('errorCreatingCommunity'),
                [{ text: 'OK' }],
                { cancelable: false }
            );
            setSending(false);
        }
    };

    const enableGPSLocation = async () => {
        setIsEnablingGPS(true);
        try {
            const { status } = await Location.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    i18n.t('failure'),
                    i18n.t('errorGettingGPSLocation'),
                    [{ text: 'OK' }],
                    { cancelable: false }
                );
                return;
            }

            const loc = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Low,
            });
            setGpsLocation(loc);
            setIsEnabledGPS(true);
        } catch (e) {
            Alert.alert(
                i18n.t('failure'),
                i18n.t('errorGettingGPSLocation'),
                [{ text: 'OK' }],
                { cancelable: false }
            );
        } finally {
            setIsEnablingGPS(false);
        }
    };

    const renderAvailableCountries = () => {
        const availableCountryISO: string[] = [];
        for (const [key] of Object.entries(countries)) {
            availableCountryISO.push(key);
        }
        setFullCountryList(availableCountryISO);
    };

    const renderAvailableCurrencies = () => {
        const currencyResult: string[] = [];
        for (const [key] of Object.entries(currencies)) {
            currencyResult.push(key);
        }
        setFullCurrencyList(currencyResult);
    };

    const pickImage = async (
        cb: Dispatch<React.SetStateAction<string>>,
        cbv: Dispatch<React.SetStateAction<boolean>>
    ) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.cancelled) {
            cb(result.uri);
            cbv(true);
        }
    };

    const renderCurrencyContent = () => (
        <View
            style={{
                padding: 20,
                height: Dimensions.get('screen').height * 0.9,
            }}
        >
            <Searchbar
                placeholder={i18n.t('search')}
                style={styles.searchBarContainer}
                autoFocus
                inputStyle={{
                    marginLeft: -14,
                }}
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

    const renderFrequency = () => (
        <View
            style={{
                height: 120,
                paddingLeft: 8,
                marginBottom: 22,
            }}
        >
            <RadioButton.Group
                onValueChange={(value) => {
                    setBaseInterval(value);
                    modalizeFrequencyRef.current?.close();
                }}
                value={baseInterval}
            >
                <RadioButton.Item label={i18n.t('daily')} value="86400" />
                <RadioButton.Item label={i18n.t('weekly')} value="604800" />
            </RadioButton.Group>
        </View>
    );

    const renderIncrementalFrequency = () => (
        <View
            style={{
                height: 160,
                marginBottom: 22,
                paddingLeft: 8,
            }}
        >
            <RadioButton.Group
                onValueChange={(value) => {
                    setIncrementalIntervalUnit(Number(value));
                    modalizeClaimImcrementRef.current?.close();
                }}
                value={incrementalIntervalUnit.toString()}
            >
                <RadioButton.Item label={i18n.t('minutes')} value="60" />
                <RadioButton.Item label={i18n.t('hours')} value="3600" />
                <RadioButton.Item label={i18n.t('days')} value="86400" />
            </RadioButton.Group>
        </View>
    );

    const renderCountries = () => (
        <View
            style={{
                padding: 20,
                height: Dimensions.get('screen').height * 0.9,
            }}
        >
            <Searchbar
                placeholder={i18n.t('search')}
                style={styles.searchBarContainer}
                autoFocus
                inputStyle={{
                    marginLeft: -14,
                }}
                clearIcon={(p) => (
                    <IconButton
                        icon="close"
                        onPress={() => {
                            setSearchCountryQuery('');
                            setSearchCountryISOResult([]);
                            setTooManyResultForQuery(false);
                            setShowingResults(false);
                        }}
                    />
                )}
                onChangeText={(e) => {
                    if (e.length === 0 && showingResults) {
                        setSearchCountryISOResult([]);
                        setShowingResults(false);
                    }
                    setSearchCountryQuery(e);
                }}
                value={searchCountryQuery}
                onEndEditing={handleSearchCountry}
            />

            {renderSearchCountryResult()}
        </View>
    );

    const renderVisibilities = () => (
        <View
            style={{
                paddingLeft: 8,
                height: 120,
                marginBottom: 22,
            }}
        >
            <RadioButton.Group
                onValueChange={(value) => {
                    setVisibility(value);
                    modalizeVisibilityRef.current?.close();
                }}
                value={visibility}
            >
                <RadioButton.Item label={i18n.t('public')} value="public" />
                <RadioButton.Item label={i18n.t('private')} value="private" />
            </RadioButton.Group>
        </View>
    );

    const handleSearchCountry = (
        e: React.BaseSyntheticEvent<TextInputEndEditingEventData>
    ) => {
        if (tooManyResultForQuery) {
            setTooManyResultForQuery(false);
        }
        const countriesResult: string[] = [];
        for (const [key, value] of Object.entries(countries)) {
            if (value.name.indexOf(searchCountryQuery) !== -1) {
                countriesResult.push(key);
            }
        }

        if (countriesResult.length > 7) {
            setTooManyResultForQuery(true);
        } else {
            setSearchCountryISOResult(countriesResult);
            setShowingResults(true);
        }
    };

    const handleSelectCountry = (countryISO: string) => {
        setCountry(countryISO);
        modalizeCountryRef.current?.close();
        setSearchCountryQuery('');
        setSearchCountryISOResult([]);
    };

    const renderItemCountryQuery = ({ item }: { item: string }) => (
        <TouchableOpacity onPress={() => handleSelectCountry(item)}>
            <View style={styles.itemContainer}>
                <Text
                    style={styles.itemTitle}
                >{`${countries[item].emoji} ${countries[item].name}`}</Text>
                {item === country && (
                    <Icon
                        name="check"
                        color={ipctColors.greenishTeal}
                        size={22}
                    />
                )}
            </View>
        </TouchableOpacity>
    );

    const renderSearchCountryResult = () => {
        if (searchCountryQuery.length === 0) {
            return (
                <FlatList
                    data={fullCountryList}
                    renderItem={renderItemCountryQuery}
                    keyExtractor={(item) => item}
                />
            );
        } else {
            if (setSearchCountryISOResult.length > 0) {
                return (
                    <FlatList
                        data={searchCountryISOResult}
                        renderItem={renderItemCountryQuery}
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
        modalizeCurrencyRef.current?.close();
        setSearchCurrency('');
        setSearchCurrencyResult([]);
    };

    const renderItemCurrencyQuery = ({ item }: { item: string }) => (
        <TouchableOpacity onPress={() => handleSelectCurrency(item)}>
            <View style={styles.itemContainer}>
                <Text
                    style={styles.itemTitle}
                >{`[${currencies[item].symbol}] ${currencies[item].name}`}</Text>
                {item === currency && (
                    <Icon
                        name="check"
                        color={ipctColors.greenishTeal}
                        size={22}
                    />
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

    const renderCreateCommunityAlert = () => (
        <View style={styles.createCommunityAlert}>
            <EIcon
                name="info-with-circle"
                size={18}
                color={ipctColors.blueRibbon}
                style={{ marginLeft: 26 }}
            />

            <Text
                style={[
                    styles.createCommunityDescription,
                    { flexWrap: 'wrap', marginHorizontal: 34 },
                ]}
            >
                {i18n.t('createCommunityAlert')}
            </Text>
            <TouchableOpacity
                onPress={() => setIsAlertVisible(!isAlertVisible)}
            >
                <Icon
                    name="close"
                    size={18}
                    color={ipctColors.almostBlack}
                    style={{ marginRight: 26 }}
                />
            </TouchableOpacity>
        </View>
    );

    return (
        <>
            <KeyboardAvoidingView
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
                behavior="padding"
                enabled
                keyboardVerticalOffset={140}
            >
                <ScrollView>
                    {isAlertVisible && renderCreateCommunityAlert()}
                    <View style={styles.container}>
                        <Headline style={styles.communityDetailsHeadline}>
                            {i18n.t('communityDetails')}
                        </Headline>
                        <Text style={styles.createCommunityDescription}>
                            {i18n.t('communityDescriptionLabel')}
                        </Text>
                        <View>
                            <View style={{ marginTop: 28 }}>
                                <Input
                                    style={styles.inputTextField}
                                    label={i18n.t('communityName')}
                                    value={name}
                                    maxLength={32}
                                    onChangeText={(value) => setName(value)}
                                    onEndEditing={() =>
                                        setIsNameValid(name.length > 0)
                                    }
                                />
                                {!isNameValid && (
                                    <HelperText
                                        type="error"
                                        padding="none"
                                        visible
                                        style={styles.errorText}
                                    >
                                        {i18n.t('communityNameRequired')}
                                    </HelperText>
                                )}
                            </View>
                            {coverImage ? (
                                <View style={{ flex: 1 }}>
                                    <Image
                                        style={{
                                            height: 331,
                                            width: '100%',
                                            borderRadius: 12,
                                            marginVertical: 22,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                        source={{ uri: coverImage }}
                                    />
                                    <CloseStorySvg
                                        style={{
                                            position: 'absolute',
                                            top: 38,
                                            right: 14,
                                        }}
                                        onPress={() => {
                                            setCoverImage('');
                                        }}
                                    />
                                </View>
                            ) : (
                                <View
                                    style={[
                                        { marginTop: 12 },
                                        styles.uploadContainer,
                                    ]}
                                >
                                    <View
                                        style={{
                                            flexDirection: 'column',
                                        }}
                                    >
                                        <Headline
                                            style={
                                                styles.communityDetailsHeadline
                                            }
                                        >
                                            {i18n.t('changeCoverImage')}
                                        </Headline>
                                        <Text
                                            style={[
                                                { color: '#73839D' },
                                                styles.createCommunityDescription,
                                            ]}
                                        >
                                            Min. 784px by 784px
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.uploadBtn}
                                        onPress={() =>
                                            pickImage(
                                                setCoverImage,
                                                setIsCoverImageValid
                                            )
                                        }
                                    >
                                        <Text
                                            style={{
                                                color: '#333239',
                                                fontFamily: 'Inter-Regular',
                                                fontSize: 15,
                                                lineHeight: 28,
                                            }}
                                        >
                                            Upload
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                            {profileImage ? (
                                <View style={styles.uploadFilledContainer}>
                                    <CloseStorySvg
                                        style={{
                                            position: 'absolute',
                                            top: 14,
                                            right: 14,
                                        }}
                                        onPress={() => {
                                            setProfileImage('');
                                        }}
                                    />
                                    <Image
                                        style={{
                                            height: 80,
                                            width: 80,
                                            borderRadius: 40,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                        source={{ uri: profileImage }}
                                    />
                                </View>
                            ) : (
                                <View style={styles.uploadContainer}>
                                    <View
                                        style={{
                                            flexDirection: 'column',
                                        }}
                                    >
                                        <Headline
                                            style={
                                                styles.communityDetailsHeadline
                                            }
                                        >
                                            {i18n.t('changeProfileImage')}
                                        </Headline>
                                        <Text
                                            style={[
                                                { color: '#73839D' },
                                                styles.createCommunityDescription,
                                            ]}
                                        >
                                            Min. 300px by 300px
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.uploadBtn}
                                        onPress={() =>
                                            pickImage(
                                                setProfileImage,
                                                setIsProfileImageValid
                                            )
                                        }
                                    >
                                        <Text
                                            style={{
                                                color: '#333239',
                                                fontFamily: 'Inter-Regular',
                                                fontSize: 15,
                                                lineHeight: 28,
                                            }}
                                        >
                                            Upload
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                            <Text
                                style={[
                                    { color: '#73839D', marginBottom: 16 },
                                    styles.createCommunityDescription,
                                ]}
                            >
                                {i18n.t('communityPicsImportance')}
                            </Text>

                            {/* TODO: Community Logo will be available in upcomming release */}
                            {/* {communityLogo ? (
                                <View style={styles.uploadFilledContainer}>
                                    <Image
                                        style={{
                                            height: 80,
                                            width: 80,
                                            borderRadius: 40,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                        source={{ uri: communityLogo }}
                                    />
                                    <CloseStorySvg
                                        style={{
                                            position: 'absolute',
                                            top: 14,
                                            right: 14,
                                        }}
                                        onPress={() => {
                                            setCommunityLogo('');
                                        }}
                                    />
                                </View>
                            ) : (
                                <View style={styles.uploadContainer}>
                                    <View
                                        style={{
                                            flexDirection: 'column',
                                        }}
                                    >
                                        <Headline
                                            style={
                                                styles.communityDetailsHeadline
                                            }
                                        >
                                            {i18n.t('changeLogoImage')}
                                        </Headline>
                                        <Text
                                            style={[
                                                { color: '#73839D' },
                                                styles.createCommunityDescription,
                                            ]}
                                        >
                                            Min. 160px by 160px - Optional
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.uploadBtn}
                                        onPress={() =>
                                            pickImage(
                                                setCommunityLogo,
                                                setIsCommunityLogoValid
                                            )
                                        }
                                    >
                                        <Text
                                            style={{
                                                color: '#333239',
                                                fontFamily: 'Inter-Regular',
                                                fontSize: 15,
                                                lineHeight: 28,
                                            }}
                                        >
                                            Upload
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )} */}
                            <View style={{ marginTop: 16, minHeight: 115 }}>
                                <Input
                                    style={[
                                        { minHeight: 115 },
                                        styles.inputTextField,
                                    ]}
                                    label={i18n.t('shortDescription')}
                                    value={description}
                                    maxLength={1024}
                                    onChangeText={(value) =>
                                        setDescription(value)
                                    }
                                    onEndEditing={() =>
                                        setIsDescriptionValid(
                                            description.length > 0
                                        )
                                    }
                                    multiline
                                    numberOfLines={6}
                                />
                            </View>
                            {!isDescriptionValid && (
                                <HelperText
                                    type="error"
                                    padding="none"
                                    visible
                                    style={styles.errorText}
                                >
                                    {i18n.t('communityDescriptionRequired')}
                                </HelperText>
                            )}

                            <View style={{ marginTop: 28 }}>
                                <Input
                                    style={styles.inputTextField}
                                    label={i18n.t('city')}
                                    value={city}
                                    maxLength={32}
                                    onChangeText={(value) => setCity(value)}
                                    onEndEditing={() =>
                                        setIsCityValid(city.length > 0)
                                    }
                                />
                                {!isCityValid && (
                                    <HelperText
                                        type="error"
                                        visible
                                        padding="none"
                                        style={styles.errorText}
                                    >
                                        {i18n.t('cityRequired')}
                                    </HelperText>
                                )}
                            </View>

                            <View style={{ marginTop: 28 }}>
                                <Select
                                    label={i18n.t('country')}
                                    value={
                                        country.length > 0
                                            ? `${countries[country].emoji} ${countries[country].name}`
                                            : 'Select Country'
                                    }
                                    onPress={() =>
                                        modalizeCountryRef.current?.open()
                                    }
                                />
                                {!isCountryValid && (
                                    <HelperText
                                        type="error"
                                        padding="none"
                                        visible
                                        style={styles.errorText}
                                    >
                                        {i18n.t('countryRequired')}
                                    </HelperText>
                                )}
                            </View>
                            {gpsLocation === undefined ? (
                                <View>
                                    <Button
                                        mode="contained"
                                        style={[
                                            styles.gpsBtn,
                                            { paddingVertical: 0 },
                                        ]}
                                        onPress={() => enableGPSLocation()}
                                        loading={isEnablingGPS}
                                        uppercase={false}
                                    >
                                        <Text
                                            style={[
                                                { color: ipctColors.white },
                                                styles.gpsBtnText,
                                            ]}
                                        >
                                            {i18n.t('getGPSLocation')}
                                        </Text>
                                    </Button>
                                    {!isEnabledGPS && (
                                        <HelperText
                                            type="error"
                                            padding="none"
                                            visible
                                            style={styles.errorText}
                                        >
                                            {i18n.t('enablingGPSRequired')}
                                        </HelperText>
                                    )}
                                </View>
                            ) : (
                                <TouchableOpacity
                                    style={[
                                        {
                                            backgroundColor: '#E9EDF4',
                                            borderWidth: 0,
                                        },
                                        styles.gpsBtn,
                                    ]}
                                >
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignSelf: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Icon
                                            name="check-circle-outline"
                                            size={22}
                                            color={ipctColors.greenishTeal}
                                        />
                                        <Text
                                            style={[
                                                {
                                                    color: ipctColors.darBlue,
                                                    marginLeft: 10,
                                                },
                                                styles.gpsBtnText,
                                            ]}
                                        >
                                            {i18n.t('validCoordinates')}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                            <View>
                                <Input
                                    style={styles.inputTextField}
                                    label={i18n.t('email')}
                                    value={email}
                                    maxLength={64}
                                    keyboardType="email-address"
                                    onChangeText={(value) => setEmail(value)}
                                    onEndEditing={() =>
                                        setIsEmailValid(validateEmail(email))
                                    }
                                />
                                {!isEmailValid && (
                                    <HelperText
                                        type="error"
                                        padding="none"
                                        visible
                                        style={styles.errorText}
                                    >
                                        {i18n.t('emailRequired')}
                                    </HelperText>
                                )}
                            </View>
                            <View style={{ marginTop: 28 }}>
                                <Select
                                    label={i18n.t('currency')}
                                    value={currencies[currency].name}
                                    onPress={() =>
                                        modalizeCurrencyRef.current?.open()
                                    }
                                />
                            </View>
                        </View>
                        {!isEditable && (
                            <>
                                <Headline
                                    style={[
                                        { marginTop: 50 },
                                        styles.communityDetailsHeadline,
                                    ]}
                                >
                                    {i18n.t('contractDetails')}
                                </Headline>
                                <Text style={styles.createCommunityDescription}>
                                    {i18n.t('contractDescriptionLabel')}
                                </Text>

                                <View>
                                    <View style={{ marginTop: 28 }}>
                                        <Input
                                            style={styles.inputTextField}
                                            label={i18n.t('claimAmount')}
                                            value={claimAmount}
                                            placeholder="$0"
                                            onChangeText={(value) =>
                                                setClaimAmount(value)
                                            }
                                            onEndEditing={() =>
                                                setIsClaimAmountValid(
                                                    claimAmount.length > 0 &&
                                                        /^\d*[\.\,]?\d*$/.test(
                                                            claimAmount
                                                        )
                                                )
                                            }
                                        />
                                        {!isClaimAmountValid && (
                                            <HelperText
                                                type="error"
                                                padding="none"
                                                visible
                                                style={styles.errorText}
                                            >
                                                {i18n.t('claimAmountRequired')}
                                            </HelperText>
                                        )}
                                    </View>
                                    {claimAmount.length > 0 && (
                                        <Text
                                            style={[
                                                { marginTop: 42 },
                                                styles.aroundCurrencyValue,
                                            ]}
                                        >
                                            {i18n.t('aroundValue', {
                                                amount: amountToCurrency(
                                                    new BigNumber(
                                                        claimAmount.replace(
                                                            /,/g,
                                                            '.'
                                                        )
                                                    ).multipliedBy(
                                                        new BigNumber(10).pow(
                                                            config.cUSDDecimals
                                                        )
                                                    ),
                                                    currency,
                                                    exchangeRates
                                                ),
                                            })}
                                        </Text>
                                    )}
                                </View>
                                <View style={{ marginTop: 28 }}>
                                    <Select
                                        label={i18n.t('frequency')}
                                        value={
                                            baseInterval === '86400'
                                                ? i18n.t('daily')
                                                : i18n.t('weekly')
                                        }
                                        onPress={() =>
                                            modalizeFrequencyRef.current?.open()
                                        }
                                    />
                                </View>
                                <View style={{ marginTop: 28 }}>
                                    <Input
                                        style={styles.inputTextField}
                                        label={i18n.t(
                                            'totalClaimPerBeneficiary'
                                        )}
                                        value={maxClaim}
                                        placeholder="$0"
                                        keyboardType="numeric"
                                        onChangeText={(value) =>
                                            setMaxClaim(value)
                                        }
                                        onEndEditing={() =>
                                            setIsMaxClaimValid(
                                                maxClaim.length > 0 &&
                                                    /^\d*[\.\,]?\d*$/.test(
                                                        maxClaim
                                                    )
                                            )
                                        }
                                    />
                                    {!isMaxClaimValid && (
                                        <HelperText
                                            type="error"
                                            padding="none"
                                            visible
                                            style={styles.errorText}
                                        >
                                            {i18n.t('maxClaimAmountRequired')}
                                        </HelperText>
                                    )}
                                    {maxClaim.length > 0 && (
                                        <Text
                                            style={[
                                                { marginTop: 14 },
                                                styles.aroundCurrencyValue,
                                            ]}
                                        >
                                            {i18n.t('aroundValue', {
                                                amount: amountToCurrency(
                                                    new BigNumber(
                                                        maxClaim.replace(
                                                            /,/g,
                                                            '.'
                                                        )
                                                    ).multipliedBy(
                                                        new BigNumber(10).pow(
                                                            config.cUSDDecimals
                                                        )
                                                    ),
                                                    currency,
                                                    exchangeRates
                                                ),
                                            })}
                                        </Text>
                                    )}
                                </View>
                                <Text
                                    style={[
                                        styles.createCommunityDescription,
                                        {
                                            marginTop: 22,
                                            fontFamily: 'Manrope-Bold',
                                        },
                                    ]}
                                >
                                    {i18n.t('contractIncrementTitle')}
                                </Text>
                                <View
                                    style={{
                                        marginTop: 8,
                                        flex: 2,
                                        flexDirection: 'row',
                                    }}
                                >
                                    <View style={{ flex: 1, marginRight: 10 }}>
                                        <Input
                                            style={styles.inputTextField}
                                            value={incrementInterval}
                                            placeholder="0"
                                            keyboardType="numeric"
                                            onChangeText={(value) =>
                                                setIncrementalInterval(value)
                                            }
                                            onEndEditing={() =>
                                                setIsIncrementalIntervalValid(
                                                    incrementInterval.length > 0
                                                )
                                            }
                                        />
                                        {!isIncrementalIntervalValid && (
                                            <HelperText
                                                type="error"
                                                padding="none"
                                                visible
                                                style={styles.errorText}
                                            >
                                                {i18n.t(
                                                    'incrementalIntervalRequired'
                                                )}
                                            </HelperText>
                                        )}
                                    </View>
                                    <View style={{ flex: 1, marginLeft: 10 }}>
                                        <Select
                                            value={
                                                // TODO: Refactor
                                                incrementalIntervalUnit === 60
                                                    ? i18n.t('minutes')
                                                    : incrementalIntervalUnit ===
                                                      3600
                                                    ? i18n.t('hours')
                                                    : i18n.t('days')
                                            }
                                            onPress={() =>
                                                modalizeClaimImcrementRef.current?.open()
                                            }
                                        />
                                    </View>
                                </View>
                                <View style={{ marginTop: 28 }}>
                                    <Select
                                        label={i18n.t('visibility')}
                                        value={
                                            visibility === 'public'
                                                ? i18n.t('public')
                                                : i18n.t('private')
                                        }
                                        onPress={() =>
                                            modalizeVisibilityRef.current?.open()
                                        }
                                    />
                                </View>
                            </>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            <Portal>
                <Modalize
                    ref={modalizeCountryRef}
                    HeaderComponent={renderHeader(
                        i18n.t('country'),
                        modalizeCountryRef,
                        () => setSearchCountryQuery('')
                    )}
                >
                    {renderCountries()}
                </Modalize>
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
                    ref={modalizeFrequencyRef}
                    HeaderComponent={renderHeader(
                        i18n.t('frequency'),
                        modalizeFrequencyRef
                    )}
                    adjustToContentHeight
                >
                    {renderFrequency()}
                </Modalize>
                <Modalize
                    ref={modalizeClaimImcrementRef}
                    HeaderComponent={renderHeader(
                        i18n.t('incrementalFrequency'),
                        modalizeClaimImcrementRef
                    )}
                    adjustToContentHeight
                >
                    {renderIncrementalFrequency()}
                </Modalize>
                <Modalize
                    ref={modalizeVisibilityRef}
                    HeaderComponent={renderHeader(
                        i18n.t('visibility'),
                        modalizeVisibilityRef
                    )}
                    adjustToContentHeight
                >
                    {renderVisibilities()}
                </Modalize>
            </Portal>
        </>
    );
}
CreateCommunityScreen.navigationOptions = () => {
    return {
        headerLeft: () => <BackSvg />,
        headerTitle: i18n.t('applyCommunity'), // editing ? i18n.t('edit') : i18n.t('create'),
        headerTitleStyle: {
            fontFamily: 'Manrope-Bold',
            fontSize: 22,
            lineHeight: 28,
            color: '#333239',
        },
    };
};

const styles = StyleSheet.create({
    cardContent: {
        marginLeft: 30,
        marginRight: 30,
    },
    inputTextFieldLabel: {
        marginHorizontal: 10,
        color: 'grey',
        fontSize: 15,
        fontFamily: 'Gelion-Regular',
    },
    inputTextField: {
        fontFamily: 'Gelion-Regular',
        backgroundColor: 'transparent',
        paddingHorizontal: 0,
    },
    container: {
        marginHorizontal: 20,
        marginBottom: 20,
        marginTop: 16,
    },
    //
    textNote: {
        // color: 'grey',
        fontFamily: 'Gelion-Regular',
    },
    communityName: {
        fontSize: 25,
        fontFamily: 'Gelion-Bold',
        color: 'white',
    },
    communityLocation: {
        fontSize: 20,
        color: 'white',
    },
    picker: {
        height: 50,
        width: '100%',
        fontFamily: 'Gelion-Regular',
    },
    pickerBorder: {
        margin: 10,
        borderStyle: 'solid',
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 5,
    },
    imageCover: {
        flex: 1,
        flexDirection: 'column',
        resizeMode: 'cover',
        justifyContent: 'flex-end',
        width: '100%',
        height: 180,
    },
    aroundCurrencyValue: {
        position: 'absolute',
        marginHorizontal: 10,
        right: 0,
        fontFamily: 'Inter-Regular',
        fontSize: 12,
        lineHeight: 20,
        color: ipctColors.regentGray,
    },
    communityDetailsHeadline: {
        fontFamily: 'Manrope-Bold',
        fontSize: 18,
        lineHeight: 28,
    },
    createCommunityDescription: {
        fontFamily: 'Inter-Regular',
        fontSize: 15,
        lineHeight: 24,
    },
    uploadContainer: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: 24,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    uploadFilledContainer: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E9EDF4',
        paddingVertical: 18.1,
    },
    uploadBtn: {
        width: 98,
        height: 44,
        paddingHorizontal: 23,
        paddingVertical: 8,
        backgroundColor: '#E9EDF4',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    gpsBtn: {
        width: '100%',
        height: 44,
        marginVertical: 16,
        paddingVertical: 8,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginBottom: 24,
    },
    gpsBtnText: {
        fontFamily: 'Inter-Regular',
        fontSize: 15,
        lineHeight: 28,
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
    searchBarContainer: {
        borderColor: ipctColors.borderGray,
        borderWidth: 1,
        borderStyle: 'solid',
        shadowRadius: 0,
        elevation: 0,
        borderRadius: 6,
    },
    createCommunityAlert: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
        height: 80,
        width: '90%',
        marginHorizontal: 20,
        marginTop: 20,
        borderColor: ipctColors.blueRibbon,
        borderRadius: 8,
        borderWidth: 2,
        borderStyle: 'solid',
        paddingTop: 16,
    },
    errorText: {
        fontFamily: 'Inter',
        fontSize: 12,
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: 20,
        textAlign: 'left',
    },
});

export default CreateCommunityScreen;
