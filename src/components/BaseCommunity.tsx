import React from 'react';
import { Entypo } from '@expo/vector-icons';
import { ICommunityInfo } from 'helpers/types';
import { Text, View, StyleSheet, Image } from 'react-native';

export default function BaseCommunity(props: {
    community: ICommunityInfo;
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
                    source={{ uri: community.coverImage }}
                />
                <View style={styles.darkerBackground} />
            </View>
            <View
                style={{
                    // flex: 1,
                    justifyContent: 'center',
                    // width: '100%',
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
                    {community.country}
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
        fontWeight: 'bold',
        fontFamily: 'Gelion-Bold',
        color: 'white',
        textAlign: 'center',
    },
    communityLocation: {
        zIndex: 5,
        // marginBottom: 32.41,
        fontSize: 15,
        lineHeight: 15,
        letterSpacing: 0.25,
        color: 'white',
        textAlign: 'center',
    },
});
