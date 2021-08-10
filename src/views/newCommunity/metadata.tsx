import countriesJSON from 'assets/countries.json';
import currenciesJSON from 'assets/currencies.json';
import i18n from 'assets/i18n';
import Button from 'components/core/Button';
import renderHeader from 'components/core/HeaderBottomSheetTitle';
import Input from 'components/core/Input';
import Select from 'components/core/Select';
import CloseStorySvg from 'components/svg/CloseStorySvg';
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

import { DispatchContext, formAction, StateContext } from './state';

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
    const [isEmailValid, setIsEmailValid] = useState(true);

    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

    const handleEmailChange = (value) =>
        dispatch({
            type: formAction.SET_EMAIL,
            payload: value,
        });

    return (
        <View>
            <Input
                style={{
                    fontFamily: 'Gelion-Regular',
                    backgroundColor: 'transparent',
                    paddingHorizontal: 0,
                }}
                label={i18n.t('email')}
                value={state.email}
                maxLength={64}
                keyboardType="email-address"
                onChangeText={handleEmailChange}
                onEndEditing={() => setIsEmailValid(validateEmail(state.email))}
            />
            {/* {!isEmailValid && (
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
            )} */}
        </View>
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
            {/* {!isEnabled && (
                <HelperText
                    type="error"
                    padding="none"
                    visible
                    style={styles.errorText}
                >
                    {i18n.t('enablingGPSRequired')}
                </HelperText>
            )} */}
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
                            : 'Select Country'
                    }
                    onPress={() => modalizeCountryRef.current?.open()}
                />
                {/* {!isCountryValid && (
            <HelperText
                type="error"
                padding="none"
                visible
                style={styles.errorText}
            >
                {i18n.t('countryRequired')}
            </HelperText>
        )} */}
            </View>
            <Portal>
                <Modalize
                    ref={modalizeCountryRef}
                    HeaderComponent={
                        <View>
                            {renderHeader(
                                i18n.t('country'),
                                modalizeCountryRef,
                                () => modalizeCountryRef.current?.close()
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
    const [isCityValid, setIsCityValid] = useState(true);
    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

    const handleChangeCity = (value) => {
        dispatch({ type: formAction.SET_CITY, payload: value });
    };

    return (
        <View style={{ marginTop: 28 }}>
            <Input
                style={{
                    fontFamily: 'Gelion-Regular',
                    backgroundColor: 'transparent',
                    paddingHorizontal: 0,
                }}
                label={i18n.t('city')}
                value={state.city}
                maxLength={32}
                onChangeText={handleChangeCity}
                onEndEditing={() => setIsCityValid(state.city.length > 0)}
            />
            {/* {!isCityValid && (
                <HelperText
                    type="error"
                    visible
                    padding="none"
                    style={styles.errorText}
                >
                    {i18n.t('cityRequired')}
                </HelperText>
            )} */}
        </View>
    );
}

function CommunityDescription() {
    const [isDescriptionValid, setIsDescriptionValid] = useState(true);
    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

    const handleChangeDescription = (value) => {
        dispatch({ type: formAction.SET_DESCRIPTION, payload: value });
    };
    return (
        <View style={{ marginTop: 16, minHeight: 115 }}>
            <Input
                style={{
                    minHeight: 115,
                    fontFamily: 'Gelion-Regular',
                    backgroundColor: 'transparent',
                    paddingHorizontal: 0,
                }}
                label={i18n.t('shortDescription')}
                value={state.description}
                maxLength={1024}
                onChangeText={handleChangeDescription}
                onEndEditing={() =>
                    setIsDescriptionValid(state.description.length >= 240)
                }
                multiline
                numberOfLines={6}
            />
        </View>
        // {!isDescriptionValid && (
        //     <HelperText
        //         type="error"
        //         padding="none"
        //         visible
        //         style={styles.errorText}
        //     >
        //         {i18n.t('communityDescriptionRequired')}
        //     </HelperText>
        // )}
        // {!isDescriptionTooShort && (
        //     <HelperText
        //         type="error"
        //         padding="none"
        //         visible
        //         style={styles.errorText}
        //     >
        //         {i18n.t('communityDescriptionTooShort')}
        //     </HelperText>
        // )}
    );
}

function CommunityName() {
    const [isNameValid, setIsNameValid] = useState(true);
    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

    const handleChangeName = (value) => {
        dispatch({ type: formAction.SET_NAME, payload: value });
    };

    return (
        <View style={{ marginTop: 28 }}>
            <Input
                style={{
                    fontFamily: 'Gelion-Regular',
                    backgroundColor: 'transparent',
                    paddingHorizontal: 0,
                }}
                accessibilityLabel={i18n.t('communityName')}
                label={i18n.t('communityName')}
                testID="community-name"
                value={state.name}
                maxLength={32}
                onChangeText={handleChangeName}
                onEndEditing={() => setIsNameValid(state.name.length > 0)}
            />
            {/* {!isNameValid && (
                <HelperText
                    type="error"
                    padding="none"
                    visible
                    style={styles.errorText}
                >
                    {i18n.t('communityNameRequired')}
                </HelperText>
            )} */}
        </View>
    );
}

function CommunityCover() {
    const [isCoverImageValid, setIsCoverImageValid] = useState(true);
    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

    const pickImage = async () =>
        // cb: Dispatch<React.SetStateAction<string>>,
        // cbv: Dispatch<React.SetStateAction<boolean>>
        {
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
                } else {
                    // TODO:
                    // setToggleImageDimensionsModal(true);
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
                flexDirection: 'row',
                width: '100%',
                marginBottom: 24,
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
                    Min. 784px by 784px
                </Text>
                {/* TODO: {!isCoverImageValid && (
                    <HelperText
                        type="error"
                        padding="none"
                        visible
                        style={styles.errorText}
                    >
                        {i18n.t('coverImageRequired')}
                    </HelperText>
                )} */}
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
                    Upload
                </Text>
            </Pressable>
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
