import i18n from 'assets/i18n';
import BackSvg from 'components/svg/header/BackSvg';
import { chooseMediaThumbnail } from 'helpers/index';
import { addStoriesToStateRequest } from 'helpers/redux/actions/stories';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import Api from 'services/api';
import { ipctColors } from 'styles/index';
import StoriesCard from 'views/communities/StoriesCard';

function StoriesScreen() {
    const dispatch = useDispatch();

    // const stories = useSelector((state: IRootState) => state.stories.stories);
    // const refreshing = useSelector(
    //     (state: IRootState) => state.stories.refreshing
    // );
    const [refreshing, setRefreshing] = useState(false);
    const [stories, setStories] = useState([]);

    // useEffect(() => {
    //     dispatch(addStoriesToStateRequest(0, 5));
    // }, []);

    /**
     * Code Before Sagas
     * */
    useEffect(() => {
        setRefreshing(true);
        Api.story.list<any[]>().then((s) => {
            setStories(s.data);
            dispatch(addStoriesToStateRequest(0, s.count));
            setRefreshing(false);
        });
    }, []);

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
            numColumns={3} // Número de colunas
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

const styles = StyleSheet.create({
    itemEmpty: {
        backgroundColor: 'transparent',
    },
    item: {
        backgroundColor: '#dcda48',
        flexGrow: 1,
        flexBasis: 0,
        height: 167,
        borderRadius: 8,
    },
    title: {
        fontFamily: 'Manrope-Regular',
        fontSize: 22,
        fontWeight: '800',
        lineHeight: 28,
        textAlign: 'center',
        color: '#172032',
    },
    text: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 24,
        textAlign: 'center',
        color: '#172032',
    },
});

StoriesScreen.navigationOptions = () => {
    return {
        headerLeft: () => <BackSvg />,
        headerTitle: i18n.t('stories'),
        headerTitleStyle: {
            fontFamily: 'Manrope-Bold',
            fontSize: 22,
            lineHeight: 28,
            color: '#333239',
        },
        headerTitleContainerStyle: {
            left: 58,
        },
    };
};

export default StoriesScreen;
