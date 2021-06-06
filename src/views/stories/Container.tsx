import { useNavigation } from '@react-navigation/native';
import countriesJSON from 'assets/countries.json';
import i18n from 'assets/i18n';
import ModalGenericError from 'components/core/ModalGenericError';
import AvatarPlaceholderSvg from 'components/svg/AvatarPlaceholderSvg';
import CloseStorySvg from 'components/svg/CloseStorySvg';
import DeleteSvg from 'components/svg/DeleteSvg';
import ReportInapropriateSvg from 'components/svg/ReportInapropriateSvg';
import ShareSvg from 'components/svg/ShareSvg';
import ThreeDotsSvg from 'components/svg/header/ThreeDotsSvg';
import Clipboard from 'expo-clipboard';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Screens } from 'helpers/constants';
import { chooseMediaThumbnail } from 'helpers/index';
import { ICommunityStories, ICommunityStory } from 'helpers/types/endpoints';
import { IRootState } from 'helpers/types/state';
import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    Pressable,
    Alert,
    StyleProp,
    TextStyle,
    useWindowDimensions,
    StyleSheet,
} from 'react-native';
import { useSelector } from 'react-redux';
import Api from 'services/api';
import { ipctColors } from 'styles/index';

import CarouselSlide from './CarouselSlide';

export default function Container({
    story,
    community,
    communityId,
}: // media,
// message,
{
    community: ICommunityStories;
    story: ICommunityStory;
    communityId: number;
}) {
    const { cover, name, country, city } = community;
    const { media, message, byAddress } = story;
    const [openThreeDotsMenu, setOpenThreeDotsMenu] = useState(false);
    const [toggleInformativeModal, setToggleInformativeModal] = useState(false);
    const dimensions = useWindowDimensions();

    const userAddress = useSelector(
        (state: IRootState) => state.user.wallet.address
    );

    const communityMetadata = useSelector(
        (state: IRootState) => state.user.community.metadata
    );

    const navigation = useNavigation();

    const titleStyle: StyleProp<TextStyle> = {
        textAlign: 'left',
        marginLeft: 12,
        fontSize: 22,
    };

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

    const renderInformativeModal = () => (
        <ModalGenericError
            title={i18n.t('modalErrorTitle')}
            description={i18n.t('modalErrorDescription')}
            btnString={i18n.t('close')}
            closeFn={setToggleInformativeModal(false)}
            btnFn={setToggleInformativeModal(false)}
        />
    );
    return (
        <>
            {toggleInformativeModal && renderInformativeModal()}

            <View
                style={{
                    width: '100%',
                    alignItems: 'center',
                    top: 5,
                }}
            >
                <View
                    style={{
                        marginTop: 26,
                        marginHorizontal: 19,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <Pressable
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            flex: 1,
                        }}
                        onPress={() =>
                            navigation.navigate(Screens.CommunityDetails, {
                                communityId,
                            })
                        }
                    >
                        {cover.url.length > 0 ? (
                            <Image
                                source={{
                                    uri: chooseMediaThumbnail(cover, {
                                        heigth: 42,
                                        width: 42,
                                    }),
                                }}
                                style={{
                                    height: 48,
                                    width: 48,
                                    borderRadius: 24,
                                }}
                            />
                        ) : (
                            <View
                                style={{
                                    height: 48,
                                    width: 48,
                                    borderRadius: 24,
                                }}
                            >
                                <AvatarPlaceholderSvg
                                    style={styles.avatar}
                                    width="100%"
                                    height="100%"
                                    color={ipctColors.white}
                                />
                            </View>
                        )}

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
                                {name?.length > 17
                                    ? name.substr(0, 17) + '...'
                                    : name}
                            </Text>
                            {country.length > 0 && (
                                <Text
                                    style={{
                                        fontFamily: 'Gelion-Regular',
                                        fontSize: 15,
                                        lineHeight: 18,
                                        color: '#FAFAFA',
                                    }}
                                >
                                    {countries[country]?.name},{' '}
                                    {city?.length > 15
                                        ? city.substr(0, 13) + '...'
                                        : city}
                                </Text>
                            )}
                        </View>
                    </Pressable>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignSelf: 'center',
                        }}
                    >
                        {userAddress.length > 0 && (
                            <ThreeDotsSvg
                                setOpenThreeDotsMenu={setOpenThreeDotsMenu}
                                openThreeDotsMenu={openThreeDotsMenu}
                                style={{ marginHorizontal: 6 }}
                                title={i18n.t('story')}
                                titleStyle={titleStyle}
                                hasCloseBtn
                            >
                                <>
                                    {byAddress === userAddress && (
                                        <Pressable
                                            style={{
                                                flexDirection: 'row',
                                                width: '100%',
                                                alignItems: 'center',
                                                justifyContent: 'flex-start',
                                                marginLeft: 24,
                                                marginVertical: 12,
                                            }}
                                            hitSlop={15}
                                            onPress={() => {
                                                Alert.alert(
                                                    i18n.t('delete'),
                                                    i18n.t('deleteWarning'),
                                                    [
                                                        {
                                                            text: i18n.t(
                                                                'cancel'
                                                            ),
                                                            onPress: () =>
                                                                console.log(
                                                                    'Cancel Pressed'
                                                                ),
                                                            style: 'cancel',
                                                        },
                                                        {
                                                            text: i18n.t(
                                                                'confirm'
                                                            ),
                                                            onPress: () =>
                                                                Api.story
                                                                    .remove(
                                                                        story.id
                                                                    )
                                                                    .then(() =>
                                                                        Alert.alert(
                                                                            i18n.t(
                                                                                'success'
                                                                            ),
                                                                            i18n.t(
                                                                                'deleteSuccess'
                                                                            ),
                                                                            [
                                                                                {
                                                                                    text: i18n.t(
                                                                                        'close'
                                                                                    ),
                                                                                    onPress: () =>
                                                                                        navigation.navigate(
                                                                                            Screens.Communities
                                                                                        ),
                                                                                },
                                                                            ]
                                                                        )
                                                                    ),
                                                        },
                                                    ]
                                                );
                                            }}
                                        >
                                            <DeleteSvg />
                                            <Text
                                                style={{
                                                    marginLeft: 13.4,
                                                    fontFamily: 'Manrope-Bold',
                                                    fontSize: 14,
                                                }}
                                            >
                                                {i18n.t('delete')}
                                            </Text>
                                        </Pressable>
                                    )}

                                    <Pressable
                                        style={{
                                            flexDirection: 'row',
                                            width: '100%',
                                            alignItems: 'center',
                                            justifyContent: 'flex-start',
                                            marginLeft: 24,
                                            marginVertical: 12,
                                        }}
                                        hitSlop={15}
                                        onPress={() => {
                                            Alert.alert(
                                                i18n.t('reportAsInapropriated'),
                                                i18n.t(
                                                    'reportInapropriateWarning'
                                                ),
                                                [
                                                    {
                                                        text: i18n.t('cancel'),
                                                        onPress: () =>
                                                            console.log(
                                                                'Cancel Pressed'
                                                            ),
                                                        style: 'cancel',
                                                    },
                                                    {
                                                        text: i18n.t('confirm'),
                                                        onPress: () =>
                                                            Api.story
                                                                .inapropriate(
                                                                    story.id
                                                                )
                                                                .then(() =>
                                                                    Alert.alert(
                                                                        i18n.t(
                                                                            'success'
                                                                        ),
                                                                        i18n.t(
                                                                            'reportInapropriateSuccess'
                                                                        ),
                                                                        [
                                                                            {
                                                                                text: i18n.t(
                                                                                    'close'
                                                                                ),
                                                                                onPress: () =>
                                                                                    navigation.navigate(
                                                                                        Screens.Communities
                                                                                    ),
                                                                            },
                                                                        ]
                                                                    )
                                                                ),
                                                    },
                                                ]
                                            );
                                        }}
                                    >
                                        <ReportInapropriateSvg
                                            reported={story.userReported}
                                        />
                                        <Text
                                            style={{
                                                marginLeft: 13.4,
                                                fontFamily: 'Manrope-Bold',
                                                fontSize: 14,
                                            }}
                                        >
                                            {story.userReported
                                                ? i18n.t(
                                                      'reportedAsInapropriated'
                                                  )
                                                : i18n.t(
                                                      'reportAsInapropriated'
                                                  )}
                                        </Text>
                                    </Pressable>
                                    {media && (
                                        <Pressable
                                            hitSlop={15}
                                            style={{
                                                flexDirection: 'row',
                                                width: '100%',
                                                alignItems: 'center',
                                                justifyContent: 'flex-start',
                                                marginLeft: 24,
                                                marginVertical: 12,
                                            }}
                                            onPress={() => {
                                                FileSystem.downloadAsync(
                                                    media.url,
                                                    FileSystem.documentDirectory +
                                                        '.jpeg'
                                                )
                                                    .then(({ uri }) => {
                                                        Sharing.shareAsync(uri);
                                                        Clipboard.setString(
                                                            `https://www.impactmarket.com/communities/${community.id}`
                                                        );
                                                    })
                                                    .catch(() => {
                                                        setToggleInformativeModal(
                                                            true
                                                        );
                                                    });
                                            }}
                                        >
                                            <ShareSvg />
                                            <Text
                                                style={{
                                                    marginLeft: 13.4,
                                                    fontFamily: 'Manrope-Bold',
                                                    fontSize: 14,
                                                }}
                                            >
                                                {i18n.t('share')}
                                            </Text>
                                        </Pressable>
                                    )}
                                </>
                            </ThreeDotsSvg>
                        )}
                        <Pressable
                            hitSlop={15}
                            onPress={() => navigation.goBack()}
                            style={{
                                right: 0,
                            }}
                        >
                            <CloseStorySvg />
                        </Pressable>
                    </View>
                </View>
            </View>
            {media ? (
                <CarouselSlide media={media} />
            ) : (
                <Text
                    style={{
                        fontFamily: 'Gelion-Regular',
                        fontSize: 20,
                        lineHeight: 24,
                        color: 'white',
                        textAlign: 'center',
                        marginHorizontal: 22,
                        top: dimensions.height * 0.35,
                    }}
                >
                    {message}
                </Text>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    avatar: {
        height: 48,
        width: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 16,
        marginRight: 16,
    },
});
