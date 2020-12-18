import React, { useState } from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { batch, useDispatch } from 'react-redux';
import i18n from 'assets/i18n';
import { Button } from 'react-native-paper';
import {
    resetUserApp,
    setUserIsBeneficiary,
    setUserIsCommunityManager,
} from 'helpers/redux/actions/user';

function Logout() {
    const dispatch = useDispatch();

    const [logingOut, setLogingOut] = useState(false);

    const handleLogout = async () => {
        setLogingOut(true);
        await AsyncStorage.clear();
        batch(() => {
            dispatch(setUserIsBeneficiary(false));
            dispatch(setUserIsCommunityManager(false));
            dispatch(resetUserApp());
        });
    };

    return (
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
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
                    color: '#2643E9',
                    // marginLeft: 8.4,
                    marginRight: 16,
                }}
                onPress={handleLogout}
                loading={logingOut}
                disabled={logingOut}
            >
                {i18n.t('logout')}
            </Button>
        </View>
    );
}

export default Logout;
