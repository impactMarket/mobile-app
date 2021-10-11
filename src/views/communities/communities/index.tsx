import { useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import Button from 'components/core/Button';
import { Screens } from 'helpers/constants';
import { setOpenAuthModal } from 'helpers/redux/actions/app';
import { fetchCommunitiesListRequest } from 'helpers/redux/actions/communities';
import { CommunityAttributes } from 'helpers/types/models';
import { IRootState } from 'helpers/types/state';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, View, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Api from 'services/api';
import { ipctColors, ipctFontSize, ipctLineHeight } from 'styles/index';

import CommunityCard from './CommunityCard';

export default function Communities() {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const flatListRef = useRef<FlatList<CommunityAttributes> | null>(null);

    const {
        wallet: { address },
        community,
        metadata: { currency },
    } = useSelector((state: IRootState) => state.user);
    const { communities } = useSelector(
        (state: IRootState) => state.communities
    );
    const [count, setCount] = useState(0);

    const { exchangeRates } = useSelector((state: IRootState) => state.app);

    useEffect(() => {
        dispatch(
            fetchCommunitiesListRequest({
                offset: 0,
                limit: 5,
                filter: 'featured',
            })
        );
        const fetchTotalCommunities = () => {
            Api.global.numbers().then((r) => setCount(r.data.communities));
        };
        fetchTotalCommunities();
    }, []);

    const flatListData =
        communities.length === 0
            ? (Array(5)
                  .fill(1)
                  .map((_, idx) => ({
                      id: idx,
                  })) as any[])
            : communities;

    const ApplyCommunityButton = () => {
        if (
            community.manager !== null &&
            community.metadata?.status === 'valid'
        ) {
            return null;
        }
        return (
            <Button
                modeType="default"
                style={{ marginHorizontal: 22, marginVertical: 8 }}
                labelStyle={styles.buttomStoreText}
                onPress={() =>
                    address.length > 0
                        ? community.manager !== null
                            ? navigation.navigate(Screens.CommunityManager)
                            : navigation.navigate(Screens.CreateCommunity)
                        : dispatch(setOpenAuthModal(true))
                }
            >
                <Text style={styles.buttomStoreText}>
                    {i18n.t('createCommunity.applyCommunity')}
                </Text>
            </Button>
        );
    };

    return (
        <View>
            <View
                style={{
                    marginHorizontal: 22,
                    marginVertical: 8,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
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
                data={flatListData}
                renderItem={({ item }) => (
                    <CommunityCard
                        community={item}
                        rates={exchangeRates}
                        userCurrency={currency}
                        navigation={navigation}
                    />
                )}
                contentContainerStyle={{ paddingHorizontal: 14 }} // 22 - 8 (horizontal padding container - horizontal padding item)
                ref={flatListRef}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
            <ApplyCommunityButton />
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
