import countriesJSON from 'assets/countries.json';
import currenciesJSON from 'assets/currencies.json';
import i18n from 'assets/i18n';
import Button from 'components/core/Button';
import Card from 'components/core/Card';
import renderHeader from 'components/core/HeaderBottomSheetTitle';
import Input from 'components/core/Input';
import Select from 'components/core/Select';
import Modal from 'components/Modal';
import CloseStorySvg from 'components/svg/CloseStorySvg';
import WarningRedTriangle from 'components/svg/WarningRedTriangle';
import * as ImagePicker from 'expo-image-picker';
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types';
import * as Location from 'expo-location';
import { validateEmail } from 'helpers/index';
import { IRootState } from 'helpers/types/state';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Headline, Searchbar } from 'react-native-paper';
import { Portal } from 'react-native-portalize';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { ipctColors } from 'styles/index';

import {
    DispatchContext,
    formAction,
    StateContext,
    validateField,
} from './state';

function CommunityCurrency() {
    const currencies: {
        [key: string]: {
            symbol: string;
            name: string;
            symbol_native: string;
        };
    } = currenciesJSON;

    const modalizeCurrencyRef = useRef<Modalize>(null);

    const [searchCurrencyQuery, setSearchCurrencyQuery] = useState('');
    const [currenciesList, setCurrenciesList] = useState(
        Object.keys(currencies)
    );
    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

    const userCurrency = useSelector(
        (state: IRootState) => state.user.metadata.currency
    );
    useEffect(() => {
        dispatch({
            type: formAction.SET_CURRENCY,
            payload: userCurrency,
        });
    }, [dispatch]);

    const handleSelectCurrency = (item: string) => {
        dispatch({
            type: formAction.SET_CURRENCY,
            payload: item,
        });
        modalizeCurrencyRef.current?.close();
    };

    const currencyItem = ({ item }: { item: string }) => (
        <Pressable onPress={() => handleSelectCurrency(item)}>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                    justifyContent: 'space-between',
                    paddingVertical: 16,
                    paddingHorizontal: 22,
                }}
            >
                <Text
                    style={{
                        fontSize: 15,
                        lineHeight: 24,
                        fontFamily: 'Inter-Regular',
                    }}
                >{`[${currencies[item].symbol}] ${currencies[item].name}`}</Text>
                {item === state.currency && (
                    <Icon
                        name="check"
                        color={ipctColors.greenishTeal}
                        size={22}
                    />
                )}
            </View>
        </Pressable>
    );

    return (
        <>
            <View style={{ marginTop: 28 }}>
                <Select
                    label={i18n.t('currency')}
                    value={
                        state.currency.length > 0
                            ? currencies[state.currency].name
                            : 'Select currency'
                    }
                    onPress={() => modalizeCurrencyRef.current?.open()}
                />
            </View>
            <Portal>
                <Modalize
                    ref={modalizeCurrencyRef}
                    HeaderComponent={
                        <View>
                            {renderHeader(
                                i18n.t('currency'),
                                modalizeCurrencyRef,
                                () => modalizeCurrencyRef.current?.close()
                            )}
                            <Searchbar
                                placeholder={i18n.t('search')}
                                style={{
                                    borderColor: ipctColors.borderGray,
                                    borderWidth: 1,
                                    borderStyle: 'solid',
                                    shadowRadius: 0,
                                    elevation: 0,
                                    borderRadius: 6,
                                    marginHorizontal: 22,
                                }}
                                autoFocus
                                inputStyle={{
                                    marginLeft: -14,
                                }}
                                onChangeText={(e) => {
                                    if (e.length === 0) {
                                        setCurrenciesList(
                                            Object.keys(currencies)
                                        );
                                    } else {
                                        const foundCurrencies = [];
                                        for (const [
                                            key,
                                            value,
                                        ] of Object.entries(currencies)) {
                                            if (
                                                value.name
                                                    .toLowerCase()
                                                    .indexOf(
                                                        e.toLowerCase()
                                                    ) !== -1
                                            ) {
                                                foundCurrencies.push(key);
                                            }
                                        }
                                        setCurrenciesList(foundCurrencies);
                                    }
                                    setSearchCurrencyQuery(e);
                                }}
                                value={searchCurrencyQuery}
                            />
                        </View>
                    }
                    flatListProps={{
                        data: currenciesList,
                        renderItem: currencyItem,
                        keyExtractor: (item) => item,
                    }}
                />
            </Portal>
        </>
    );
}

function CommunityEmail() {
    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

    const handleEmailChange = (value) =>
        dispatch({
            type: formAction.SET_EMAIL,
            payload: value,
        });

    const handleEndEdit = () => validateField(state, dispatch).email();

    const error = !state.validation.email
        ? i18n.t('emailRequired')
        : !state.validation.emailFormat
        ? i18n.t('emailInvalidFormat')
        : undefined;

    return (
        <Input
            label={i18n.t('email')}
            value={state.email}
            maxLength={64}
            keyboardType="email-address"
            onChangeText={handleEmailChange}
            onEndEditing={handleEndEdit}
            error={error}
        />
    );
}

function CommunityLocation() {
    const [isEnabling, setIsEnabling] = useState(false);

    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

    const enableGPSLocation = async () => {
        setIsEnabling(true);
        try {
            const {
                status,
            } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                // Alert.alert(
                //     i18n.t('failure'),
                //     i18n.t('errorGettingGPSLocation'),
                //     [{ text: 'OK' }],
                //     { cancelable: false }
                // );
                return;
            }

            const {
                coords: { latitude, longitude },
            } = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Low,
            });
            dispatch({
                type: formAction.SET_GPS,
                payload: { latitude, longitude },
            });
            dispatch({
                type: formAction.SET_GPS_VALID,
                payload: latitude !== 0 || longitude !== 0,
            });
        } catch (e) {
            // Alert.alert(
            //     i18n.t('failure'),
            //     i18n.t('errorGettingGPSLocation'),
            //     [{ text: 'OK' }],
            //     { cancelable: false }
            // );
        } finally {
            setIsEnabling(false);
        }
    };

    if (state.gps.latitude !== 0 || state.gps.longitude !== 0) {
        return (
            <View
                style={{
                    marginVertical: 16,
                    marginBottom: 24,
                }}
            >
                <Pressable
                    style={{
                        backgroundColor: '#E9EDF4',
                        borderWidth: 0,
                        width: '100%',
                        height: 44,
                        paddingVertical: 8,
                        borderRadius: 6,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                    }}
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
                            style={{
                                color: ipctColors.darBlue,
                                marginLeft: 10,
                                fontFamily: 'Inter-Regular',
                                fontSize: 15,
                                lineHeight: 28,
                            }}
                        >
                            {i18n.t('validCoordinates')}
                        </Text>
                    </View>
                </Pressable>
            </View>
        );
    }

    return (
        <View
            style={{
                marginVertical: 16,
                marginBottom: 24,
            }}
        >
            <Button
                // mode="contained"
                modeType="default"
                style={{
                    paddingVertical: 0,
                    width: '100%',
                    height: 44,
                    borderRadius: 6,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                }}
                onPress={() => enableGPSLocation()}
                loading={isEnabling}
            >
                <Text
                    style={{
                        color: ipctColors.white,
                        fontFamily: 'Inter-Regular',
                        fontSize: 15,
                        lineHeight: 28,
                    }}
                >
                    {i18n.t('getGPSLocation')}
                </Text>
            </Button>
            {!state.validation.gps && (
                <Text
                    style={{
                        color: '#EB5757',
                        fontSize: 12,
                        lineHeight: 20,
                        fontFamily: 'Inter-Regular',
                        justifyContent: 'flex-start',
                    }}
                >
                    {i18n.t('enablingGPSRequired')}
                </Text>
            )}
        </View>
    );
}

function CommunityCountry() {
    const countries: {
        [key: string]: {
            name: string;
            native: string;
            currency: string;
            languages: string[];
            emoji: string;
        };
    } = countriesJSON;

    const [searchCountryQuery, setSearchCountryQuery] = useState('');
    const [countriesList, setCountriesList] = useState(Object.keys(countries));
    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

    const modalizeCountryRef = useRef<Modalize>(null);

    const handleSelectCountry = (item: string) => {
        dispatch({
            type: formAction.SET_COUNTRY,
            payload: item,
        });
        modalizeCountryRef.current?.close();
        dispatch({
            type: formAction.SET_COUNTRY_VALID,
            payload: true,
        });
    };

    const countryItem = ({ item }: { item: string }) => (
        <Pressable
            accessibilityLabel={item}
            onPress={() => handleSelectCountry(item)}
        >
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                    justifyContent: 'space-between',
                    paddingVertical: 16,
                    paddingHorizontal: 22,
                }}
            >
                <Text
                    style={{
                        fontSize: 15,
                        lineHeight: 24,
                        fontFamily: 'Inter-Regular',
                    }}
                >{`${countries[item].emoji} ${countries[item].name}`}</Text>
                {item === state.country && (
                    <Icon
                        name="check"
                        color={ipctColors.greenishTeal}
                        size={22}
                    />
                )}
            </View>
        </Pressable>
    );

    const error = state.validation.country
        ? undefined
        : i18n.t('countryRequired');

    return (
        <>
            <View style={{ marginTop: 28 }}>
                <Select
                    label={i18n.t('country')}
                    value={
                        state.country.length > 0
                            ? `${countries[state.country].emoji} ${
                                  countries[state.country].name
                              }`
                            : i18n.t('selectCountry')
                    }
                    onPress={() => modalizeCountryRef.current?.open()}
                    error={error}
                />
            </View>
            <Portal>
                <Modalize
                    ref={modalizeCountryRef}
                    HeaderComponent={
                        <View>
                            {renderHeader(
                                i18n.t('country'),
                                modalizeCountryRef,
                                () => {
                                    modalizeCountryRef.current?.close();
                                    validateField(state, dispatch).country();
                                }
                            )}
                            <Searchbar
                                accessibilityLabel={i18n.t('search')}
                                placeholder={i18n.t('search')}
                                style={{
                                    borderColor: ipctColors.borderGray,
                                    borderWidth: 1,
                                    borderStyle: 'solid',
                                    shadowRadius: 0,
                                    elevation: 0,
                                    borderRadius: 6,
                                    marginHorizontal: 22,
                                }}
                                // autoFocus
                                inputStyle={{
                                    marginLeft: -14,
                                }}
                                onChangeText={(e) => {
                                    if (e.length === 0) {
                                        setCountriesList(
                                            Object.keys(countries)
                                        );
                                    } else {
                                        const foundCountries = [];
                                        for (const [
                                            key,
                                            value,
                                        ] of Object.entries(countries)) {
                                            if (
                                                value.name
                                                    .toLowerCase()
                                                    .indexOf(
                                                        e.toLowerCase()
                                                    ) !== -1
                                            ) {
                                                foundCountries.push(key);
                                            }
                                        }
                                        setCountriesList(foundCountries);
                                    }
                                    setSearchCountryQuery(e);
                                }}
                                value={searchCountryQuery}
                            />
                        </View>
                    }
                    flatListProps={{
                        data: countriesList,
                        renderItem: countryItem,
                        keyExtractor: (item) => item,
                    }}
                />
            </Portal>
        </>
    );
}

function CommunityCity() {
    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

    const handleChangeCity = (value: string) => {
        dispatch({ type: formAction.SET_CITY, payload: value });
    };

    const handleEndEdit = () => validateField(state, dispatch).city();

    const error = state.validation.city ? undefined : i18n.t('cityRequired');

    return (
        <Input
            label={i18n.t('city')}
            value={state.city}
            maxLength={32}
            onChangeText={handleChangeCity}
            onEndEditing={handleEndEdit}
            error={error}
            boxStyle={{ marginTop: 28 }}
        />
    );
}

function CommunityDescription() {
    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

    const handleChangeDescription = (value: string) => {
        dispatch({ type: formAction.SET_DESCRIPTION, payload: value });
    };

    const error = !state.validation.description
        ? i18n.t('communityDescriptionRequired')
        : state.validation.descriptionTooShort
        ? i18n.t('communityDescriptionTooShort')
        : undefined;

    const handleEndEdit = () => validateField(state, dispatch).description();

    return (
        <Input
            label={i18n.t('shortDescription')}
            value={state.description}
            maxLength={1024}
            onChangeText={handleChangeDescription}
            onEndEditing={handleEndEdit}
            error={error}
            multiline
            boxStyle={{ marginTop: 16 }}
        />
    );
}

function CommunityName() {
    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

    const handleChangeName = (value: string) => {
        dispatch({ type: formAction.SET_NAME, payload: value });
    };

    const handleEndEdit = () => validateField(state, dispatch).name();

    const error = state.validation.name
        ? undefined
        : i18n.t('communityNameRequired');

    return (
        <Input
            accessibilityLabel={i18n.t('communityName')}
            label={i18n.t('communityName')}
            testID="community-name"
            value={state.name}
            maxLength={32}
            onChangeText={handleChangeName}
            onEndEditing={handleEndEdit}
            error={error}
            boxStyle={{ marginTop: 28 }}
        />
    );
}

function CommunityCover() {
    const [toggleDimensionsModal, setToggleDimensionsModal] = useState(false);

    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

    const pickImage = async () => {
        const result = (await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        })) as {
            cancelled: false;
        } & ImageInfo;

        const { width, height } = result;

        if (!result.cancelled) {
            if (width >= 784 && height >= 784) {
                dispatch({
                    type: formAction.SET_COVER_IMAGE,
                    payload: result.uri,
                });
                dispatch({
                    type: formAction.SET_COVER_VALID,
                    payload: result.uri.length > 0,
                });
            } else {
                setToggleDimensionsModal(true);
            }
        }
    };

    if (state.coverImage.length > 0) {
        return (
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
                        uri: state.coverImage,
                    }}
                />
                <CloseStorySvg
                    style={{
                        position: 'absolute',
                        top: 38,
                        right: 14,
                    }}
                    onPress={() => {
                        dispatch({
                            type: formAction.SET_COVER_IMAGE,
                            payload: '',
                        });
                    }}
                />
            </View>
        );
    }

    return (
        <View
            style={{
                marginTop: 12,
                marginBottom: 24,
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <View
                    style={{
                        flexDirection: 'column',
                    }}
                >
                    <Headline
                        style={{
                            fontFamily: 'Manrope-Bold',
                            fontSize: 15,
                            lineHeight: 24,
                        }}
                    >
                        {i18n.t('changeCoverImage')}
                    </Headline>
                    <Text
                        style={{
                            color: '#73839D',
                            fontFamily: 'Inter-Regular',
                            fontSize: 14,
                            lineHeight: 24,
                        }}
                    >
                        {i18n.t('minCoverSize')}
                    </Text>
                </View>
                <Pressable
                    accessibilityLabel="image uploader"
                    style={{
                        width: 98,
                        height: 44,
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        backgroundColor: '#E9EDF4',
                        borderRadius: 8,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    onPress={pickImage}
                >
                    <Text
                        style={{
                            color: '#333239',
                            fontFamily: 'Inter-Regular',
                            fontSize: 15,
                            lineHeight: 16,
                        }}
                    >
                        {i18n.t('upload')}
                    </Text>
                </Pressable>
                <Portal>
                    <Modal
                        visible={toggleDimensionsModal}
                        title={i18n.t('modalErrorTitle')}
                        onDismiss={() => {
                            setToggleDimensionsModal(false);
                        }}
                        buttons={
                            <Button
                                modeType="gray"
                                style={{ width: '100%' }}
                                onPress={() => {
                                    setToggleDimensionsModal(false);
                                }}
                            >
                                {i18n.t('close')}
                            </Button>
                        }
                    >
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
                    </Modal>
                </Portal>
            </View>
            {!state.validation.cover && (
                <Text
                    style={{
                        color: '#EB5757',
                        fontSize: 12,
                        lineHeight: 20,
                        fontFamily: 'Inter-Regular',
                        justifyContent: 'flex-start',
                    }}
                >
                    {i18n.t('coverImageRequired')}
                </Text>
            )}
        </View>
    );
}

export default function Metadata() {
    return (
        <View>
            <Headline
                style={{
                    fontFamily: 'Manrope-Bold',
                    fontSize: 15,
                    lineHeight: 24,
                }}
            >
                {i18n.t('communityDetails')}
            </Headline>
            <Text
                style={{
                    fontFamily: 'Inter-Regular',
                    fontSize: 14,
                    lineHeight: 24,
                }}
            >
                {i18n.t('communityDescriptionLabel')}
            </Text>
            <CommunityName />
            <CommunityCover />
            <Text
                style={{
                    color: '#73839D',
                    marginBottom: 16,
                    fontFamily: 'Inter-Regular',
                    fontSize: 14,
                    lineHeight: 24,
                }}
            >
                {i18n.t('communityPicsImportance')}
            </Text>
            <CommunityDescription />
            <CommunityCity />
            <CommunityCountry />
            <CommunityLocation />
            <CommunityEmail />
            <CommunityCurrency />
        </View>
    );
}
