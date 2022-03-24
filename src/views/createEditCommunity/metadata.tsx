import { Image } from '@impact-market/ui-kit';
import currenciesJSON from 'assets/currencies.json';
import i18n from 'assets/i18n';
import axios, { AxiosResponse } from 'axios';
import Modal from 'components/Modal';
// import ShimmerPlaceholder from 'components/ShimmerPlaceholder';
import Button from 'components/core/Button';
import renderHeader from 'components/core/HeaderBottomSheetTitle';
import Input from 'components/core/Input';
import Select from 'components/core/Select';
import BackSvg from 'components/svg/BackSvg';
import CloseStorySvg from 'components/svg/CloseStorySvg';
import WarningTriangle from 'components/svg/WarningTriangle';
import * as ImagePicker from 'expo-image-picker';
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types';
import { IRootState } from 'helpers/types/state';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Modal as RNModal } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Headline, Searchbar } from 'react-native-paper';
import { Portal } from 'react-native-portalize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { ipctColors } from 'styles/index';

import config from '../../../config';
import PlaceSearch from './component/PlaceSearch';
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
    }, [dispatch, userCurrency]);

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
                    label={i18n.t('generic.currency')}
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
                                i18n.t('generic.currency'),
                                modalizeCurrencyRef,
                                () => modalizeCurrencyRef.current?.close()
                            )}
                            <Searchbar
                                placeholder={i18n.t('generic.search')}
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
        ? i18n.t('createCommunity.emailRequired')
        : !state.validation.emailFormat
        ? i18n.t('createCommunity.emailInvalidFormat')
        : undefined;

    return (
        <Input
            accessibilityLabel={i18n.t('generic.email')}
            label={i18n.t('generic.email')}
            value={state.email}
            maxLength={64}
            keyboardType="email-address"
            onChangeText={handleEmailChange}
            onEndEditing={handleEndEdit}
            error={error}
            boxStyle={{ marginTop: 28 }}
        />
    );
}

function CommunityCity() {
    const insets = useSafeAreaInsets();
    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

    const userLanguage = useSelector(
        (state: IRootState) => state.user.metadata.language
    );

    const [toggleModal, setToggleModal] = useState(false);

    const handleChangeCity = (value: string) => {};

    const handleOnFocus = () => setToggleModal(true);

    const handleEndEdit = () => validateField(state, dispatch).city();

    const error = state.validation.city
        ? undefined
        : i18n.t('createCommunity.cityCountryRequired');

    return (
        <>
            <Input
                accessibilityLabel={i18n.t('generic.cityCountry')}
                label={i18n.t('generic.cityCountry')}
                value={state.city}
                maxLength={32}
                onChangeText={handleChangeCity}
                onEndEditing={handleEndEdit}
                onFocus={handleOnFocus}
                error={error}
                boxStyle={{ marginTop: 28 }}
            />
            <Portal>
                <RNModal visible={toggleModal}>
                    <View
                        style={{
                            marginTop: insets.top + 15,
                            flexDirection: 'row',
                            marginHorizontal: 20,
                        }}
                    >
                        <BackSvg
                            onPress={() => {
                                setToggleModal(false);
                            }}
                            style={{ marginRight: 18, marginTop: 6 }}
                        />
                        <PlaceSearch
                            userLanguage={userLanguage}
                            onPress={(data) => {
                                if (
                                    data.description.indexOf(',') !== -1 &&
                                    data.description.indexOf(',') !==
                                        data.description.lastIndexOf(',')
                                ) {
                                    dispatch({
                                        type: formAction.SET_CITY,
                                        payload: data.description.substring(
                                            0,
                                            data.description.lastIndexOf(',') -
                                                1
                                        ),
                                    });
                                    dispatch({
                                        type: formAction.SET_CITY_VALID,
                                        payload: true,
                                    });
                                    axios
                                        .get<
                                            never,
                                            AxiosResponse<{
                                                result: {
                                                    address_components: {
                                                        types: string[];
                                                        short_name: string;
                                                    }[];
                                                    geometry: {
                                                        location: {
                                                            lat: number;
                                                            lng: number;
                                                        };
                                                    };
                                                };
                                            }>
                                        >(
                                            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${data.place_id}&key=${config.googleApiKey}`
                                        )
                                        .then((response) => {
                                            const {
                                                address_components,
                                                geometry,
                                            } = response.data.result;
                                            const { lat, lng } =
                                                geometry.location;
                                            dispatch({
                                                type: formAction.SET_GPS,
                                                payload: {
                                                    latitude: lat,
                                                    longitude: lng,
                                                },
                                            });
                                            dispatch({
                                                type: formAction.SET_COUNTRY,
                                                payload:
                                                    address_components.find(
                                                        (c) =>
                                                            c.types.includes(
                                                                'country'
                                                            )
                                                    ).short_name,
                                            });
                                        })
                                        .catch((_) => {
                                            // TODO: do something here
                                        });
                                    setToggleModal(false);
                                } else {
                                    dispatch({
                                        type: formAction.SET_CITY_VALID,
                                        payload: false,
                                    });
                                }
                            }}
                        />
                    </View>
                </RNModal>
            </Portal>
        </>
    );
}

function CommunityDescription() {
    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

    const handleChangeDescription = (value: string) => {
        dispatch({ type: formAction.SET_DESCRIPTION, payload: value });
    };

    const error = !state.validation.description
        ? i18n.t('createCommunity.communityDescriptionRequired')
        : state.validation.descriptionTooShort
        ? i18n.t('createCommunity.communityDescriptionTooShort')
        : undefined;

    const handleEndEdit = () => validateField(state, dispatch).description();

    return (
        <Input
            accessibilityLabel={i18n.t('createCommunity.shortDescription')}
            label={i18n.t('createCommunity.shortDescription')}
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
        : i18n.t('createCommunity.communityNameRequired');

    return (
        <Input
            accessibilityLabel={i18n.t('createCommunity.communityName')}
            label={i18n.t('createCommunity.communityName')}
            value={state.name}
            maxLength={32}
            onChangeText={handleChangeName}
            onEndEditing={handleEndEdit}
            error={error}
            boxStyle={{ marginTop: 28 }}
        />
    );
}

function CommunityCover(props: { edit?: boolean }) {
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

        // const { width, height } = result;

        if (!result.cancelled) {
            // if (width >= 784 && height >= 784) {
            dispatch({
                type: formAction.SET_COVER_IMAGE,
                payload: result.uri,
            });
            dispatch({
                type: formAction.SET_COVER_VALID,
                payload: result.uri.length > 0,
            });
            // } else {
            //     setToggleDimensionsModal(true);
            // }
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
                    testID="remove-cover"
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
                        {i18n.t('createCommunity.changeCoverImage')}
                    </Headline>
                    <Text
                        style={{
                            color: '#73839D',
                            fontFamily: 'Inter-Regular',
                            fontSize: 14,
                            lineHeight: 24,
                        }}
                    >
                        {i18n.t('createCommunity.minCoverSize')}
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
                        {i18n.t('generic.upload')}
                    </Text>
                </Pressable>
                <Portal>
                    <Modal
                        visible={toggleDimensionsModal}
                        title={i18n.t('errors.modals.title')}
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
                                {i18n.t('generic.close')}
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
                    {i18n.t('createCommunity.coverImageRequired')}
                </Text>
            )}
        </View>
    );
}

function UserProfilePicture() {
    const [toggleDimensionsModal, setToggleDimensionsModal] = useState(false);

    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);
    const userProfilePicture = useSelector(
        (state: IRootState) => state.user.metadata.avatar
    );

    const pickImage = async () => {
        const result = (await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        })) as {
            cancelled: false;
        } & ImageInfo;

        // const { width, height } = result;

        if (!result.cancelled) {
            // if (width >= 300 && height >= 300) {
            dispatch({
                type: formAction.SET_PROFILE_IMAGE,
                payload: result.uri,
            });
            dispatch({
                type: formAction.SET_PROFILE_VALID,
                payload: result.uri.length > 0,
            });
            // } else {
            //     setToggleDimensionsModal(true);
            // }
        }
    };

    if (
        userProfilePicture !== null &&
        userProfilePicture !== undefined &&
        userProfilePicture.length > 0
    ) {
        return null;
    }

    if (state.profileImage.length > 0) {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    width: '100%',
                    marginBottom: 24,
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#E9EDF4',
                    paddingVertical: 18.1,
                }}
            >
                <CloseStorySvg
                    style={{
                        position: 'absolute',
                        top: 14,
                        right: 14,
                    }}
                    onPress={() => {
                        dispatch({
                            type: formAction.SET_PROFILE_IMAGE,
                            payload: '',
                        });
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
                    source={{ uri: state.profileImage }}
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
                        {i18n.t('createCommunity.changeProfileImage')}
                    </Headline>
                    <Text
                        style={{
                            color: '#73839D',
                            fontFamily: 'Inter-Regular',
                            fontSize: 14,
                            lineHeight: 24,
                        }}
                    >
                        {i18n.t('createCommunity.minProfilePictureSize')}
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
                        {i18n.t('generic.upload')}
                    </Text>
                </Pressable>
                <Portal>
                    <Modal
                        visible={toggleDimensionsModal}
                        title={i18n.t('errors.modals.title')}
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
                                {i18n.t('generic.close')}
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
                    {i18n.t('createCommunity.profileImageRequired')}
                </Text>
            )}
        </View>
    );
}

export default function Metadata(props: { edit?: boolean }) {
    if (props.edit === true) {
        return (
            <View style={{ paddingBottom: 20 }}>
                <Headline
                    style={{
                        fontFamily: 'Manrope-Bold',
                        fontSize: 15,
                        lineHeight: 24,
                    }}
                >
                    {i18n.t('createCommunity.communityDetails')}
                </Headline>
                <Text
                    style={{
                        fontFamily: 'Inter-Regular',
                        fontSize: 14,
                        lineHeight: 24,
                    }}
                >
                    {i18n.t('createCommunity.communityDescriptionLabel')}
                </Text>
                <CommunityName />
                <CommunityCover edit={props.edit} />
                <CommunityDescription />
                <CommunityCurrency />
            </View>
        );
    }
    return (
        <View>
            <Headline
                style={{
                    fontFamily: 'Manrope-Bold',
                    fontSize: 15,
                    lineHeight: 24,
                }}
            >
                {i18n.t('createCommunity.communityDetails')}
            </Headline>
            <Text
                style={{
                    fontFamily: 'Inter-Regular',
                    fontSize: 14,
                    lineHeight: 24,
                }}
            >
                {i18n.t('createCommunity.communityDescriptionLabel')}
            </Text>
            <CommunityName />
            <CommunityCover />
            <UserProfilePicture />
            <Text
                style={{
                    color: '#73839D',
                    marginBottom: 16,
                    fontFamily: 'Inter-Regular',
                    fontSize: 14,
                    lineHeight: 24,
                }}
            >
                {i18n.t('createCommunity.communityPicsImportance')}
            </Text>
            <CommunityDescription />
            <CommunityCity />
            <CommunityEmail />
            <CommunityCurrency />
        </View>
    );
}
