import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import { Screens } from 'helpers/constants';
import {
    resetUserApp,
    setUserIsBeneficiary,
    setUserIsCommunityManager,
} from 'helpers/redux/actions/user';
import React, { useState } from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { batch, useDispatch } from 'react-redux';
import { ipctColors } from 'styles/index';

function Logout() {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [logingOut, setLogingOut] = useState(false);

    const handleLogout = async () => {
        setLogingOut(true);
        await AsyncStorage.clear();
        batch(() => {
            dispatch(setUserIsBeneficiary(false));
            dispatch(setUserIsCommunityManager(false));
            dispatch(resetUserApp());
            navigation.navigate(Screens.Communities);
        });
    };

    return (
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <Button
                mode="text"
                uppercase={false}
                labelStyle={{
                    fontFamily: 'Inter-Regular',
                    fontSize: 18,
                    lineHeight: 20,
                    height: 22,
                    textAlign: 'center',
                    letterSpacing: 0.366667,
                    color: ipctColors.blueRibbon,
                    // marginLeft: 8.4,
                    marginRight: 16,
                }}
                onPress={handleLogout}
                loading={logingOut}
                disabled={logingOut}
            >
                {i18n.t('profile.logout')}
            </Button>
        </View>
    );
}

export default Logout;
