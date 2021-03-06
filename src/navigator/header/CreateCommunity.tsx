import { StackNavigationProp } from '@react-navigation/stack';
import i18n from 'assets/i18n';
import { Screens } from 'helpers/constants';
import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { ipctColors } from 'styles/index';

function CreateCommunity(props: { navigation: StackNavigationProp<any, any> }) {
    return (
        <View
            style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
            }}
        >
            <Button
                mode="text"
                uppercase={false}
                labelStyle={{
                    fontFamily: 'Gelion-Bold',
                    fontSize: 22,
                    lineHeight: 26,
                    height: 26,
                    textAlign: 'center',
                    letterSpacing: 0.366667,
                    color: ipctColors.blueRibbon,
                    // marginLeft: 8.4,
                    marginRight: 16,
                }}
                onPress={() =>
                    props.navigation.navigate(Screens.CreateCommunity)
                }
            >
                {i18n.t('create')}
            </Button>
        </View>
    );
}

export default CreateCommunity;
