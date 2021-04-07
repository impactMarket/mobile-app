import { ContractKit } from '@celo/contractkit';
import { Subscription } from '@unimodules/core';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import { Screens } from 'helpers/constants';
import {
    setCommunityContract,
    setCommunityMetadata,
    setUserIsBeneficiary,
    setUserIsCommunityManager,
} from 'helpers/redux/actions/user';
import { navigationRef } from 'helpers/rootNavigation';
import { Platform } from 'react-native';
import { batch } from 'react-redux';
import { Dispatch } from 'redux';
import * as Sentry from 'sentry-expo';
import Api from 'services/api';

import CommunityContractABI from '../../contracts/CommunityABI.json';

export async function registerForPushNotifications(): Promise<string> {
    let token = '';
    try {
        if (Constants.isDevice) {
            const { status: existingStatus } = await Permissions.getAsync(
                Permissions.NOTIFICATIONS
            );
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Permissions.askAsync(
                    Permissions.NOTIFICATIONS
                );
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                return '';
            }
            token = (await Notifications.getExpoPushTokenAsync()).data;
        } else {
            return '';
        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F',
            });
        }
    } catch (e) {
        // TODO: improve this
        // do not catch like "Network Error"; "Fetching the token failed: SERVICE_NOT_AVAILABLE"; "Fetching the token failed: TIMEOUT"; "Error encountered while fetching Expo token: TypeError: Network request failed." etc
        // Sentry.Native.captureException(e);
    }

    return token;
}

export const startNotificationsListeners = (
    kit: ContractKit,
    dispatch: Dispatch<any>
): {
    notificationReceivedListener: Subscription;
    notificationResponseReceivedListener: Subscription;
} => {
    // when notification received!
    const notificationReceivedListener = Notifications.addNotificationReceivedListener(
        (notification: Notifications.Notification) => {
            const notificationData = notification.request.content.data;
            const action = notificationData.action as string;
            const communityAddress = notificationData.communityAddress as string;
            if (
                action === 'community-accepted' ||
                action === 'beneficiary-added'
            ) {
                Api.community
                    .getByContractAddress(communityAddress)
                    .then((community) => {
                        if (community !== undefined) {
                            const communityContract = new kit.web3.eth.Contract(
                                CommunityContractABI as any,
                                communityAddress
                            );
                            batch(() => {
                                if (action === 'community-accepted') {
                                    dispatch(setUserIsCommunityManager(true));
                                }
                                if (action === 'beneficiary-added') {
                                    dispatch(setUserIsBeneficiary(true));
                                }
                                dispatch(setCommunityMetadata(community));
                                dispatch(
                                    setCommunityContract(communityContract)
                                );
                            });
                        }
                    });
            }
        }
    );
    // when user clicks on the notification
    const notificationResponseReceivedListener = Notifications.addNotificationResponseReceivedListener(
        (response) => {
            const notificationData = response.notification.request.content.data;
            const action = notificationData.action as string;
            const communityAddress = notificationData.communityAddress as string;
            if (action === 'community-low-funds') {
                Api.community
                    .getByContractAddress(communityAddress)
                    .then((community) => {
                        if (community !== undefined) {
                            navigationRef.current?.navigate(
                                Screens.CommunityDetails,
                                {
                                    communityId: community.publicId,
                                }
                            );
                        }
                    });
            }
        }
    );
    // Notifications.addPushTokenListener
    // In rare situations a push token may be changed by the push notification service while the app is running.
    return {
        notificationReceivedListener,
        notificationResponseReceivedListener,
    };
};
