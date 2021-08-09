import countriesJSON from 'assets/countries.json';
import i18n from 'assets/i18n';
import renderHeader from 'components/core/HeaderBottomSheetTitle';
import Input from 'components/core/Input';
import Select from 'components/core/Select';
import CloseStorySvg from 'components/svg/CloseStorySvg';
import * as ImagePicker from 'expo-image-picker';
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types';
import React, { useContext, useRef, useState } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Headline, Searchbar } from 'react-native-paper';
import { Portal } from 'react-native-portalize';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ipctColors } from 'styles/index';

import { DispatchContext, formAction, StateContext } from './state';

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
        <Pressable onPress={() => handleSelectCountry(item)}>
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
                                        setSearchCountryQuery(e);
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
                                        setSearchCountryQuery(e);
                                    }
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
        </View>
    );
}
