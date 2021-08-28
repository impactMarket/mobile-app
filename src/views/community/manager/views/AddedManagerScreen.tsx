import i18n from 'assets/i18n';
import Button from 'components/core/Button';
import BackSvg from 'components/svg/header/BackSvg';
import { isOutOfTime } from 'helpers/index';
import { findCommunityByIdRequest } from 'helpers/redux/actions/communities';
import { ManagerAttributes } from 'helpers/types/models';
import { IRootState } from 'helpers/types/state';
import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    FlatList,
    RefreshControl,
    View,
    StyleSheet,
    Alert,
} from 'react-native';
import { ActivityIndicator, List } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import * as Sentry from 'sentry-expo';
import Api from 'services/api';
import { celoWalletRequest } from 'services/celoWallet';
import { ipctColors } from 'styles/index';

function AddedManagerScreen() {
    const dispatch = useDispatch();
    const flatListRef = useRef<FlatList<ManagerAttributes> | null>(null);
    const community = useSelector((state: IRootState) => state.user.community);
    const userWallet = useSelector((state: IRootState) => state.user.wallet);
    const kit = useSelector((state: IRootState) => state.app.kit);
    const [removing, setRemoving] = useState<boolean[]>();
    const [managersOffset, setManagersOffset] = useState(0);
    const [managers, setManagers] = useState<ManagerAttributes[]>(
        undefined as any
    );
    const [refreshing, setRefreshing] = React.useState(false);
    const [reachedEndList, setReachedEndList] = useState(false);
    const [totalManagers, setTotalManagers] = useState(0);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        Api.community.listManagers(community.metadata.id, 0, 10).then((l) => {
            if (l.length < 10) {
                setReachedEndList(true);
            }
            setTotalManagers(l.length);
            setManagers(l);
            setManagersOffset(0);
            setRemoving(Array(l.length).fill(false));
            setRefreshing(false);
        });
    }, [community]);

    useEffect(() => {
        const loadActiveBeneficiaries = () => {
            Api.community
                .listManagers(community.metadata.id, 0, 10)
                .then((l) => {
                    if (l.length < 10) {
                        setReachedEndList(true);
                    }
                    setTotalManagers(l.length);
                    setManagers(l);
                    setManagersOffset(0);
                    setRemoving(Array(l.length).fill(false));
                });
        };
        loadActiveBeneficiaries();
    }, [community]);

    const handleRemoveManager = async (
        manager: ManagerAttributes,
        index: number
    ) => {
        if (userWallet.balance.length < 16) {
            Alert.alert(
                i18n.t('generic.failure'),
                i18n.t('errors.notEnoughForTransaction'),
                [{ text: i18n.t('generic.close') }],
                { cancelable: false }
            );
            return;
        }

        const communityContract = community.contract;

        const newRemoving = removing!;
        newRemoving[index] = true;
        setRemoving(() => [...newRemoving]);
        celoWalletRequest(
            userWallet.address,
            communityContract.options.address,
            await communityContract.methods.removeManager(manager.address),
            'removemanager',
            kit
        )
            .then((tx) => {
                if (tx === undefined) {
                    return;
                }
                Alert.alert(
                    i18n.t('generic.success'),
                    i18n.t('manager.userWasRemoved', {
                        user: formatAddressOrName(manager),
                    }),
                    [{ text: 'OK' }],
                    { cancelable: false }
                );
                setTotalManagers(totalManagers - 1);
                // refresh community details
                setTimeout(() => {
                    dispatch(findCommunityByIdRequest(community.metadata.id));
                    flatListRef.current?.scrollToIndex({ index: 0 });
                    setRefreshing(true);
                    Api.community
                        .listManagers(community.metadata.id, 0, 10)
                        .then((l) => {
                            if (l.length < 10) {
                                setReachedEndList(true);
                            }
                            setManagers(l);
                            setManagersOffset(0);
                            setRemoving(Array(l.length).fill(false));
                            setRefreshing(false);
                        });
                }, 2500);
            })
            .catch(async (e) => {
                let error = 'errors.unknown';
                if (e.message.includes('has been reverted')) {
                    error = 'errors.sync.issues';
                } else if (
                    e.message.includes('nonce') ||
                    e.message.includes('gasprice is less')
                ) {
                    error = 'errors.sync.possiblyValora';
                } else if (e.message.includes('gas required exceeds')) {
                    error = 'errors.unknown';
                    // verify clock time
                    if (await isOutOfTime()) {
                        error = 'errors.sync.clock';
                    }
                } else if (e.message.includes('Invalid JSON RPC response:')) {
                    if (
                        e.message.includes('The network connection was lost.')
                    ) {
                        error = 'errors.network.connectionLost';
                    }
                    error = 'errors.network.rpc';
                }
                if (error === 'errors.unknown') {
                    //only submit to sentry if it's unknown
                    Sentry.Native.captureException(e);
                }
                Alert.alert(
                    i18n.t('generic.failure'),
                    i18n.t('manager.errorRemovingManager', {
                        error: i18n.t(error),
                    }),
                    [{ text: 'OK' }],
                    { cancelable: false }
                );
            })
            .finally(() => {
                const newRemoving = removing!;
                newRemoving[index] = false;
                setRemoving(() => [...newRemoving]);
            });
    };

    if (managers === undefined || removing === undefined) {
        return (
            <View
                style={{
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                }}
            >
                <ActivityIndicator
                    animating
                    size="large"
                    color={ipctColors.blueRibbon}
                />
            </View>
        );
    }

    const handleOnEndReached = (info: { distanceFromEnd: number }) => {
        if (!refreshing && !reachedEndList) {
            setRefreshing(true);
            Api.community
                .listManagers(community.metadata.id, managersOffset + 10, 10)
                .then((l) => {
                    if (l.length < 10) {
                        setReachedEndList(true);
                    }
                    setManagers(managers.concat(l));
                    setManagersOffset(managersOffset + 10);
                    setRemoving(Array(managers.length + l.length).fill(false));
                })
                .finally(() => setRefreshing(false));
        }
    };

    const listRenderItem = ({
        item,
        index,
    }: {
        item: ManagerAttributes;
        index: number;
    }) => (
        <List.Item
            title={formatAddressOrName(item)}
            description={i18n.t('manager.managerSince', {
                date: moment(item.createdAt).format('MMM, YYYY'),
            })}
            right={() =>
                totalManagers > 2 && (
                    <Button
                        modeType="gray"
                        bold
                        disabled={removing[index]}
                        loading={removing[index]}
                        style={{ marginVertical: 5 }}
                        onPress={() => handleRemoveManager(item, index)}
                    >
                        {i18n.t('generic.remove')}
                    </Button>
                )
            }
            // left={() =>
            //     item.suspect && <WarningTriangle style={{ marginTop: 14 }} />
            // }
            titleStyle={styles.textTitle}
            descriptionStyle={styles.textDescription}
            style={{ paddingLeft: 0 }}
        />
    );

    const formatAddressOrName = (from: ManagerAttributes) => {
        const titleMaxLength = 25;
        let fromHasName = false;
        let name = '';
        if (from.user) {
            fromHasName =
                from.user.username !== null && from.user.username.length > 0;
            if (from.user.username !== null && fromHasName) {
                name = from.user.username;
            }
        }

        return fromHasName
            ? name
            : `${from.address.slice(
                  0,
                  (titleMaxLength - 4) / 2
              )}..${from.address.slice(42 - (titleMaxLength - 4) / 2, 42)}`;
    };

    return (
        <FlatList
            data={managers}
            style={{ paddingHorizontal: 15 }}
            renderItem={listRenderItem}
            ref={flatListRef}
            keyExtractor={(item) => item.address}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            onEndReachedThreshold={0.7}
            onEndReached={handleOnEndReached}
            // Performance settings
            removeClippedSubviews // Unmount components when outside of window
            initialNumToRender={2} // Reduce initial render amount
            maxToRenderPerBatch={1} // Reduce number in each render batch
            updateCellsBatchingPeriod={100} // Increase time between renders
            windowSize={7} // Reduce the window size
        />
    );
}
AddedManagerScreen.navigationOptions = () => {
    return {
        headerLeft: () => <BackSvg />,
        headerTitle: i18n.t('generic.added'),
    };
};

const styles = StyleSheet.create({
    textTitle: {
        fontFamily: 'Gelion-Regular',
        fontSize: 20,
        letterSpacing: 0,
    },
    textDescription: {
        fontFamily: 'Gelion-Regular',
        letterSpacing: 0.25,
        color: 'grey',
    },
});

export default AddedManagerScreen;
