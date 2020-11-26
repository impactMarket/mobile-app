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
} from 'helpers/types';
import React, { useState } from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { batch, useDispatch, useStore } from 'react-redux';
import i18n from 'assets/i18n';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button } from 'react-native-paper';

function Logout(props: { navigation: StackNavigationProp<any, any> }) {
    const store = useStore<IStoreCombinedState, IStoreCombinedActionsTypes>();
    const dispatch = useDispatch();

    const [logingOut, setLogingOut] = useState(false);

    const handleLogout = async () => {
        setLogingOut(true);
        await AsyncStorage.clear();
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
                        props.navigation.navigate(Screens.Communities, {
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
