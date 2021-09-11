import i18n from 'assets/i18n';
import BackSvg from 'components/svg/header/BackSvg';
import { chooseMediaThumbnail } from 'helpers/index';
import { addStoriesToStateRequest } from 'helpers/redux/actions/stories';
import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import Api from 'services/api';
import { ipctColors, ipctFontSize, ipctLineHeight } from 'styles/index';
import StoriesCard from 'views/communities/StoriesCard';

function StoriesScreen() {
    const dispatch = useDispatch();

    const [refreshing, setRefreshing] = useState(false);
    const [stories, setStories] = useState([]);

    useEffect(() => {
        setRefreshing(true);
        Api.story.list<any[]>().then((s) => {
            setStories(s.data);
            dispatch(addStoriesToStateRequest(0, s.count));
            setRefreshing(false);
        });
    }, [dispatch]);

    if (refreshing) {
        return (
            <ActivityIndicator
                style={{ marginBottom: 22 }}
                animating
                color={ipctColors.blueRibbon}
            />
        );
    }
    return (
        <FlatList
            data={stories}
            style={{
                marginHorizontal: 12,
            }}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            keyExtractor={(item) => item.name}
            showsVerticalScrollIndicator={false}
            numColumns={3}
            renderItem={({ item }) => {
                return (
                    <StoriesCard
                        key={item.id}
                        communityId={item.id}
                        communityName={item.name}
                        imageURI={
                            item.story?.media
                                ? chooseMediaThumbnail(item.story.media, {
                                      width: 84,
                                      heigth: 140,
                                  })
                                : chooseMediaThumbnail(item.cover, {
                                      width: 88,
                                      heigth: 88,
                                  })
                        }
                    />
                );
            }}
        />
    );
}

StoriesScreen.navigationOptions = () => {
    return {
        headerLeft: () => <BackSvg />,
        headerTitle: i18n.t('stories.stories'),
        headerTitleStyle: {
            fontFamily: 'Manrope-Bold',
            fontSize: ipctFontSize.lowMedium,
            lineHeight: ipctLineHeight.large,
            color: ipctColors.darBlue,
        },
        headerTitleContainerStyle: {
            left: 58,
        },
    };
};

export default StoriesScreen;
