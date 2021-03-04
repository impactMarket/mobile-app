import { useNavigation } from '@react-navigation/native';
import countriesJSON from 'assets/countries.json';
import currenciesJSON from 'assets/currencies.json';
import i18n from 'assets/i18n';
import BigNumber from 'bignumber.js';
import Card from 'components/core/Card';
import Select from 'components/core/Select';
import BackSvg from 'components/svg/header/BackSvg';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { celoNetwork } from 'helpers/constants';
import {
    formatInputAmountToTransfer,
    amountToCurrency,
} from 'helpers/currency';
import { validateEmail, updateCommunityInfo } from 'helpers/index';
import { setUserIsCommunityManager } from 'helpers/redux/actions/user';
import { CommunityCreationAttributes } from 'helpers/types/endpoints';
import { IRootState } from 'helpers/types/state';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
    StyleSheet,
    ScrollView,
    Alert,
    View,
    ImageBackground,
    FlatList,
    TextInputEndEditingEventData,
} from 'react-native';
import {
    Button,
    Paragraph,
    Headline,
    Divider,
    Portal,
    Dialog,
    RadioButton,
    HelperText,
    TextInput,
    IconButton,
    Text,
    Searchbar,
    List,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
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
    const exchangeRates = useSelector(
        (state: IRootState) => state.app.exchangeRates
    );
    const kit = useSelector((state: IRootState) => state.app.kit);
    const navigation = useNavigation();

    // const [availableCurrencies, setAvailableCurrencies] = useState<
    //     { name: string; symbol: string }[]
    // >([]);
    const [sending, setSending] = useState(false);
    const [gpsLocation, setGpsLocation] = useState<Location.LocationObject>();
    //
    const [isDialogCountryOpen, setIsDialogCountryOpen] = useState(false);
    const [isDialogCurrencyOpen, setIsDialogCurrencyOpen] = useState(false);
    const [isDialogFrequencyOpen, setIsDialogFrequencyOpen] = useState(false);
    const [isDialogVisibilityOpen, setIsDialogVisibilityOpen] = useState(false);
    const [isNameValid, setIsNameValid] = useState(true);
    const [isCoverImageValid, setIsCoverImageValid] = useState(true);
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
    const [searchCurrencyResult, setSearchCurrencyResult] = useState<string[]>(
        []
    );
    const [currency, setCurrency] = useState<string>(userCurrency);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [city, setCity] = useState('');
    const [searchCountryQuery, setSearchCountryQuery] = useState('');
    const [searchCountryISOResult, setSearchCountryISOResult] = useState<
        string[]
    >([]);
    const [tooManyResultForQuery, setTooManyResultForQuery] = useState(false);
    const [country, setCountry] = useState('');
    const [email, setEmail] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [claimAmount, setClaimAmount] = useState('');
    const [baseInterval, setBaseInterval] = useState('86400');
    const [incrementInterval, setIncrementalInterval] = useState('');
    const [maxClaim, setMaxClaim] = useState('');
    const [visibility, setVisivility] = useState('public');

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
            for (var [key, value] of Object.entries(countries)) {
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
                (parseInt(incrementInterval, 10) * 60).toString(),
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

        //
        setSending(true);
        const decimals = new BigNumber(10).pow(config.cUSDDecimals);
        let txReceipt = null;
        let communityAddress = null;

        try {
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
                incrementInterval: parseInt(incrementInterval, 10) * 60,
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
                // coverImage: uploadImagePath,
                contractParams,
                ...privateParamsIfAvailable,
            };

            const apiRequestResult = await Api.community.create(
                communityDetails
            );

            if (apiRequestResult) {
                await Api.upload.uploadCommunityCoverImage(
                    apiRequestResult.publicId,
                    coverImage
                );
                await updateCommunityInfo(apiRequestResult.publicId, dispatch);
                dispatch(setUserIsCommunityManager(true));
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
            Alert.alert(
                i18n.t('failure'),
                i18n.t('errorCreatingCommunity'),
                [{ text: 'OK' }],
                { cancelable: false }
            );
            setSending(false);
            Api.system.uploadError(userAddress, 'create_community', e);
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

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.cancelled) {
            setCoverImage(result.uri);
            setIsCoverImageValid(true);
        }
    };

    const openHelp = (help: string) => {
        Alert.alert(
            i18n.t(help),
            i18n.t(`${help}Help`),
            [{ text: i18n.t('close') }],
            { cancelable: false }
        );
    };

    const handleSearchCountry = (
        e: React.BaseSyntheticEvent<TextInputEndEditingEventData>
    ) => {
        if (tooManyResultForQuery) {
            setTooManyResultForQuery(false);
        }
        const countriesResult: string[] = [];
        for (var [key, value] of Object.entries(countries)) {
            if (value.name.indexOf(searchCountryQuery) !== -1) {
                countriesResult.push(key);
            }
        }
        //
        if (countriesResult.length > 7) {
            setTooManyResultForQuery(true);
        } else {
            setSearchCountryISOResult(countriesResult);
            setShowingResults(true);
        }
    };

    const handleSelectCountry = (countryISO: string) => {
        setCountry(countryISO);
        setIsDialogCountryOpen(false);
        setSearchCountryQuery('');
        setSearchCountryISOResult([]);
    };

    const renderItemCountryQuery = ({ item }: { item: string }) => (
        <List.Item
            title={`${countries[item].emoji} ${countries[item].name}`}
            onPress={() => handleSelectCountry(item)}
            // left={(props) => <List.Icon {...props} icon="folder" />}
        />
    );

    const renderSearchCountryResult = () => {
        if (!isDialogCountryOpen) {
            return;
        }
        if (tooManyResultForQuery) {
            return <Paragraph>{i18n.t('tooManyResults')}</Paragraph>;
        }
        if (searchCountryQuery.length > 0) {
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
        if (currencyResult.length > 7) {
            setTooManyResultForQuery(true);
        } else {
            setSearchCurrencyResult(currencyResult);
            setShowingResults(true);
        }
    };

    const handleSelectCurrency = (currency: string) => {
        setCurrency(currency);
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

    return (
        <>
            <ScrollView>
                <View style={styles.container}>
                    <Card>
                        <Card.Content style={{ margin: -16 }}>
                            <Headline style={styles.communityDetailsHeadline}>
                                {i18n.t('communityDetails').toUpperCase()}
                            </Headline>
                            <Text style={styles.createCommunityDescription}>
                                {i18n.t('createCommunityDescription')}
                            </Text>
                            <View>
                                <ImageBackground
                                    source={
                                        coverImage.length === 0
                                            ? require('assets/images/placeholder.png')
                                            : { uri: coverImage }
                                    }
                                    style={styles.imageCover}
                                >
                                    <Button
                                        mode="contained"
                                        style={{ margin: 16 }}
                                        onPress={pickImage}
                                    >
                                        {coverImage.length === 0
                                            ? i18n.t('selectCoverImage')
                                            : i18n.t('changeCoverImage')}
                                    </Button>
                                </ImageBackground>
                                {!isCoverImageValid && (
                                    <HelperText type="error" visible>
                                        {i18n.t('coverImageRequired')}
                                    </HelperText>
                                )}
                                <View style={{ margin: 16 }}>
                                    <TextInput
                                        mode="flat"
                                        underlineColor="transparent"
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
                                        <HelperText type="error" visible>
                                            {i18n.t('communityNameRequired')}
                                        </HelperText>
                                    )}
                                </View>
                                <Divider />
                                <View style={{ margin: 16 }}>
                                    <TextInput
                                        mode="flat"
                                        underlineColor="transparent"
                                        style={styles.inputTextField}
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
                                    {!isDescriptionValid && (
                                        <HelperText type="error" visible>
                                            {i18n.t(
                                                'communityDescriptionRequired'
                                            )}
                                        </HelperText>
                                    )}
                                </View>
                                <Divider />
                                <View style={{ margin: 16 }}>
                                    <TextInput
                                        mode="flat"
                                        underlineColor="transparent"
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
                                        <HelperText type="error" visible>
                                            {i18n.t('cityRequired')}
                                        </HelperText>
                                    )}
                                </View>
                                <Divider />
                                <View style={{ margin: 16 }}>
                                    {/* <TextInput
                                        mode="flat"
                                        underlineColor="transparent"
                                        style={styles.inputTextField}
                                        label={i18n.t('country')}
                                        value={country}
                                        maxLength={32}
                                        onChangeText={(value) =>
                                            setCountry(value)
                                        }
                                        onEndEditing={() =>
                                            setIsCountryValid(
                                                country.length > 0
                                            )
                                        }
                                    />*/}
                                    <Select
                                        label={i18n.t('country')}
                                        value={
                                            country.length > 0
                                                ? `${countries[country].emoji} ${countries[country].name}`
                                                : 'Select Country'
                                        }
                                        onPress={() =>
                                            setIsDialogCountryOpen(true)
                                        }
                                    />
                                    {!isCountryValid && (
                                        <HelperText type="error" visible>
                                            {i18n.t('countryRequired')}
                                        </HelperText>
                                    )}
                                </View>
                                {gpsLocation === undefined ? (
                                    <View>
                                        <Button
                                            mode="outlined"
                                            style={{ marginHorizontal: 16 }}
                                            onPress={() => enableGPSLocation()}
                                            loading={isEnablingGPS}
                                        >
                                            {i18n.t('getGPSLocation')}
                                        </Button>
                                        {!isEnabledGPS && (
                                            <HelperText type="error" visible>
                                                {i18n.t('enablingGPSRequired')}
                                            </HelperText>
                                        )}
                                    </View>
                                ) : (
                                    <Button
                                        icon="check"
                                        mode="outlined"
                                        style={{ marginHorizontal: 16 }}
                                        disabled
                                    >
                                        {i18n.t('validCoordinates')}
                                    </Button>
                                )}
                                <View style={{ margin: 16 }}>
                                    <TextInput
                                        mode="flat"
                                        underlineColor="transparent"
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
                                        <HelperText type="error" visible>
                                            {i18n.t('emailRequired')}
                                        </HelperText>
                                    )}
                                </View>
                                <Divider />
                                {/* <Paragraph style={styles.inputTextFieldLabel}>
                                    {i18n.t('currency')}
                                </Paragraph> */}
                                <View
                                    style={{
                                        flex: 4,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        margin: 16,
                                    }}
                                >
                                    {/* <Button
                                        mode="contained"
                                        style={{
                                            width: '80%',
                                            borderRadius: 6,
                                            margin: 10,
                                            backgroundColor:
                                                'rgba(206,212,218,0.27)',
                                        }}
                                        onPress={() =>
                                            setIsDialogCurrencyOpen(true)
                                        }
                                    >
                                        <Text
                                            style={{
                                                color: 'black',
                                                opacity: 1,
                                            }}
                                        >
                                            {currency}
                                        </Text>
                                    </Button> */}
                                    <View style={{ flex: 3 }}>
                                        <Select
                                            label={i18n.t('currency')}
                                            value={currencies[currency].name}
                                            onPress={() =>
                                                setIsDialogCurrencyOpen(true)
                                            }
                                        />
                                    </View>
                                    <View
                                        style={{
                                            flex: 1,
                                            flexDirection: 'row-reverse',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <IconButton
                                            style={{ marginTop: 25 }}
                                            icon="help-circle-outline"
                                            size={20}
                                            onPress={() => openHelp('currency')}
                                        />
                                    </View>
                                </View>
                            </View>
                        </Card.Content>
                    </Card>
                    <Headline style={styles.contractDetailsHeadline}>
                        {i18n.t('contractDetails')}
                    </Headline>
                    <View style={{ marginBottom: 15 }}>
                        <View>
                            <View style={{ margin: 10 }}>
                                <TextInput
                                    mode="flat"
                                    underlineColor="transparent"
                                    style={styles.inputTextField}
                                    label={i18n.t('claimAmount')}
                                    placeholder="$0"
                                    value={claimAmount}
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
                                    <HelperText type="error" visible>
                                        {i18n.t('claimAmountRequired')}
                                    </HelperText>
                                )}
                            </View>
                            {claimAmount.length === 0 && (
                                <IconButton
                                    style={{
                                        position: 'absolute',
                                        top: 30,
                                        right: 0,
                                    }}
                                    icon="help-circle-outline"
                                    size={20}
                                    onPress={() => openHelp('claimAmount')}
                                />
                            )}
                            {claimAmount.length > 0 && (
                                <Text style={styles.aroundCurrencyValue}>
                                    {i18n.t('aroundValue', {
                                        amount: amountToCurrency(
                                            new BigNumber(
                                                claimAmount
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
                        <Divider />
                        <View>
                            <View style={{ margin: 10 }}>
                                <TextInput
                                    mode="flat"
                                    underlineColor="transparent"
                                    style={styles.inputTextField}
                                    label={i18n.t('totalClaimPerBeneficiary')}
                                    placeholder="$0"
                                    value={maxClaim}
                                    keyboardType="numeric"
                                    onChangeText={(value) => setMaxClaim(value)}
                                    onEndEditing={() =>
                                        setIsMaxClaimValid(
                                            maxClaim.length > 0 &&
                                                /^\d*[\.\,]?\d*$/.test(maxClaim)
                                        )
                                    }
                                />
                                {!isMaxClaimValid && (
                                    <HelperText type="error" visible>
                                        {i18n.t('maxClaimAmountRequired')}
                                    </HelperText>
                                )}
                            </View>
                            {maxClaim.length === 0 && (
                                <IconButton
                                    style={{
                                        position: 'absolute',
                                        top: 30,
                                        right: 0,
                                    }}
                                    icon="help-circle-outline"
                                    size={20}
                                    onPress={() =>
                                        openHelp('totalClaimPerBeneficiary')
                                    }
                                />
                            )}
                            {maxClaim.length > 0 && (
                                <Text style={styles.aroundCurrencyValue}>
                                    {i18n.t('aroundValue', {
                                        amount: amountToCurrency(
                                            new BigNumber(
                                                maxClaim
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
                        <Divider />
                        <Paragraph style={styles.inputTextFieldLabel}>
                            {i18n.t('frequency')}
                        </Paragraph>
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignSelf: 'center',
                            }}
                        >
                            <Button
                                mode="contained"
                                style={{
                                    width: '80%',
                                    borderRadius: 6,
                                    margin: 10,
                                    backgroundColor: 'rgba(206,212,218,0.27)',
                                }}
                                onPress={() => setIsDialogFrequencyOpen(true)}
                            >
                                <Text style={{ color: 'black', opacity: 1 }}>
                                    {baseInterval === '86400'
                                        ? i18n.t('daily')
                                        : i18n.t('weekly')}
                                </Text>
                            </Button>
                            <IconButton
                                style={{ marginTop: 10 }}
                                icon="help-circle-outline"
                                size={20}
                                onPress={() => openHelp('frequency')}
                            />
                        </View>
                        <View>
                            <View style={{ margin: 10 }}>
                                <TextInput
                                    mode="flat"
                                    underlineColor="transparent"
                                    style={styles.inputTextField}
                                    label={i18n.t('timeIncrementAfterClaim')}
                                    placeholder={i18n.t('timeInMinutes')}
                                    value={incrementInterval}
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
                                    <HelperText type="error" visible>
                                        {i18n.t('incrementalIntervalRequired')}
                                    </HelperText>
                                )}
                            </View>
                            {incrementInterval.length === 0 && (
                                <IconButton
                                    style={{
                                        position: 'absolute',
                                        top: 30,
                                        right: 0,
                                    }}
                                    icon="help-circle-outline"
                                    size={20}
                                    onPress={() =>
                                        openHelp('timeIncrementAfterClaim')
                                    }
                                />
                            )}
                        </View>
                        <Divider />
                        <Paragraph style={styles.inputTextFieldLabel}>
                            {i18n.t('visibility')}
                        </Paragraph>
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignSelf: 'center',
                            }}
                        >
                            <Button
                                mode="contained"
                                style={{
                                    width: '80%',
                                    borderRadius: 6,
                                    margin: 10,
                                    backgroundColor: 'rgba(206,212,218,0.27)',
                                }}
                                onPress={() => setIsDialogVisibilityOpen(true)}
                            >
                                <Text style={{ color: 'black', opacity: 1 }}>
                                    {visibility === 'public'
                                        ? i18n.t('public')
                                        : i18n.t('private')}
                                </Text>
                            </Button>
                            <IconButton
                                style={{ marginTop: 10 }}
                                icon="help-circle-outline"
                                size={20}
                                onPress={() => openHelp('visibility')}
                            />
                        </View>
                    </View>
                    <Text style={{ ...styles.textNote, marginVertical: 20 }}>
                        {i18n.t('createCommunityNote1')}
                    </Text>
                    <Text style={styles.textNote}>
                        {i18n.t('createCommunityNote2')}
                    </Text>
                </View>
            </ScrollView>
            <Portal>
                <Dialog
                    visible={isDialogCountryOpen}
                    onDismiss={() => setIsDialogCountryOpen(false)}
                >
                    <Dialog.Content>
                        <Searchbar
                            placeholder={i18n.t('search')}
                            style={{
                                backgroundColor: 'rgba(206, 212, 218, 0.27)',
                                shadowRadius: 0,
                                elevation: 0,
                                borderRadius: 6,
                            }}
                            autoFocus
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
                    </Dialog.Content>
                </Dialog>
                <Dialog
                    visible={isDialogFrequencyOpen}
                    onDismiss={() => setIsDialogFrequencyOpen(false)}
                >
                    <Dialog.Content>
                        <RadioButton.Group
                            onValueChange={(value) => {
                                setBaseInterval(value);
                                setIsDialogFrequencyOpen(false);
                            }}
                            value={baseInterval}
                        >
                            <RadioButton.Item
                                label={i18n.t('daily')}
                                value="86400"
                            />
                            <RadioButton.Item
                                label={i18n.t('weekly')}
                                value="604800"
                            />
                        </RadioButton.Group>
                    </Dialog.Content>
                </Dialog>
                <Dialog
                    visible={isDialogVisibilityOpen}
                    onDismiss={() => setIsDialogVisibilityOpen(false)}
                >
                    <Dialog.Content>
                        <RadioButton.Group
                            onValueChange={(value) => {
                                setVisivility(value);
                                setIsDialogVisibilityOpen(false);
                            }}
                            value={visibility}
                        >
                            <RadioButton.Item
                                label={i18n.t('public')}
                                value="public"
                            />
                            <RadioButton.Item
                                label={i18n.t('private')}
                                value="private"
                            />
                        </RadioButton.Group>
                    </Dialog.Content>
                </Dialog>
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
            </Portal>
        </>
    );
}
CreateCommunityScreen.navigationOptions = () => {
    return {
        headerLeft: () => <BackSvg />,
        headerTitle: i18n.t('create'), // editing ? i18n.t('edit') : i18n.t('create'),
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
        margin: 20,
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
        marginVertical: 50,
        right: 0,
        fontFamily: 'Gelion-Regular',
        fontSize: 15,
        lineHeight: 15,
        letterSpacing: 0.25,
        color: ipctColors.regentGray,
    },
    communityDetailsHeadline: {
        opacity: 0.48,
        fontFamily: 'Gelion-Regular',
        fontSize: 13,
        fontWeight: '500',
        lineHeight: 12,
        letterSpacing: 0.7,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    contractDetailsHeadline: {
        opacity: 0.48,
        fontFamily: 'Gelion-Regular',
        fontSize: 13,
        fontWeight: '500',
        lineHeight: 13,
        letterSpacing: 0.7,
        marginTop: 20,
        marginHorizontal: 10,
    },
    createCommunityDescription: {
        fontFamily: 'Gelion-Regular',
        backgroundColor: '#f0f0f0',
        padding: 16,
        borderTopColor: '#d8d8d8',
        borderTopWidth: 1,
        borderBottomColor: '#d8d8d8',
        borderBottomWidth: 1,
    },
});

export default CreateCommunityScreen;
