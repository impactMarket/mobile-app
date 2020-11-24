import { useNavigation } from '@react-navigation/native';
import { Screens } from 'helpers/constants';
import {
    resetNetworkContractsApp,
    resetUserApp,
    setUserIsBeneficiary,
    setUserIsCommunityManager,
} from 'helpers/redux/actions/ReduxActions';
import {
    IStoreCombinedActionsTypes,
    IStoreCombinedState,
    STORAGE_USER_FIRST_TIME,
} from 'helpers/types';
import React, { useState } from 'react';
import { View, Text, AsyncStorage } from 'react-native';
import { batch, useDispatch, useStore } from 'react-redux';
import i18n from 'assets/i18n';

function Logout() {
    const store = useStore<IStoreCombinedState, IStoreCombinedActionsTypes>();
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [logingOut, setLogingOut] = useState(false);

    const handleLogout = async () => {
        console.log('logout');
        setLogingOut(true);
        await AsyncStorage.clear();
        await AsyncStorage.setItem(STORAGE_USER_FIRST_TIME, 'false');
        const unsubscribe = store.subscribe(() => {
            const state = store.getState();
            if (
                !state.user.community.isBeneficiary &&
                !state.user.community.isManager
            ) {
                unsubscribe();
                setLogingOut(false);
                // TODO: improve this line below
                setTimeout(
                    () =>
                        navigation.navigate(Screens.Communities, {
                            previous: Screens.Profile,
                        }),
                    500
                );
            }
        });
        batch(() => {
            dispatch(setUserIsBeneficiary(false));
            dispatch(setUserIsCommunityManager(false));
            dispatch(resetUserApp());
            dispatch(resetNetworkContractsApp());
        });
    };

    return (
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <Text
                style={{
                    fontFamily: 'Gelion-Bold',
                    fontSize: 22,
                    lineHeight: 22, // TODO: design is 26
                    textAlign: 'center',
                    letterSpacing: 0.366667,
                    color: '#2643E9',
                    // marginLeft: 8.4,
                    marginRight: 16,
                }}
                onPress={handleLogout}
                // loading={logingOut}
                // disabled={logingOut}
            >
                {i18n.t('logout')}
            </Text>
        </View>
    );
}

export default Logout;
