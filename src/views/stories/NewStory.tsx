import Button from 'components/core/Button';
import Input from 'components/core/Input';
import BackSvg from 'components/svg/header/BackSvg';
import React, { useLayoutEffect, useState } from 'react';
import {
    View,
    SafeAreaView,
    Text,
    ImageBackground,
    Alert,
    useWindowDimensions,
    StyleSheet,
} from 'react-native';
import { Screens } from 'helpers/constants';
import { useDispatch, useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import CloseStorySvg from 'components/svg/CloseStorySvg';
import { useNavigation } from '@react-navigation/native';
import SubmitStory from 'navigator/header/SubmitStory';
import Api from 'services/api';
import { IRootState } from 'helpers/types/state';
import i18n from 'assets/i18n';
import { StatusBar } from 'expo-status-bar';
import Container from './Container';
import { modalDonateAction } from 'helpers/constants';

function NewStoryScreen() {
    const dimensions = useWindowDimensions();
    const navigation = useNavigation();
    const dispatch = useDispatch();
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
                    i18n.t('storyCongrat'),
                    [{ text: 'OK' }],
                    { cancelable: false }
                );
                setSubmittedWithSuccess(true);
            })
            .catch((e) => {
                Alert.alert(
                    i18n.t('failure'),
                    i18n.t('storyFailure'),
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
            alert(i18n.t('storyPermissionCamera'));
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
        return <Text>{i18n.t('notInComunity')}</Text>;
    }
    console.log({ userCommunity });
    // TODO: most of the code above is repeated from Carousel
    // make it reusable!
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
                        paddingTop: 20,
                    }}
                >
                    <Container media={storyMedia} story={userCommunity} />
                    <View style={{ width: '100%' }}>
                        <Text
                            style={{
                                fontFamily: 'Gelion-Regular',
                                fontSize: 20,
                                lineHeight: 24,
                                color: 'white',
                                textAlign: 'left',
                                marginHorizontal: 22,
                            }}
                        >
                            {storyText}
                        </Text>
                        <View
                            style={{
                                marginVertical: 27,
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                                alignItems: 'center',
                            }}
                        >
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.donateLabel}>-- Loves</Text>
                            </View>
                            <Button
                                modeType="green"
                                bold
                                style={styles.donate}
                                labelStyle={styles.donateLabel}
                                onPress={() =>
                                    navigation.navigate(
                                        Screens.CommunityDetails,
                                        {
                                            communityId: userCommunity.publicId,
                                            openDonate: true,
                                        }
                                    )
                                }
                            >
                                {i18n.t('donate')}
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
                isBig
            />
            <Button
                modeType="default"
                bold
                onPress={() => pickImage()}
                style={{ width: '100%', marginVertical: 24 }}
            >
                {i18n.t('attach')}
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

const styles = StyleSheet.create({
    donate: {
        borderRadius: 5,
        width: 158,
        height: 39,
    },
    donateLabel: {
        fontFamily: 'Gelion-Regular',
        fontSize: 16,
        lineHeight: 19,
        color: 'white',
        letterSpacing: 0.3,
    },
});

NewStoryScreen.navigationOptions = () => {
    return {
        headerLeft: () => <BackSvg />,
        headerTitle: 'New Story',
    };
};

export default NewStoryScreen;
