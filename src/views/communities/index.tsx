import i18n from 'assets/i18n';
import React, { useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import Api from 'services/api';
import CommunitiesSvg from 'components/svg/CommunitiesSvg';
import { ICommunityLightDetails } from 'helpers/types/endpoints';
import { ITabBarIconProps } from 'helpers/types/common';
import CommunityCard from './CommunityCard';

function CommunitiesScreen() {
    const [communtiesOffset, setCommuntiesOffset] = useState(0);
    const [, setRefreshing] = useState(true);
    const [communities, setCommunities] = useState<ICommunityLightDetails[]>(
        []
    );

    useEffect(() => {
        Api.community
            .list(0, 5)
            .then((c) => setCommunities(c))
            .finally(() => setRefreshing(false));
    }, []);

    return (
        <>
            <FlatList
                data={communities}
                renderItem={({ item }: { item: ICommunityLightDetails }) => (
                    <CommunityCard community={item} />
                )}
                keyExtractor={(item) => item.publicId}
                onEndReachedThreshold={.7}
                onEndReached={(info: { distanceFromEnd: number }) => {
                    setRefreshing(true);
                    Api.community
                        .list(communtiesOffset + 5, 5)
                        .then((c) => {
                            setCommunities(communities.concat(c));
                            setCommuntiesOffset(communtiesOffset + 5);
                        })
                        .finally(() => setRefreshing(false));
                }}
                // Performance settings
                removeClippedSubviews={true} // Unmount components when outside of window
                initialNumToRender={2} // Reduce initial render amount
                maxToRenderPerBatch={1} // Reduce number in each render batch
                updateCellsBatchingPeriod={100} // Increase time between renders
                windowSize={7} // Reduce the window size
            />
        </>
    );
}

CommunitiesScreen.navigationOptions = () => {
    return {
        headerTitle: i18n.t('communities'),
        tabBarIcon: (props: ITabBarIconProps) => (
            <CommunitiesSvg focused={props.focused} />
        ),
    };
};

export default CommunitiesScreen;
