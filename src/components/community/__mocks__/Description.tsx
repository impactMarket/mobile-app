import { useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import Dot from 'components/Dot';
import { Screens } from 'helpers/constants';
import { CommunityAttributes } from 'helpers/types/models';
import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { ipctColors } from 'styles/index';

const Description = (props: {
    community: CommunityAttributes;
    isShort?: boolean;
}) => {
    const { isShort, community } = props;
    const navigator = useNavigation();

    const originalDescription =
        isShort !== true
            ? community.description
            : community.description.slice(
                  0,
                  community.description.indexOf('.') !== -1 &&
                      community.description.length > 179
                      ? community.description.indexOf('.', 180) + 1
                      : community.description.length
              );

    const Translated = () => {
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
                        from: 'English',
                    })}
                </Text>
                <Dot />
                <Pressable
                    hitSlop={15}
                    onPress={() => {
                        //
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
            <Text style={styles.textDescription}>{originalDescription}</Text>
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
};

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

export default Description;
