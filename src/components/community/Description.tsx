import { useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import Dot from 'components/Dot';
import ShimmerText from 'components/shimmers/Text';
import * as WebBrowser from 'expo-web-browser';
import { Screens } from 'helpers/constants';
import { translate } from 'helpers/index';
import { CommunityAttributes } from 'helpers/types/models';
import { IRootState } from 'helpers/types/state';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import HyperlinkedText from 'react-native-hyperlinked-text';
import { useSelector } from 'react-redux';
import { ipctColors } from 'styles/index';

export default function Description(props: {
    community: CommunityAttributes;
    isShort?: boolean;
}) {
    const { community, isShort } = props;
    const { width } = Dimensions.get('screen');
    const navigator = useNavigation();
    const userLanguage = useSelector(
        (state: IRootState) => state.user.metadata.language
    );
    const [description, setDescription] = useState<{
        detectedSourceLanguage?: string;
        translatedText: string;
    }>({ translatedText: '' });
    const [translating, setTranslating] = useState(false);

    const originalDescription =
        isShort !== true
            ? community.description
            : community.description.slice(
                  0,
                  community.description.indexOf('. ') !== -1 &&
                      community.description.length > 179
                      ? community.description.indexOf('. ', 180) !== -1
                          ? community.description.indexOf('.', 180) + 1
                          : community.description.length
                      : community.description.length
              );

    useEffect(() => {
        const translateDescription = () => {
            if (!translating) {
                if (community.language !== userLanguage) {
                    translate(originalDescription, userLanguage).then((r) => {
                        setDescription(r);
                        setTranslating(false);
                    });
                } else {
                    setDescription({
                        translatedText: originalDescription,
                    });
                }
            }
        };
        if (community) {
            translateDescription();
        }
    }, [community]);

    if (description.translatedText.length > 0) {
        const Translated = () => {
            if (description.detectedSourceLanguage === undefined) {
                return null;
            }
            return (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text
                        style={{
                            fontSize: 13,
                            lineHeight: 28,
                            fontFamily: 'Inter-Regular',
                            color: ipctColors.lynch,
                        }}
                    >
                        {i18n.t('generic.translatedFrom', {
                            from: description.detectedSourceLanguage,
                        })}
                    </Text>
                    <Dot />
                    <Pressable
                        hitSlop={15}
                        onPress={() => {
                            setDescription({
                                translatedText: originalDescription,
                            });
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 13,
                                lineHeight: 28,
                                fontFamily: 'Inter-Regular',
                                color: ipctColors.blueRibbon,
                            }}
                        >
                            {i18n.t('community.seeOriginal')}
                        </Text>
                    </Pressable>
                </View>
            );
        };
        return (
            <>
                <Text style={styles.textDescription}>
                    <HyperlinkedText
                        linkStyle={{ color: ipctColors.blueRibbon }}
                        onLinkPress={(text) =>
                            WebBrowser.openBrowserAsync(text)
                        }
                    >
                        {description.translatedText}
                    </HyperlinkedText>
                </Text>
                <Translated />
                {props.isShort === true && (
                    <View
                        style={{
                            flexDirection: 'row',
                        }}
                    >
                        <Pressable
                            hitSlop={15}
                            onPress={() =>
                                navigator.navigate(
                                    Screens.CommunityExtendedDetailsScreen
                                )
                            }
                            testID="communitySeeMore"
                        >
                            <Text style={styles.textSeeMore}>
                                {i18n.t('community.seeMore')}
                            </Text>
                        </Pressable>
                    </View>
                )}
            </>
        );
    }
    return <ShimmerText width={width - 40} isShort={isShort} />;
}

const styles = StyleSheet.create({
    textDescription: {
        fontSize: 14,
        lineHeight: 24,
        fontFamily: 'Inter-Regular',
        color: ipctColors.darBlue,
    },
    textSeeMore: {
        marginTop: 8,
        fontSize: 16,
        lineHeight: 28,
        fontFamily: 'Inter-Regular',
        color: ipctColors.blueRibbon,
    },
});
