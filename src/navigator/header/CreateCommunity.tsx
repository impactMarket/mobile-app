import { StackNavigationProp } from '@react-navigation/stack';
import i18n from 'assets/i18n';
import { Screens } from 'helpers/constants';
import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { ipctColors } from 'styles/index';

function CreateCommunity(props: {
    navigation: StackNavigationProp<any, any>;
    hasCommunity?: boolean;
}) {
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
                    fontFamily: 'Inter-Regular',
                    fontSize: 18,
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
                {props.hasCommunity ? i18n.t('edit') : i18n.t('create')}
            </Button>
        </View>
    );
}

export default CreateCommunity;
