import i18n from 'assets/i18n';
import Input from 'components/core/Input';
import CloseStorySvg from 'components/svg/CloseStorySvg';
import * as ImagePicker from 'expo-image-picker';
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types';
import React, { useReducer, useState } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Headline } from 'react-native-paper';

import { formAction, formInitialState, reducer } from './state';

function CommunityCity() {
    const [isCityValid, setIsCityValid] = useState(true);
    const [state, dispatch] = useReducer(reducer, formInitialState);

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
    const [state, dispatch] = useReducer(reducer, formInitialState);

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
    const [state, dispatch] = useReducer(reducer, formInitialState);

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
                label={i18n.t('communityName')}
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
    const [state, dispatch] = useReducer(reducer, formInitialState);

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
        </View>
    );
}
