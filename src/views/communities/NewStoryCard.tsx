import { useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import BluePlusSvg from 'components/svg/BluePlusSvg';
import { Screens } from 'helpers/constants';
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ipctColors } from 'styles/index';

export default function NewStoriesCard() {
    const navigation = useNavigation();
    return (
        <Pressable
            style={{
                width: 98.16,
                height: 102.16,
                marginRight: 11.84,
                marginBottom: 11.84,
            }}
            onPress={() => navigation.navigate(Screens.NewStory)}
        >
            <View
                style={{
                    backgroundColor: 'white',
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
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <BluePlusSvg />
                <Text
                    style={{
                        fontFamily: 'Gelion-Bold',
                        fontSize: 13,
                        lineHeight: 16,
                        color: ipctColors.almostBlack,
                        marginTop: 8,
                    }}
                >
                    {i18n.t('stories.createStory')}
                </Text>
            </View>
        </Pressable>
    );
}
