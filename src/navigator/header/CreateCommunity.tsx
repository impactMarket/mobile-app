import { StackNavigationProp } from '@react-navigation/stack';
import i18n from 'assets/i18n';
import { Screens } from 'helpers/constants';
import { CommunityAttributes } from 'helpers/types/models';
import { IRootState } from 'helpers/types/state';
import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { ipctColors } from 'styles/index';

function CreateCommunity(props: {
    navigation: StackNavigationProp<any, any>;
    userCommunity?: CommunityAttributes;
}) {
    const walletAddress = useSelector(
        (state: IRootState) => state.user.wallet.address
    );

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
                    marginRight: 16,
                }}
                onPress={() =>
                    walletAddress.length > 0
                        ? props.navigation.navigate(Screens.CreateCommunity)
                        : null
                }
            >
                {i18n.t('generic.create')}
            </Button>
        </View>
    );
}

export default CreateCommunity;
