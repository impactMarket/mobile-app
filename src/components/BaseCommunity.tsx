import { Entypo } from '@expo/vector-icons';
import countriesJSON from 'assets/countries.json';
import { chooseMediaThumbnail } from 'helpers/index';
import { CommunityAttributes } from 'helpers/types/models';
import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';

// import CachedImage from './CacheImage';

const countries: {
    [key: string]: {
        name: string;
        native: string;
        currency: string;
        languages: string[];
        emoji: string;
    };
} = countriesJSON;
export default function BaseCommunity(props: {
    community: CommunityAttributes;
    full?: boolean;
    action?: React.ReactNode;
    children?: React.ReactNode;
}) {
    const { community, children, full, action } = props;

    const ifFull = full ? { height: 152 } : {};

    return (
        <>
            <View
                style={{
                    width: '100%',
                    height: 152,
                    position: 'absolute',
                }}
            >
                <Image
                    style={styles.imageBackground}
                    source={{
                        uri: chooseMediaThumbnail(community.cover!, {
                            width: 330,
                            heigth: 330,
                        }),
                    }}
                />
                {/** TODO: should load thumbnail until original image is loaded only */}
                <View style={styles.darkerBackground} />
            </View>
            <View
                style={{
                    justifyContent: 'center',
                    ...ifFull,
                }}
            >
                <Text style={styles.communityName}>{community.name}</Text>
                <Text
                    style={{
                        ...styles.communityLocation,
                        marginBottom: action ? 0 : 32.41,
                    }}
                >
                    <Entypo name="location-pin" size={14} /> {community.city},{' '}
                    {countries[community.country].name}
                </Text>
                {action}
            </View>
            {children}
        </>
    );
}

const styles = StyleSheet.create({
    imageBackground: {
        width: '100%',
        height: 152,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    darkerBackground: {
        backgroundColor: 'rgba(0,0,0,0.15)',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 152,
    },
    communityName: {
        zIndex: 5,
        marginTop: 22,
        marginBottom: 2,
        fontSize: 30,
        lineHeight: 36,
        fontFamily: 'Gelion-Bold',
        color: 'white',
        textAlign: 'center',
    },
    communityLocation: {
        zIndex: 5,
        fontSize: 15,
        lineHeight: 15,
        letterSpacing: 0.25,
        color: 'white',
        textAlign: 'center',
    },
});
