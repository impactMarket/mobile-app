import Button from 'components/core/Button';
import Input from 'components/core/Input';
import BackSvg from 'components/svg/header/BackSvg';
import React, { useLayoutEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    ImageBackground,
    Alert,
    useWindowDimensions,
    Pressable,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import CloseStorySvg from 'components/svg/CloseStorySvg';
import { useNavigation } from '@react-navigation/native';
import SubmitStory from 'navigator/header/SubmitStory';
import Api from 'services/api';
import { useSelector } from 'react-redux';
import { IRootState } from 'helpers/types/state';
import i18n from 'assets/i18n';
import { StatusBar } from 'expo-status-bar';
import CarouselSlide from './CarouselSlide';
import countriesJSON from 'assets/countries.json';

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
function NewStoryScreen() {
    const dimensions = useWindowDimensions();
    const navigation = useNavigation();
    const [storyText, setStoryText] = useState('');
    const [storyMedia, setStoryMedia] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submittedWithSuccess, setSubmittedWithSuccess] = useState(false);
    const userAddress = useSelector(
        (state: IRootState) => state.user.wallet.address
    );
    const userCommunity = useSelector(
        (state: IRootState) => state.user.community.metadata
    );
    const userCommunityStatus = useSelector(
        (state: IRootState) => state.user.community.metadata?.status
    );

    useLayoutEffect(() => {
        if (userCommunity?.id !== undefined) {
            navigation.setOptions({
                headerShown: !submittedWithSuccess,
                headerRight: () => (
                    <SubmitStory
                        submit={submitNewStory}
                        submitting={submitting}
                    />
                ),
            });
            // TODO: this next line should change though.
        }
    }, [
        navigation,
        storyText,
        storyMedia,
        submitting,
        userCommunity,
        submittedWithSuccess,
    ]);

    const submitNewStory = () => {
        setSubmitting(true);
        Api.story
            .add(storyMedia, userCommunity.id, storyText, userAddress)
            .then((r) => {
                Alert.alert(
                    i18n.t('success'),
                    'Congratulations, your story was submitted!',
                    [{ text: 'OK' }],
                    { cancelable: false }
                );
                setSubmittedWithSuccess(true);
            })
            .catch((e) => {
                Alert.alert(
                    i18n.t('failure'),
                    'Error uploading story!',
                    [{ text: 'OK' }],
                    { cancelable: false }
                );
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    const pickImage = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert('Permission to access camera roll is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            // allowsEditing: true,
            // aspect: [1, 1],
            quality: 1,
        });

        if (!result.cancelled) {
            setStoryMedia(result.uri);
        }
    };

    if (userCommunity?.id === undefined || userCommunityStatus !== 'valid') {
        return <Text>Not in a community!</Text>;
    }

    // TODO: most of the code above is repeated from Carousel
    // make it reusable!
    console.log('submittedWithSuccess', submittedWithSuccess);
    if (submittedWithSuccess) {
        return (
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <StatusBar hidden={true} />
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        // backgroundColor: 'blue',
                        width: dimensions.width,
                        justifyContent: 'space-between',
                    }}
                >
                    <CarouselSlide media={storyMedia} />
                    <View
                        style={{
                            // position: 'absolute',
                            // zIndex: 1,
                            width: '100%',
                            // backgroundColor: 'pink',
                            // height: 98,
                        }}
                    >
                        <View
                            style={{
                                marginTop: 26,
                                marginHorizontal: 19,
                                // flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <Image
                                    source={{
                                        uri: userCommunity.coverImage,
                                    }}
                                    style={{
                                        height: 48,
                                        width: 48,
                                        borderRadius: 24,
                                    }}
                                />
                                <View
                                    style={{
                                        flexDirection: 'column',
                                        marginLeft: 12,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: 'Gelion-Bold',
                                            fontSize: 19,
                                            lineHeight: 22,
                                            color: '#FAFAFA',
                                        }}
                                    >
                                        {userCommunity.name.length > 23
                                            ? userCommunity.name.substr(0, 22) +
                                              '...'
                                            : userCommunity.name}
                                    </Text>
                                    <Text
                                        style={{
                                            fontFamily: 'Gelion-Bold',
                                            fontSize: 15,
                                            lineHeight: 18,
                                            color: '#FAFAFA',
                                        }}
                                    >
                                        {countries[userCommunity.country].name},{' '}
                                        {userCommunity.city.length > 15
                                            ? userCommunity.city.substr(0, 13) +
                                              '...'
                                            : userCommunity.city}
                                    </Text>
                                </View>
                            </View>
                            <Pressable
                                hitSlop={15}
                                onPress={(e) => navigation.goBack()}
                                style={{
                                    right: 0,
                                }}
                            >
                                <CloseStorySvg />
                            </Pressable>
                        </View>
                    </View>
                    <View
                        style={{
                            // position: 'absolute',
                            width: '100%',
                            // alignSelf: 'flex-end',
                            // backgroundColor: 'purple',
                            // height: 200,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'Gelion-Regular',
                                fontSize: 20,
                                lineHeight: 24,
                                color: 'white',
                                textAlign: 'center',
                                marginHorizontal: 22,
                            }}
                        >
                            {storyText}
                        </Text>
                        <View
                            style={{
                                marginVertical: 27,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <View style={{ flexDirection: 'row' }}>
                                <Text
                                    style={{
                                        marginLeft: 8,
                                        fontFamily: 'Gelion-Regular',
                                        fontSize: 16,
                                        lineHeight: 19,
                                        color: 'white',
                                    }}
                                >
                                    -- Loves
                                </Text>
                            </View>
                            <Button
                                modeType="green"
                                bold
                                disabled={true}
                                style={{ marginRight: 22, width: 158 }}
                            >
                                Donate
                            </Button>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View style={{ marginHorizontal: 18 }}>
            <Input
                label="Story Post Text · Optional"
                multiline={true}
                numberOfLines={4}
                value={storyText}
                maxLength={256}
                onChangeText={(value) => setStoryText(value)}
            />
            <Button
                modeType="default"
                bold
                onPress={() => pickImage()}
                style={{ width: '100%', marginVertical: 24 }}
            >
                Attach
            </Button>
            {storyMedia.length > 0 && (
                <ImageBackground
                    source={{ uri: storyMedia }}
                    imageStyle={{
                        borderRadius: 4,
                    }}
                    style={{
                        width: 148,
                        height: 100,
                    }}
                >
                    <CloseStorySvg
                        style={{
                            alignSelf: 'flex-end',
                            marginTop: 14,
                            marginRight: 10,
                        }}
                        onPress={(e) => setStoryMedia('')}
                    />
                </ImageBackground>
            )}
        </View>
    );
}

NewStoryScreen.navigationOptions = () => {
    return {
        headerLeft: () => <BackSvg />,
        headerTitle: 'New Story',
    };
};

export default NewStoryScreen;
