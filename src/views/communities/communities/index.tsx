import { useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import Button from 'components/core/Button';
import { Screens } from 'helpers/constants';
import { fetchCommunitiesListRequest } from 'helpers/redux/actions/communities';
import { CommunityAttributes } from 'helpers/types/models';
import { IRootState } from 'helpers/types/state';
import React, { useEffect, useRef } from 'react';
import { FlatList, StyleSheet, Text, View, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ipctColors, ipctFontSize, ipctLineHeight } from 'styles/index';

import CommunityCard from './CommunityCard';

export default function Communities() {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const flatListRef = useRef<FlatList<CommunityAttributes> | null>(null);

    const {
        wallet: { address },
        metadata: { currency },
    } = useSelector((state: IRootState) => state.user);
    const { communities, count } = useSelector(
        (state: IRootState) => state.communities
    );

    const { exchangeRates } = useSelector((state: IRootState) => state.app);

    useEffect(() => {
        dispatch(
            fetchCommunitiesListRequest({
                offset: 0,
                limit: 5,
            })
        );
    }, []);

    return (
        <View>
            <View
                style={{
                    marginHorizontal: 18,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 9,
                }}
            >
                <Text style={styles.communityHeader}>
                    {i18n.t('generic.communities')}
                </Text>
                <Pressable
                    hitSlop={10}
                    onPress={() => navigation.navigate(Screens.ListCommunities)}
                >
                    <Text style={styles.viewAll}>
                        {i18n.t('generic.viewAll')} ({count})
                    </Text>
                </Pressable>
            </View>
            <FlatList
                data={
                    communities.length === 0
                        ? (Array(5)
                              .fill(1)
                              .map((_, idx) => ({
                                  id: idx,
                              })) as any[])
                        : communities
                }
                renderItem={({ item }) => (
                    <CommunityCard
                        community={item}
                        rates={exchangeRates}
                        userCurrency={currency}
                        navigation={navigation}
                    />
                )}
                ref={flatListRef}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{
                    marginLeft: 14,
                }}
            />
            <Button
                modeType="default"
                style={{ marginHorizontal: 22, marginBottom: 36 }}
                labelStyle={styles.buttomStoreText}
                onPress={() =>
                    address.length > 0
                        ? navigation.navigate(Screens.CreateCommunity)
                        : null
                }
            >
                <Text style={styles.buttomStoreText}>
                    {i18n.t('createCommunity.applyCommunity')}
                </Text>
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    communityHeader: {
        fontFamily: 'Manrope-Bold',
        fontSize: ipctFontSize.medium,
        lineHeight: ipctLineHeight.xlarge,
        color: ipctColors.almostBlack,
    },
    viewAll: {
        color: ipctColors.blueRibbon,
        fontFamily: 'Inter-Regular',
        fontSize: ipctFontSize.small,
        lineHeight: ipctLineHeight.large,
        textAlign: 'center',
    },
    buttomStoreText: {
        fontSize: ipctFontSize.small,
        // lineHeight: ipctLineHeight.large,
        color: ipctColors.white,
        fontFamily: 'Inter-Regular',
        fontWeight: '500',
    },
});
