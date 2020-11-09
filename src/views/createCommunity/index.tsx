import { useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import BigNumber from 'bignumber.js';
import Header from 'components/Header';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import {
    humanifyNumber,
    validateEmail,
    formatInputAmountToTransfer,
    getCurrencySymbol,
    amountToCurrency,
    updateCommunityInfo,
} from 'helpers/index';
import {
    ICommunityInfo,
    IUserState,
    IStoreCombinedState,
    IStoreCombinedActionsTypes,
    ICommunity,
} from 'helpers/types';
import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    ScrollView,
    Alert,
    View,
    ImageBackground,
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
} from 'react-native-paper';
import { useDispatch, useStore } from 'react-redux';
import Api from 'services/api';
import config from '../../../config';
import { celoWalletRequest } from 'services/celoWallet';
import CommunityContractABI from '../../contracts/CommunityABI.json';
import CommunityBytecode from '../../contracts/CommunityBytecode.json';
import { setUserIsCommunityManager } from 'helpers/redux/actions/ReduxActions';
import Card from 'components/core/Card';

interface ICreateCommunityScreen {
    route: {
        params: {
            community: ICommunityInfo;
            user: IUserState;
        };
    };
}

BigNumber.config({ EXPONENTIAL_AT: [-7, 30] });
function CreateCommunityScreen(props: ICreateCommunityScreen) {
    const dispatch = useDispatch();
    const store = useStore<IStoreCombinedState, IStoreCombinedActionsTypes>();
    const { user, network, app } = store.getState();
    const navigation = useNavigation();

    const [availableCurrencies, setAvailableCurrencies] = useState<
        { name: string; symbol: string }[]
    >([]);
    const [editing, setEditing] = useState(false);
    const [sending, setSending] = useState(false);
    const [gpsLocation, setGpsLocation] = useState<Location.LocationData>();
    //
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
    const [currency, setCurrency] = useState<string>(user.user.currency);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [email, setEmail] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [claimAmount, setClaimAmount] = useState('');
    const [baseInterval, setBaseInterval] = useState('86400');
    const [incrementInterval, setIncrementalInterval] = useState('');
    const [maxClaim, setMaxClaim] = useState('');
    const [visibility, setVisivility] = useState('public');

    useEffect(() => {
        if (props.route.params !== undefined) {
            const community = props.route.params.community as ICommunityInfo;
            if (community !== undefined) {
                setName(community.name);
                setDescription(community.description);
                setCity(community.city);
                setCountry(community.country);
                setEmail(community.email);
                setVisivility(community.visibility);
                setGpsLocation({
                    coords: {
                        latitude: community.gps.latitude,
                        longitude: community.gps.longitude,
                    },
                } as Location.LocationData);
                // cover image
                setClaimAmount(
                    humanifyNumber(community.vars._claimAmount).toString()
                );
                setBaseInterval(community.vars._baseInterval);
                setIncrementalInterval(
                    new BigNumber(community.vars._incrementInterval)
                        .div(60)
                        .toString()
                );
                setMaxClaim(
                    humanifyNumber(community.vars._maxClaim).toString()
                );
                // currency
                setCoverImage(community.coverImage);

                setIsNameValid(true);
                setIsDescriptionValid(true);
                setIsCityValid(true);
                setIsCountryValid(true);
                setIsClaimAmountValid(true);
                setIsIncrementalIntervalValid(true);
                setIsMaxClaimValid(true);

                setEditing(true);
            }
        }
        const getAvailableCurrencies = async () => {
            const rates = app.exchangeRates;
            const currencies: { name: string; symbol: string }[] = [];
            for (const currency in rates) {
                currencies.push({
                    name: rates[currency].name,
                    symbol: currency,
                });
            }
            setAvailableCurrencies(currencies);
        };
        getAvailableCurrencies();
    }, []);

    const deployPrivateCommunity = async () => {
        const decimals = new BigNumber(10).pow(config.cUSDDecimals);
        const CommunityContract = new app.kit.web3.eth.Contract(
            CommunityContractABI as any
        );
        const txObject = await CommunityContract.deploy({
            data: CommunityBytecode.bytecode,
            arguments: [
                user.celoInfo.address,
                new BigNumber(formatInputAmountToTransfer(claimAmount))
                    .multipliedBy(decimals)
                    .toString(),
                new BigNumber(formatInputAmountToTransfer(maxClaim))
                    .multipliedBy(decimals)
                    .toString(),
                baseInterval,
                (parseInt(incrementInterval, 10) * 60).toString(),
                '0x0000000000000000000000000000000000000000',
                config.cUSDContract,
                user.celoInfo.address,
            ],
        });
        // exception is handled outside
        // receipt as undefined is handled outside
        const receipt = await celoWalletRequest(
            user.celoInfo.address,
            '0x0000000000000000000000000000000000000000',
            txObject,
            'createcommunity',
            app.kit,
            false
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
        setSending(true);
        const decimals = new BigNumber(10).pow(config.cUSDDecimals);
        if (editing) {
            const community = props.route.params.community as ICommunityInfo;
            // const {
            //     _claimAmount,
            //     _baseInterval,
            //     _maxClaim,
            //     _incrementInterval,
            // } = props.route.params.community.vars;
            try {
                // if (
                //     !new BigNumber(claimAmount)
                //         .multipliedBy(decimals)
                //         .eq(_claimAmount) ||
                //     baseInterval !== _baseInterval ||
                //     parseInt(incrementInterval, 10) * 3600 !==
                //         parseInt(_incrementInterval, 10) ||
                //     !new BigNumber(maxClaim)
                //         .multipliedBy(decimals)
                //         .eq(_maxClaim)
                // ) {
                //     // if one of the fields is changed, send contract edit!
                //     await celoWalletRequest(
                //         user.celoInfo.address,
                //         community.contractAddress,
                //         await props.network.contracts.communityContract.methods.edit(
                //             new BigNumber(claimAmount)
                //                 .multipliedBy(decimals)
                //                 .toString(),
                //             new BigNumber(maxClaim)
                //                 .multipliedBy(decimals)
                //                 .toString(),
                //             baseInterval,
                //             (parseInt(incrementInterval, 10) * 60).toString()
                //         ),
                //         'editcommunity',
                //         app.kit
                //     );
                // }
                const success = await Api.editCommunity(
                    community.publicId,
                    user.celoInfo.address,
                    name,
                    description,
                    city,
                    country,
                    {
                        latitude: gpsLocation!.coords.latitude,
                        longitude: gpsLocation!.coords.longitude,
                    },
                    email,
                    visibility,
                    coverImage
                );
                if (!success) {
                    Alert.alert(
                        i18n.t('failure'),
                        i18n.t('errorCreatingCommunity'),
                        [{ text: 'OK' }],
                        { cancelable: false }
                    );
                    return;
                } else {
                    const previousCommunity = network.community;
                    const unsubscribe = store.subscribe(() => {
                        const newCommunity = network.community;
                        if (previousCommunity !== newCommunity) {
                            unsubscribe();
                            navigation.goBack();
                            Alert.alert(
                                i18n.t('success'),
                                i18n.t('communityUpdated'),
                                [{ text: 'OK' }],
                                { cancelable: false }
                            );
                        }
                    });
                    await updateCommunityInfo(community.publicId, dispatch);
                }
            } catch (e) {
                Alert.alert(
                    i18n.t('failure'),
                    i18n.t('errorUpdatingCommunity'),
                    [{ text: 'OK' }],
                    { cancelable: false }
                );
            } finally {
                setSending(false);
            }
        } else {
            let uploadResponse,
                uploadImagePath,
                txReceipt = null,
                communityAddress = null;
            try {
                if (visibility === 'private') {
                    txReceipt = await deployPrivateCommunity();
                    if (txReceipt === undefined) {
                        return;
                    }
                    communityAddress = txReceipt.contractAddress;
                }
                uploadResponse = await Api.uploadImageAsync(coverImage);
                if (uploadResponse?.status === 200) {
                    uploadImagePath = uploadResponse.data.location;
                }
            } catch (e) {
                // log({ uploadResponse });
                // log({ uploadImagePath });
                // log({ e });
                Alert.alert(
                    i18n.t('failure'),
                    i18n.t('errorCreatingCommunity'),
                    [{ text: 'OK' }],
                    { cancelable: false }
                );
                setSending(false);
                return;
            }
            let apiRequestResult: ICommunity | undefined = undefined;
            if (visibility === 'private') {
                apiRequestResult = await Api.createPrivateCommunity(
                    user.celoInfo.address,
                    name,
                    communityAddress!,
                    description,
                    user.user.language,
                    currency,
                    city,
                    country,
                    {
                        latitude:
                            gpsLocation!.coords.latitude +
                            config.locationErrorMargin,
                        longitude:
                            gpsLocation!.coords.longitude +
                            config.locationErrorMargin,
                    },
                    email,
                    uploadImagePath,
                    txReceipt,
                    {
                        _claimAmount: new BigNumber(
                            formatInputAmountToTransfer(claimAmount)
                        )
                            .multipliedBy(decimals)
                            .toString(),
                        _maxClaim: new BigNumber(
                            formatInputAmountToTransfer(maxClaim)
                        )
                            .multipliedBy(decimals)
                            .toString(),
                        _baseInterval: baseInterval,
                        _incrementInterval: (
                            parseInt(incrementInterval, 10) * 60
                        ).toString(),
                    }
                );
            } else {
                apiRequestResult = await Api.requestCreatePublicCommunity(
                    user.celoInfo.address,
                    name,
                    description,
                    user.user.language,
                    currency,
                    city,
                    country,
                    {
                        latitude:
                            gpsLocation!.coords.latitude +
                            config.locationErrorMargin,
                        longitude:
                            gpsLocation!.coords.longitude +
                            config.locationErrorMargin,
                    },
                    email,
                    uploadImagePath,
                    {
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
                        baseInterval,
                        incrementInterval: (
                            parseInt(incrementInterval, 10) * 60
                        ).toString(),
                    }
                );
            }

            if (apiRequestResult) {
                const unsubscribe = store.subscribe(() => {
                    if (user.community.isManager) {
                        unsubscribe();
                        setSending(false);
                        navigation.goBack();
                        Alert.alert(
                            i18n.t('success'),
                            visibility === 'private'
                                ? i18n.t('youCreatedPrivateCommunity')
                                : i18n.t('requestNewCommunityPlaced'),
                            [{ text: 'OK' }],
                            { cancelable: false }
                        );
                    }
                });
                if (visibility === 'private') {
                    await updateCommunityInfo(apiRequestResult.publicId, dispatch);
                } else {
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
        }
    };

    const enableGPSLocation = async () => {
        setIsEnablingGPS(true);
        const { status } = await Location.requestPermissionsAsync();
        setIsEnablingGPS(false);
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

    if (user.celoInfo.address.length === 0) {
        return (
            <View>
                <Header
                    title={i18n.t('create')}
                    navigation={navigation}
                    hasBack
                />
                <View style={styles.container}>
                    <Text>{i18n.t('needLoginToCreateCommunity')}</Text>
                </View>
            </View>
        );
    }

    return (
        <>
            <Header
                title={editing ? i18n.t('edit') : i18n.t('create')}
                navigation={navigation}
                hasBack
            >
                <Button
                    mode="text"
                    uppercase={false}
                    labelStyle={{
                        fontFamily: 'Gelion-Bold',
                        fontSize: 22,
                        lineHeight: 26,
                        textAlign: 'center',
                        letterSpacing: 0.366667,
                        color: '#2643E9',
                    }}
                    loading={sending}
                    onPress={() => submitNewCommunity()}
                >
                    {i18n.t('submit')}
                </Button>
            </Header>
            <ScrollView>
                <View style={styles.container}>
                    <Card elevation={8}>
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
                                    <HelperText type="error" visible={true}>
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
                                        <HelperText type="error" visible={true}>
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
                                        <HelperText type="error" visible={true}>
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
                                        <HelperText type="error" visible={true}>
                                            {i18n.t('cityRequired')}
                                        </HelperText>
                                    )}
                                </View>
                                <Divider />
                                <View style={{ margin: 16 }}>
                                    <TextInput
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
                                    />
                                    {!isCountryValid && (
                                        <HelperText type="error" visible={true}>
                                            {i18n.t('countryRequired')}
                                        </HelperText>
                                    )}
                                </View>
                                {gpsLocation === undefined && (
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
                                            <HelperText
                                                type="error"
                                                visible={true}
                                            >
                                                {i18n.t('enablingGPSRequired')}
                                            </HelperText>
                                        )}
                                    </View>
                                )}
                                {gpsLocation !== undefined && (
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
                                        <HelperText type="error" visible={true}>
                                            {i18n.t('emailRequired')}
                                        </HelperText>
                                    )}
                                </View>
                                <Divider />
                                <Paragraph style={styles.inputTextFieldLabel}>
                                    {i18n.t('currency')}
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
                                    </Button>
                                    <IconButton
                                        style={{ marginTop: 10 }}
                                        icon="help-circle-outline"
                                        size={20}
                                        onPress={() => openHelp('currency')}
                                    />
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
                                    disabled={editing}
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
                                    <HelperText type="error" visible={true}>
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
                                        symbol: getCurrencySymbol(currency),
                                        amount: amountToCurrency(
                                            new BigNumber(
                                                claimAmount
                                            ).multipliedBy(
                                                new BigNumber(10).pow(
                                                    config.cUSDDecimals
                                                )
                                            ),
                                            currency,
                                            app.exchangeRates
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
                                    disabled={editing}
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
                                    <HelperText type="error" visible={true}>
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
                                        symbol: getCurrencySymbol(currency),
                                        amount: amountToCurrency(
                                            new BigNumber(
                                                maxClaim
                                            ).multipliedBy(
                                                new BigNumber(10).pow(
                                                    config.cUSDDecimals
                                                )
                                            ),
                                            currency,
                                            app.exchangeRates
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
                                disabled={editing}
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
                                    disabled={editing}
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
                                    <HelperText type="error" visible={true}>
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
                                disabled={editing}
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
                        <RadioButton.Group
                            onValueChange={(value) => {
                                setCurrency(value);
                                setIsDialogCurrencyOpen(false);
                            }}
                            value={currency}
                        >
                            {availableCurrencies.map((c) => (
                                <RadioButton.Item
                                    key={c.symbol}
                                    label={c.name}
                                    value={c.symbol}
                                />
                            ))}
                        </RadioButton.Group>
                    </Dialog.Content>
                </Dialog>
            </Portal>
        </>
    );
}

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
        color: '#7e8da6',
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
