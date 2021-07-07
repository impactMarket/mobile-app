/* eslint handle-callback-err: "warn" */
import { useNavigation } from '@react-navigation/native';
import countriesJSON from 'assets/countries.json';
import currenciesJSON from 'assets/currencies.json';
import i18n from 'assets/i18n';
import BigNumber from 'bignumber.js';
import Button from 'components/core/Button';
import renderHeader from 'components/core/HeaderBottomSheetTitle';
import Input from 'components/core/Input';
import Select from 'components/core/Select';
import CloseStorySvg from 'components/svg/CloseStorySvg';
import SuccessSvg from 'components/svg/SuccessSvg';
import WarningRedTriangle from 'components/svg/WarningRedTriangle';
import BackSvg from 'components/svg/header/BackSvg';
import Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Screens, celoNetwork } from 'helpers/constants';
import {
    formatInputAmountToTransfer,
    amountToCurrency,
} from 'helpers/currency';
import { validateEmail, updateCommunityInfo } from 'helpers/index';
import {
    setCommunityMetadata,
    setUserIsCommunityManager,
    setUserMetadata,
} from 'helpers/redux/actions/user';
import {
    CommunityCreationAttributes,
    CommunityEditionAttributes,
} from 'helpers/types/endpoints';
import { IRootState } from 'helpers/types/state';
import React, {
    useState,
    useEffect,
    useRef,
    useLayoutEffect,
    Dispatch,
} from 'react';
import { Trans } from 'react-i18next';
import {
    StyleSheet,
    ScrollView,
    Alert,
    View,
    Image,
    FlatList,
    TouchableOpacity,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Modalize } from 'react-native-modalize';
import {
    Card,
    Portal as RNPortal,
    Button as RNButton,
    Modal,
    Paragraph,
    Headline,
    RadioButton,
    HelperText,
    Text,
    Searchbar,
} from 'react-native-paper';
import EIcon from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import WebView from 'react-native-webview';
import { batch, useDispatch, useSelector } from 'react-redux';
import * as Sentry from 'sentry-expo';
import Api from 'services/api';
import CacheStore from 'services/cacheStore';
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
    // const store = useStore();
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
    const user = useSelector((state: IRootState) => state.user.metadata);
    const userIsManager = useSelector(
        (state: IRootState) => state.user.community.isManager
    );
    const userCommunity = useSelector(
        (state: IRootState) => state.user.community.metadata
    );
    const avatar = useSelector(
        (state: IRootState) => state.user.metadata.avatar
    );
    const exchangeRates = useSelector(
        (state: IRootState) => state.app.exchangeRates
    );
    const kit = useSelector((state: IRootState) => state.app.kit);
    const navigation = useNavigation();
    const initialData = {
        name: userCommunity?.name,
        description: userCommunity?.description,
        city: userCommunity?.city,
        country: userCommunity?.country,
        email: userCommunity?.email,
        coverImage: userCommunity?.cover?.url,
    };
    const [sending, setSending] = useState(false);
    const [sendingSuccess, setSendingSuccess] = useState(false);
    const [gpsLocation, setGpsLocation] = useState<Location.LocationObject>();
    const [isNameValid, setIsNameValid] = useState(true);
    const [isEditable, setIsEditable] = useState(!!userCommunity);
    const [genericErrorTitle, setGenericErrorTitle] = useState(
        'genericErrorTitle'
    );
    const [genericErrorContent, setGenericErrorContent] = useState(
        'genericErrorContent'
    );
    const [isCoverImageValid, setIsCoverImageValid] = useState(true);
    const [isProfileImageValid, setIsProfileImageValid] = useState(true);
    // const [isCommunityLogoValid, setIsCommunityLogoValid] = useState(true);

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
    const [toggleInformativeModal, setToggleInformativeModal] = useState(false);
    const [toggleMissingFieldsModal, setToggleMissingFieldsModal] = useState(
        false
    );
    const [searchCurrency, setSearchCurrency] = useState('');
    const [fullCurrencyList, setFullCurrencyList] = useState<string[]>([]);
    const [searchCurrencyResult, setSearchCurrencyResult] = useState<string[]>(
        []
    );
    const [currency, setCurrency] = useState<string>(userCurrency);
    const [name, setName] = useState(initialData.name || '');
    const [description, setDescription] = useState(
        initialData.description || ''
    );
    const [city, setCity] = useState(initialData.city || '');
    const [searchCountryQuery, setSearchCountryQuery] = useState('');
    const [fullCountryList, setFullCountryList] = useState<string[]>([]);
    const [searchCountryISOResult, setSearchCountryISOResult] = useState<
        string[]
    >([]);
    const [country, setCountry] = useState(initialData.country || '');
    const [email, setEmail] = useState(initialData.email || '');
    const [coverImage, setCoverImage] = useState(initialData.coverImage || '');
    const [profileImage, setProfileImage] = useState<string>(avatar || '');
    const [isAlertVisible, setIsAlertVisible] = useState(!userCommunity);
    // const [communityLogo, setCommunityLogo] = useState('');
    const [showWeviewTicket, setShowWeviewTicket] = useState(false);
    const [showWeviewFAQ, setShowWeviewFAQ] = useState(false);

    const [
        toggleImageDimensionsModal,
        setToggleImageDimensionsModal,
    ] = useState<boolean>(false);

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
    const modalizeGenericErrorRef = useRef<Modalize>(null);
    const modalizeWebViewRef = useRef<Modalize>(null);

    enum imageTypes {
        COVER_IMAGE = 'COVER_IMAGE',
        PROFILE_IMAGE = 'PROFILE_IMAGE',
    }

    const CREATE_TICKET =
        'https://impactmarket.uvdesk.com/en/customer/create-ticket/';

    const FAQ_TICKET =
        'https://docs.impactmarket.com/general/others#submitting-a-ticket';

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () =>
                !showWeviewTicket || showWeviewFAQ ? (
                    <SubmitCommunity
                        submit={
                            !isEditable
                                ? submitNewCommunity
                                : submitEditCommunity
                        }
                        submitting={sending}
                    />
                ) : null,
        });
        // TODO: this next line should change though.
    }, [
        navigation,
        coverImage,
        profileImage,
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
        showWeviewFAQ,
        showWeviewTicket,
    ]);

    useEffect(() => {
        const setCountryAndCurrencyBasedOnPhoneNumber = () => {
            for (const [key, value] of Object.entries(countries)) {
                if (
                    value.phone ===
                    userPhoneNumber.slice(1, value.phone.length + 1)
                ) {
                    setCountry(key);
                    if (value.currency in currencies) {
                        setCurrency(value.currency);
                    } else {
                        setCurrency('USD');
                    }
                    break;
                }
            }
        };
        setCountryAndCurrencyBasedOnPhoneNumber();
        renderAvailableCountries();
        renderAvailableCurrencies();
        isEditable &&
            navigation.setOptions({
                headerTitle: i18n.t('editCommunity'),
            });
    }, []);

    useEffect(() => {
        if (userCommunity !== undefined && userIsManager === true) {
            setIsEditable(true);
        }
    }, [userIsManager, userCommunity]);

    const handleGenericHelpTexts = ({
            title,
            content,
        }: {
            title: string;
            content: string;
        }) => {
            setGenericErrorTitle(title);
            setGenericErrorContent(content);
            modalizeGenericErrorRef.current?.open();
        },
        deployPrivateCommunity = async () => {
            const decimals = new BigNumber(10).pow(config.cUSDDecimals),
                CommunityContract = new kit.web3.eth.Contract(
                    CommunityContractABI as any
                ),
                txObject = await CommunityContract.deploy({
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
                            parseInt(incrementInterval, 10) *
                            incrementalIntervalUnit
                        ).toString(),
                        celoNetwork.noAddress,
                        config.cUSDContract,
                        userAddress,
                    ],
                }),
                // exception is handled outside
                // receipt as undefined is handled outside
                receipt = await celoWalletRequest(
                    userAddress,
                    celoNetwork.noAddress,
                    txObject,
                    'createcommunity',
                    kit
                );
            return receipt;
        },
        submitNewCommunity = async () => {
            const _isCoverImageValid = coverImage.length > 0;
            if (!_isCoverImageValid) {
                setIsCoverImageValid(false);
            }
            //TODO: Will be added in later version
            const _isProfileImageValid = profileImage.length > 0;
            if (!_isProfileImageValid) {
                setIsProfileImageValid(false);
            }

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
                _isCoverImageValid &&
                _isProfileImageValid;

            if (!isSubmitAvailable) {
                console.log('setToggleMissingFieldsModal 1');
                setToggleMissingFieldsModal(true);
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
            let txReceipt = null,
                communityAddress = null;

            try {
                setSending(true);
                setToggleInformativeModal(true);
                const contractParams = {
                    claimAmount: new BigNumber(
                        formatInputAmountToTransfer(claimAmount)
                    )
                        .multipliedBy(decimals)
                        .toString(),
                    maxClaim: new BigNumber(
                        formatInputAmountToTransfer(maxClaim)
                    )
                        .multipliedBy(decimals)
                        .toString(),
                    baseInterval: parseInt(baseInterval),
                    incrementInterval:
                        parseInt(incrementInterval, 10) *
                        incrementalIntervalUnit,
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

                if (profileImage.length > 0 && profileImage !== avatar) {
                    try {
                        const res = await Api.user.updateProfilePicture(
                            profileImage
                        );
                        const cachedUser = (await CacheStore.getUser())!;
                        await CacheStore.cacheUser({
                            ...cachedUser,
                            avatar: res.url,
                        });
                        dispatch(
                            setUserMetadata({
                                ...user,
                                avatar: res.url,
                            })
                        );
                    } catch (e) {
                        // TODO: block community creation if this fails, for now, lets ignore
                    }
                }

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
                    coverMediaId: 0,
                    contractParams,
                    ...privateParamsIfAvailable,
                };
                const communityApiRequestResult = await Api.community.create(
                    coverImage,
                    communityDetails
                );
                if (communityApiRequestResult.error === undefined) {
                    await updateCommunityInfo(
                        communityApiRequestResult.data.id,
                        dispatch
                    );
                    const community = await Api.community.findById(
                        communityApiRequestResult.data.id
                    );
                    if (community !== undefined) {
                        batch(() => {
                            dispatch(setCommunityMetadata(community));
                            dispatch(setUserIsCommunityManager(true));
                        });
                    }
                    setSending(false);
                    setSendingSuccess(true);
                } else {
                    Clipboard.setString(
                        communityApiRequestResult.error.toString()
                    );
                    setSending(false);
                    setSendingSuccess(false);
                }
            } catch (e) {
                Clipboard.setString(e.toString());
                Sentry.Native.captureException(e);
                setSending(false);
                setSendingSuccess(false);
                console.log({ e });
            }
        },
        submitEditCommunity = async () => {
            const _isCoverImageValid = coverImage.length > 0;
            if (!_isCoverImageValid) {
                setIsCoverImageValid(false);
            }
            //TODO: Will be added in later version
            const _isProfileImageValid = profileImage.length > 0;
            if (!_isProfileImageValid) {
                setIsProfileImageValid(false);
            }

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

            const isSubmitEditAvailable =
                _isNameValid &&
                _isDescriptionValid &&
                _isCityValid &&
                _isCountryValid &&
                _isEmailValid &&
                _isCoverImageValid &&
                _isProfileImageValid;

            if (!isSubmitEditAvailable) {
                setToggleMissingFieldsModal(true);
                return;
            }

            try {
                setSending(true);
                setToggleInformativeModal(true);

                const communityDetails: CommunityEditionAttributes = {
                        name,
                        description,
                        language: userLanguage,
                        city,
                        country,
                        email,
                        currency,
                        coverMediaId: 0,
                    },
                    communityApiRequestResult = await Api.community.edit(
                        coverImage !== initialData.coverImage
                            ? coverImage
                            : undefined,
                        communityDetails
                    );

                if (communityApiRequestResult) {
                    await updateCommunityInfo(
                        communityApiRequestResult.id,
                        dispatch
                    );

                    const community = await Api.community.findById(
                        communityApiRequestResult.id
                    );

                    if (community !== undefined) {
                        batch(() => {
                            dispatch(setCommunityMetadata(community));
                            dispatch(setUserIsCommunityManager(true));
                        });
                    }
                }
                setSending(false);
                setSendingSuccess(true);
            } catch (e) {
                Sentry.Native.captureException(e);
                setSending(false);
                setSendingSuccess(false);
                console.log({ e });
            }
        },
        enableGPSLocation = async () => {
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
        },
        renderAvailableCountries = () => {
            const availableCountryISO: string[] = [];
            for (const [key] of Object.entries(countries)) {
                availableCountryISO.push(key);
            }
            setFullCountryList(availableCountryISO);
        },
        renderAvailableCurrencies = () => {
            const currencyResult: string[] = [];
            for (const [key] of Object.entries(currencies)) {
                currencyResult.push(key);
            }
            setFullCurrencyList(currencyResult);
        },
        pickImage = async (
            cb: Dispatch<React.SetStateAction<string>>,
            cbv: Dispatch<React.SetStateAction<boolean>>,
            type: string
        ) => {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
            });

            if (!result.cancelled) {
                if (type === imageTypes.COVER_IMAGE) {
                    Image.getSize(
                        result.uri,
                        (width, height) => {
                            if (width >= 784 && height >= 784) {
                                cb(result.uri);
                                cbv(true);
                            } else {
                                setToggleImageDimensionsModal(true);
                            }
                        },
                        (error) => {
                            cb(result.uri);
                            cbv(true);
                            Sentry.Native.captureException(error);
                        }
                    );
                } else {
                    Image.getSize(
                        result.uri,
                        (width, height) => {
                            if (width >= 300 && height >= 300) {
                                cb(result.uri);
                                cbv(true);
                            } else {
                                setToggleImageDimensionsModal(true);
                            }
                        },
                        (error) => {
                            cb(result.uri);
                            cbv(true);
                            Sentry.Native.captureException(error);
                        }
                    );
                }
            }
        },
        renderCurrencyContent = () => (
            <View
                style={{
                    padding: 20,
                }}
            >
                <Searchbar
                    placeholder={i18n.t('search')}
                    style={styles.searchBarContainer}
                    autoFocus
                    inputStyle={{
                        marginLeft: -14,
                    }}
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
        ),
        renderFrequency = () => (
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
        ),
        renderIncrementalFrequency = () => (
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
        ),
        renderCountries = () => (
            <View
                style={{
                    padding: 20,
                    // height: Dimensions.get('screen').height * 0.9,
                }}
            >
                <Searchbar
                    placeholder={i18n.t('search')}
                    style={styles.searchBarContainer}
                    autoFocus
                    inputStyle={{
                        marginLeft: -14,
                    }}
                    onChangeText={(e) => {
                        if (e.length === 0 && showingResults) {
                            setSearchCountryISOResult([]);
                            setShowingResults(false);
                        }
                        handleSearchCountry(e);
                    }}
                    value={searchCountryQuery}
                />

                {renderSearchCountryResult()}
            </View>
        ),
        renderVisibilities = () => (
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
                    <RadioButton.Item
                        label={i18n.t('private')}
                        value="private"
                    />
                </RadioButton.Group>
            </View>
        ),
        handleSearchCountry = (e: string) => {
            setSearchCountryQuery(e);

            const countriesResult: string[] = [];
            for (const [key, value] of Object.entries(countries)) {
                if (value.name.indexOf(searchCountryQuery) !== -1) {
                    countriesResult.push(key);
                }
            }
            setSearchCountryISOResult(countriesResult);
            setShowingResults(true);
        },
        handleSelectCountry = (countryISO: string) => {
            setCountry(countryISO);
            modalizeCountryRef.current?.close();
            setSearchCountryQuery('');
            setSearchCountryISOResult([]);
        },
        renderItemCountryQuery = ({ item }: { item: string }) => (
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
        ),
        renderSearchCountryResult = () => {
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
        },
        handleSearchCurrency = (e: string) => {
            setSearchCurrency(e);
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

            setSearchCurrencyResult(currencyResult);
            setShowingResults(true);
        },
        handleSelectCurrency = (currency: string) => {
            setCurrency(currency);
            modalizeCurrencyRef.current?.close();
            setSearchCurrency('');
            setSearchCurrencyResult([]);
        },
        renderItemCurrencyQuery = ({ item }: { item: string }) => (
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
        ),
        renderSearchCurrencyResult = () => {
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
        },
        renderCreateCommunityAlert = () => (
            <View style={styles.createCommunityAlert}>
                <EIcon
                    name="info-with-circle"
                    size={18}
                    color={ipctColors.blueRibbon}
                    style={{ marginLeft: 26 }}
                />

                <Text
                    style={[
                        styles.createCommunityAlertDescription,
                        { flexWrap: 'wrap', marginHorizontal: 42 },
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
        ),
        renderWebview = (url: string) => {
            return (
                <WebView
                    originWhitelist={['*']}
                    source={{
                        uri: url,
                    }}
                    style={{
                        height: Dimensions.get('screen').height * 0.85,
                    }}
                />
            );
        };

    if (toggleImageDimensionsModal) {
        return (
            <RNPortal>
                <Modal visible dismissable={false}>
                    <Card
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
                                {i18n.t('modalErrorTitle')}
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
                            <WarningRedTriangle
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
                                {i18n.t('imageDimensionsNotFit')}
                            </Text>
                        </View>
                        <Button
                            modeType="gray"
                            style={{ width: '100%' }}
                            onPress={() => {
                                setToggleImageDimensionsModal(false);
                            }}
                        >
                            {i18n.t('close')}
                        </Button>
                    </Card>
                </Modal>
            </RNPortal>
        );
    }

    if (toggleMissingFieldsModal) {
        return (
            <RNPortal>
                <Modal visible dismissable={false}>
                    <Card
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
                                {i18n.t('modalErrorTitle')}
                            </Text>
                            <CloseStorySvg
                                onPress={() => {
                                    setToggleMissingFieldsModal(false);
                                    setSending(false);
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
                            <WarningRedTriangle
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
                                {i18n.t('missingFieldError')}
                            </Text>
                        </View>
                        <Button
                            modeType="gray"
                            style={{ width: '100%' }}
                            onPress={() => {
                                setSending(false);
                                setToggleMissingFieldsModal(false);
                            }}
                        >
                            {i18n.t('close')}
                        </Button>
                    </Card>
                </Modal>
            </RNPortal>
        );
    }

    if (toggleInformativeModal) {
        return (
            <RNPortal>
                <Modal visible dismissable={false}>
                    <Card style={{ marginHorizontal: 22, borderRadius: 12 }}>
                        <View
                            style={{
                                paddingVertical: 14,
                                height: sending || sendingSuccess ? 234 : 400,
                                width: '88%',
                                alignItems: 'center',
                                alignSelf: 'center',
                            }}
                        >
                            {sending ? (
                                <Image
                                    style={{
                                        height: 58,
                                        width: 58,
                                    }}
                                    source={require('../../assets/images/waitingTx.gif')}
                                />
                            ) : sendingSuccess ? (
                                <SuccessSvg />
                            ) : (
                                <>
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
                                            {i18n.t('submissionFailed')}
                                        </Text>
                                        <CloseStorySvg
                                            onPress={() => {
                                                setToggleInformativeModal(
                                                    false
                                                );
                                                setSending(false);
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
                                        }}
                                    >
                                        <WarningRedTriangle
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
                                                textAlign: 'left',
                                                marginRight: 36,
                                            }}
                                        >
                                            <Trans
                                                i18nKey="communityRequestError"
                                                components={{
                                                    webview: (
                                                        <Text
                                                            onPress={() => {
                                                                setToggleInformativeModal(
                                                                    false
                                                                );
                                                                setShowWeviewTicket(
                                                                    true
                                                                );
                                                                modalizeWebViewRef.current?.open();
                                                            }}
                                                            style={{
                                                                fontFamily:
                                                                    'Inter-Bold',
                                                                fontSize: 14,
                                                                color:
                                                                    ipctColors.blueRibbon,
                                                            }}
                                                        />
                                                    ),
                                                }}
                                            />
                                        </Text>
                                    </View>
                                </>
                            )}
                            <Text
                                style={{
                                    fontFamily: 'Inter-Regular',
                                    fontSize: 14,
                                    lineHeight: 24,
                                    color: ipctColors.almostBlack,
                                    width: '100%',
                                    marginVertical: 12,
                                    textAlign:
                                        sendingSuccess || sending
                                            ? 'center'
                                            : 'left',
                                }}
                            >
                                {sending ? (
                                    i18n.t('communityRequestSending')
                                ) : sendingSuccess ? (
                                    i18n.t('communityRequestSuccess')
                                ) : (
                                    <Trans
                                        i18nKey="communityRequestErrorDetails"
                                        components={{
                                            bold: (
                                                <Text
                                                    onPress={() => {
                                                        setToggleInformativeModal(
                                                            false
                                                        );
                                                        setShowWeviewFAQ(true);
                                                        modalizeWebViewRef.current?.open();
                                                    }}
                                                    style={{
                                                        fontFamily:
                                                            'Inter-Bold',
                                                        fontSize: 14,
                                                        color:
                                                            ipctColors.blueRibbon,
                                                    }}
                                                />
                                            ),
                                        }}
                                    />
                                )}
                            </Text>
                            <Button
                                modeType="gray"
                                style={{ width: '100%' }}
                                onPress={() => {
                                    setSending(false);
                                    setToggleInformativeModal(false);
                                    navigation.goBack();
                                    navigation.navigate(
                                        Screens.CommunityManager
                                    );
                                }}
                            >
                                {sending
                                    ? i18n.t('cancelSending')
                                    : sendingSuccess
                                    ? i18n.t('continue')
                                    : i18n.t('close')}
                            </Button>
                        </View>
                    </Card>
                </Modal>
            </RNPortal>
        );
    }

    return (
        <>
            <KeyboardAvoidingView
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
                            {coverImage.length > 0 ? (
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
                                        source={{
                                            uri: coverImage,
                                        }}
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
                                        {!isCoverImageValid && (
                                            <HelperText
                                                type="error"
                                                padding="none"
                                                visible
                                                style={styles.errorText}
                                            >
                                                {i18n.t('coverImageRequired')}
                                            </HelperText>
                                        )}
                                    </View>
                                    <TouchableOpacity
                                        style={styles.uploadBtn}
                                        onPress={() =>
                                            pickImage(
                                                setCoverImage,
                                                setIsCoverImageValid,
                                                imageTypes.COVER_IMAGE
                                            )
                                        }
                                    >
                                        <Text
                                            style={{
                                                color: '#333239',
                                                fontFamily: 'Inter-Regular',
                                                fontSize: 15,
                                                lineHeight: 16,
                                            }}
                                        >
                                            Upload
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {profileImage.length === 0 ? (
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
                                        {!isProfileImageValid && (
                                            <HelperText
                                                type="error"
                                                padding="none"
                                                visible
                                                style={styles.errorText}
                                            >
                                                {i18n.t('profileImageRequired')}
                                            </HelperText>
                                        )}
                                    </View>
                                    <TouchableOpacity
                                        style={styles.uploadBtn}
                                        onPress={() =>
                                            pickImage(
                                                setProfileImage,
                                                setIsProfileImageValid,
                                                imageTypes.PROFILE_IMAGE
                                            )
                                        }
                                    >
                                        <Text
                                            style={{
                                                color: '#333239',
                                                fontFamily: 'Inter-Regular',
                                                fontSize: 15,
                                                lineHeight: 16,
                                            }}
                                        >
                                            Upload
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                profileImage !== avatar && (
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
                                )
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
                                <View
                                    style={{
                                        marginVertical: 16,
                                        marginBottom: 24,
                                    }}
                                >
                                    <RNButton
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
                                    </RNButton>
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
                                <View
                                    style={{
                                        marginVertical: 16,
                                        marginBottom: 24,
                                    }}
                                >
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
                                                        color:
                                                            ipctColors.darBlue,
                                                        marginLeft: 10,
                                                    },
                                                    styles.gpsBtnText,
                                                ]}
                                            >
                                                {i18n.t('validCoordinates')}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
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
                                        {!email
                                            ? i18n.t('emailRequired')
                                            : i18n.t('emailInvalidFormat')}
                                    </HelperText>
                                )}
                            </View>
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
                                            help
                                            onPress={() =>
                                                handleGenericHelpTexts({
                                                    title: i18n.t(
                                                        'claimAmount'
                                                    ),
                                                    content: i18n.t(
                                                        'claimAmountHelp'
                                                    ),
                                                })
                                            }
                                            value={claimAmount}
                                            placeholder="$0"
                                            maxLength={14}
                                            keyboardType="numeric"
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
                                        help
                                        onHelpPress={() =>
                                            handleGenericHelpTexts({
                                                title: i18n.t('frequency'),
                                                content: i18n.t(
                                                    'frequencyHelp'
                                                ),
                                            })
                                        }
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
                                        help
                                        onPress={() =>
                                            handleGenericHelpTexts({
                                                title: i18n.t(
                                                    'totalClaimPerBeneficiary'
                                                ),
                                                content: i18n.t(
                                                    'totalClaimPerBeneficiaryHelp'
                                                ),
                                            })
                                        }
                                        value={maxClaim}
                                        placeholder="$0"
                                        maxLength={14}
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
                                            // help
                                            // onPress={() =>
                                            //     handleGenericHelpTexts({
                                            //         title: i18n.t(
                                            //             'timeIncrementAfterClaim'
                                            //         ),
                                            //         content: i18n.t(
                                            //             'timeIncrementAfterClaimHelp'
                                            //         ),
                                            //     })
                                            // }
                                            placeholder="0"
                                            maxLength={14}
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
                                        help
                                        onHelpPress={() =>
                                            handleGenericHelpTexts({
                                                title: i18n.t('visibility'),
                                                content: i18n.t(
                                                    'visibilityHelp'
                                                ),
                                            })
                                        }
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

            <RNPortal>
                <Modalize ref={modalizeGenericErrorRef} adjustToContentHeight>
                    <View
                        style={{
                            padding: 20,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'Manrope-Bold',
                                fontSize: 18,
                                lineHeight: 20,
                                textAlign: 'left',
                                marginBottom: 20,
                            }}
                        >
                            {genericErrorTitle}
                        </Text>
                        <Text
                            style={{
                                fontFamily: 'Inter-Regular',
                                fontSize: 14,
                                lineHeight: 20,
                                textAlign: 'left',
                            }}
                        >
                            {genericErrorContent}
                        </Text>
                    </View>
                </Modalize>
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
                <Modalize
                    ref={modalizeWebViewRef}
                    HeaderComponent={renderHeader(
                        null,
                        modalizeWebViewRef,
                        true
                    )}
                    adjustToContentHeight
                >
                    {showWeviewTicket ? (
                        <WebView
                            originWhitelist={['*']}
                            source={{
                                uri:
                                    'https://impactmarket.uvdesk.com/en/customer/create-ticket/',
                            }}
                            style={{
                                height: Dimensions.get('screen').height * 0.85,
                            }}
                        />
                    ) : (
                        <WebView
                            originWhitelist={['*']}
                            source={{
                                uri:
                                    'https://docs.impactmarket.com/general/others#submitting-a-ticket',
                            }}
                            style={{
                                height: Dimensions.get('screen').height * 0.85,
                            }}
                        />
                    )}
                </Modalize>
            </RNPortal>
        </>
    );
}
CreateCommunityScreen.navigationOptions = (isEditable: boolean) => {
    return {
        headerLeft: () => <BackSvg />,
        headerTitle: i18n.t('applyCommunity'),
        headerTitleStyle: {
            fontFamily: 'Manrope-Bold',
            fontSize: 22,
            lineHeight: 28,
            color: '#333239',
        },
        headerTitleContainerStyle: {
            left: 58,
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
        fontSize: 15,
        lineHeight: 24,
    },
    createCommunityDescription: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        lineHeight: 24,
    },
    createCommunityAlertDescription: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        lineHeight: 20,
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
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#E9EDF4',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    gpsBtn: {
        width: '100%',
        height: 44,
        paddingVertical: 8,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
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
        fontFamily: 'Inter-Regular',
        fontSize: 12,
        fontWeight: '400',
        lineHeight: 20,
        textAlign: 'left',
    },
});

export default CreateCommunityScreen;
