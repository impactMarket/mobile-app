import { useNavigation } from '@react-navigation/native';
import { Screens } from 'helpers/constants';
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import i18n from 'assets/i18n';

export default function MyStoriesCard() {
    const navigation = useNavigation();
    return (
        <Pressable
            style={{
                width: 98.16,
                height: 76.84,
                marginRight: 11.84,
            }}
            onPress={(e) => navigation.navigate(Screens.MyStories)}
        >
            <View
                style={{
                    backgroundColor: '#2362FB',
                    borderRadius: 8,
                    shadowColor: '#E1E4E7',
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 14,
                    elevation: 4,
                    width: '100%',
                    height: '100%',
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Text
                    style={{
                        fontFamily: 'Gelion-Bold',
                        fontSize: 13,
                        lineHeight: 16,
                        color: '#E1E4E7',
                        marginTop: 8,
                    }}
                >
                    {i18n.t('myStories')}
                </Text>
            </View>
        </Pressable>
    );
}
