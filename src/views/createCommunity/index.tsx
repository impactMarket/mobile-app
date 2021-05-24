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
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { celoNetwork, imageTargets } from 'helpers/constants';
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
        coverImage: userCommunity?.cover?.url || userCommunity?.coverImage,
    };

    const [sending, setSending] = useState(false);
    const [sendingSuccess, setSendingSuccess] = useState(false);

    const [gpsLocation, setGpsLocation] = useState<Location.LocationObject>();
    const [isNameValid, setIsNameValid] = useState(true);
    const [isEditable, setIsEditable] = useState(!!userCommunity);

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
    const [toggleMissingFieldsModal, setToggleMissingFieldsModal] = useState(false);

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
    const [showWebview, setShowWebview] = useState(false);
    // setToggleInformativeModal(false);

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
            headerRight: () =>
                !showWebview ? (
                    <SubmitCommunity
                        submit={submitNewCommunity}
                        submitting={sending}
                    />
                ) : null,
        });
        // TODO: this next line should change though.
    }, [
        navigation,
        coverImage,
        profileImage,
        // communityLogo,
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
        showWebview,
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
        navigation.setOptions({
            headerTitle: i18n.t('editCommunity'),
        });
    }, []);

    useEffect(() => {
        if (userIsManager === true) {
            setIsEditable(true);
        }
    }, [userIsManager, userCommunity]);

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
            return;
        }
        //TODO: Will be added in later version
        const _isProfileImageValid = profileImage.length > 0;
        if (!_isProfileImageValid) {
            setIsProfileImageValid(false);
            return;
        }

        const _isNameValid = name.length > 0;
        if (!_isNameValid) {
            setIsNameValid(false);
            return;
        }
        const _isDescriptionValid = description.length > 0;
        if (!_isDescriptionValid) {
            setIsDescriptionValid(false);
            return;
        }
        const _isCityValid = city.length > 0;
        if (!_isCityValid) {
            setIsCityValid(false);
            return;
        }
        const _isCountryValid = country.length > 0;
        if (!_isCountryValid) {
            setIsCountryValid(false);
            return;
        }
        const _isEmailValid = validateEmail(email);
        if (!_isEmailValid) {
            setIsEmailValid(false);
            return;
        }
        if (!isEditable) {
            const _isEnabledGPS = gpsLocation !== undefined;
            if (!_isEnabledGPS) {
                setIsEnabledGPS(false);
                return;
            }
            const _isClaimAmountValid =
                claimAmount.length > 0 && /^\d*[\.\,]?\d*$/.test(claimAmount);
            if (!_isClaimAmountValid) {
                setIsClaimAmountValid(false);
                return;
            }
            const _isIncrementalIntervalValid = incrementInterval.length > 0;
            if (!_isIncrementalIntervalValid) {
                setIsIncrementalIntervalValid(false);
                return;
            }
            const _isMaxClaimValid =
                maxClaim.length > 0 && /^\d*[\.\,]?\d*$/.test(maxClaim);
            if (!_isMaxClaimValid) {
                setIsMaxClaimValid(false);
                return;
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

            if (!isEditable && !isSubmitAvailable) {
                setToggleMissingFieldsModal(true);
                return;
            }
        }

        const isSubmitEditAvailable =
            _isNameValid &&
            _isDescriptionValid &&
            _isCityValid &&
            _isCountryValid &&
            _isEmailValid &&
            _isCoverImageValid;

        if (isEditable && !isSubmitEditAvailable) {
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
        let txReceipt = null;
        let communityAddress = null;

        try {
            setSending(true);
            setToggleInformativeModal(true);
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

            if (profileImage.length > 0) {
                const res = (await Api.upload.uploadImage(
                    profileImage,
                    imageTargets.PROFILE
                )) as any;

                const cachedUser = (await CacheStore.getUser())!;
                await CacheStore.cacheUser({
                    ...cachedUser,
                    avatar: res.data.data.url as string,
                });
                dispatch(
                    setUserMetadata({ ...user, avatar: res.data.data.url })
                );
            }

            if (apiRequestResult) {
                if (userCommunity) {
                    const communityDetails: CommunityEditionAttributes = {
                        name,
                        description,
                        language: userLanguage,
                        city,
                        country,
                        email,
                        currency,
                        coverMediaId: apiRequestResult.data.data.id,
                    };

                    const communityApiRequestResult = await Api.community.edit(
                        communityDetails
                    );

                    console.log(communityApiRequestResult);

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
                        setSending(false);
                        setSendingSuccess(true);
                    } else {
                        setSending(false);
                        setSendingSuccess(false);
                    }
                } else {
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
                        setSending(false);
                        setSendingSuccess(true);
                    } else {
                        setSending(false);
                        setSendingSuccess(false);
                    }
                }
            }
        } catch (e) {
            Sentry.Native.captureException(e);
            setSending(false);
            setSendingSuccess(false);
            console.log({ e });
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
            // allowsEditing: true,
            // aspect: [1, 1],
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

    const handleSearchCountry = (e: string) => {
        setSearchCountryQuery(e);

        const countriesResult: string[] = [];
        for (const [key, value] of Object.entries(countries)) {
            if (value.name.indexOf(searchCountryQuery) !== -1) {
                countriesResult.push(key);
            }
        }
        setSearchCountryISOResult(countriesResult);
        setShowingResults(true);
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

    const handleSearchCurrency = (e: string) => {
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


    const renderWebview = () => {
        return (
            // <RNPortal>
            //     <Modal visible dismissable={false}>
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
            //     </Modal>
            // </RNPortal>
        );
    };

    if (toggleMissingFieldsModal) {
        return (            <RNPortal>
            <Modal visible dismissable={false}>
                <Card style={{ marginHorizontal: 22, borderRadius: 12 }}>
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
                        setToggleMissingFieldsModal(
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
                           textAlign: 'justify',
                           marginRight: 36,
                       }}
                   >
                       {i18n.t('missingFieldError')}
                   </Text>
               </View>
               <Button
                    modeType="gray"
                    bold
                    style={{ width: '100%' }}
                    onPress={() => {
                        setSending(false);
                        setToggleMissingFieldsModal(false);
                    }}
                >
                    {i18n.t('close')}
                </Button>
                </Card >
            </Modal>
        </RNPortal>)
    }

    if (toggleInformativeModal) {
        return (
            <RNPortal>
                <Modal visible dismissable={false}>
                    <Card style={{ marginHorizontal: 22, borderRadius: 12 }}>
                        <View
                            style={{
                                paddingVertical: 14,
                                height: sending || sendingSuccess ? 220 : 440,
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
                                                textAlign: 'justify',
                                                marginRight: 36,
                                            }}
                                        >
                                            {i18n.t('communityRequestError')}
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
                                    marginVertical: 16,
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
                                            webview: (
                                                <Text
                                                    onPress={() => {
                                                        setToggleInformativeModal(
                                                            false
                                                        );
                                                        setShowWebview(true);
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
                                bold
                                style={{ width: '100%' }}
                                onPress={() => {
                                    setSending(false);
                                    setToggleInformativeModal(false);
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
                {showWebview ? (
                    renderWebview()
                ) : (
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
                                                    {i18n.t(
                                                        'coverImageRequired'
                                                    )}
                                                </HelperText>
                                            )}
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
                                                    lineHeight: 16,
                                                }}
                                            >
                                                Upload
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {profileImage.length > 0 ? (
                                    <View />
                                ) : (
                                    // <View style={styles.uploadFilledContainer}>
                                    //     <CloseStorySvg
                                    //         style={{
                                    //             position: 'absolute',
                                    //             top: 14,
                                    //             right: 14,
                                    //         }}
                                    //         onPress={() => {
                                    //             setProfileImage('');
                                    //         }}
                                    //     />
                                    //     <Image
                                    //         style={{
                                    //             height: 80,
                                    //             width: 80,
                                    //             borderRadius: 40,
                                    //             alignItems: 'center',
                                    //             justifyContent: 'center',
                                    //         }}
                                    //         source={{ uri: profileImage }}
                                    //     />
                                    // </View>
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
                                                    {i18n.t(
                                                        'profileImageRequired'
                                                    )}
                                                </HelperText>
                                            )}
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
                                                    lineHeight: 16,
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
                                                    color={
                                                        ipctColors.greenishTeal
                                                    }
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
                                        onChangeText={(value) =>
                                            setEmail(value)
                                        }
                                        onEndEditing={() =>
                                            setIsEmailValid(
                                                validateEmail(email)
                                            )
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
                                    <Text
                                        style={
                                            styles.createCommunityDescription
                                        }
                                    >
                                        {i18n.t('contractDescriptionLabel')}
                                    </Text>

                                    <View>
                                        <View style={{ marginTop: 28 }}>
                                            <Input
                                                style={styles.inputTextField}
                                                label={i18n.t('claimAmount')}
                                                value={claimAmount}
                                                placeholder="$0"
                                                maxLength={14}
                                                keyboardType="numeric"
                                                onChangeText={(value) =>
                                                    setClaimAmount(value)
                                                }
                                                onEndEditing={() =>
                                                    setIsClaimAmountValid(
                                                        claimAmount.length >
                                                            0 &&
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
                                                    {i18n.t(
                                                        'claimAmountRequired'
                                                    )}
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
                                                            new BigNumber(
                                                                10
                                                            ).pow(
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
                                                {i18n.t(
                                                    'maxClaimAmountRequired'
                                                )}
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
                                                            new BigNumber(
                                                                10
                                                            ).pow(
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
                                        <View
                                            style={{ flex: 1, marginRight: 10 }}
                                        >
                                            <Input
                                                style={styles.inputTextField}
                                                value={incrementInterval}
                                                placeholder="0"
                                                maxLength={14}
                                                keyboardType="numeric"
                                                onChangeText={(value) =>
                                                    setIncrementalInterval(
                                                        value
                                                    )
                                                }
                                                onEndEditing={() =>
                                                    setIsIncrementalIntervalValid(
                                                        incrementInterval.length >
                                                            0
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
                                        <View
                                            style={{ flex: 1, marginLeft: 10 }}
                                        >
                                            <Select
                                                value={
                                                    // TODO: Refactor
                                                    incrementalIntervalUnit ===
                                                    60
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
                )}
            </KeyboardAvoidingView>
            <RNPortal>
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
