import i18n from 'assets/i18n';
import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Api from 'services/api';
import BackSvg from 'components/svg/header/BackSvg';
import { IManagerDetailsManager } from 'helpers/types/endpoints';
import {
    FlatList,
    RefreshControl,
    View,
    StyleSheet,
    Alert,
} from 'react-native';
import { ActivityIndicator, List } from 'react-native-paper';
import { iptcColors } from 'styles/index';
import Button from 'components/core/Button';
import { decrypt } from 'helpers/encryption';
import { celoWalletRequest } from 'services/celoWallet';
import { setCommunityMetadata } from 'helpers/redux/actions/user';
import { IRootState } from 'helpers/types/state';
import { isOutOfTime } from 'helpers/index';

function AddedManagerScreen() {
    const dispatch = useDispatch();
    const flatListRef = useRef<FlatList<IManagerDetailsManager> | null>(null);
    const community = useSelector((state: IRootState) => state.user.community);
    const userWallet = useSelector((state: IRootState) => state.user.wallet);
    const kit = useSelector((state: IRootState) => state.app.kit);
    const [removing, setRemoving] = useState<boolean[]>();
    const [managersOffset, setManagersOffset] = useState(0);
    const [managers, setManagers] = useState<IManagerDetailsManager[]>(
        undefined as any
    );
    const [refreshing, setRefreshing] = React.useState(false);
    const [reachedEndList, setReachedEndList] = useState(false);
    const [totalManagers, setTotalManagers] = useState(0);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        Api.community.listManagers(0, 10).then((l) => {
            if (l.length < 10) {
                setReachedEndList(true);
            }
            setTotalManagers(l.length);
            setManagers(l);
            setManagersOffset(0);
            setRemoving(Array(l.length).fill(false));
            setRefreshing(false);
        });
    }, []);

    useEffect(() => {
        const loadActiveBeneficiaries = () => {
            Api.community.listManagers(0, 10).then((l) => {
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
        return;
    }, []);

    const handleRemoveManager = async (
        manager: IManagerDetailsManager,
        index: number
    ) => {
        if (userWallet.balance.length < 16) {
            Alert.alert(
                i18n.t('failure'),
                i18n.t('notEnoughForTransaction'),
                [{ text: i18n.t('close') }],
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
                    i18n.t('success'),
                    i18n.t('userWasRemoved', {
                        user: formatAddressOrName(manager),
                    }),
                    [{ text: 'OK' }],
                    { cancelable: false }
                );
                setTotalManagers(totalManagers - 1);
                // refresh community details
                setTimeout(() => {
                    Api.community
                        .getByPublicId(community.metadata.publicId)
                        .then((c) => dispatch(setCommunityMetadata(c!)));
                    flatListRef.current?.scrollToIndex({ index: 0 });
                    setRefreshing(true);
                    Api.community.listManagers(0, 10).then((l) => {
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
                let error = i18n.t('possibleNetworkIssues');
                if (
                    e.message.includes('nonce') ||
                    e.message.includes('gasprice is less')
                ) {
                    error = i18n.t('possiblyValoraNotSynced');
                } else if (e.message.includes('gas required exceeds')) {
                    error = i18n.t('unknown');
                    // verify clock time
                    if (await isOutOfTime()) {
                        error = i18n.t('clockNotSynced');
                    }
                } else if (e.message.includes('Invalid JSON RPC response:')) {
                    if (
                        e.message.includes('The network connection was lost.')
                    ) {
                        error = i18n.t('networkConnectionLost');
                    }
                    error = i18n.t('networkIssuesRPC');
                }
                Alert.alert(
                    i18n.t('failure'),
                    i18n.t('errorRemovingManager'),
                    [{ text: 'OK' }],
                    { cancelable: false }
                );
                Api.system.uploadError(
                    userWallet.address,
                    'remove_manager',
                    `${e} <Presented Error> ${error}`
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
                    animating={true}
                    size="large"
                    color={iptcColors.softBlue}
                />
            </View>
        );
    }

    const handleOnEndReached = (info: { distanceFromEnd: number }) => {
        if (!refreshing && !reachedEndList) {
            setRefreshing(true);
            Api.community
                .listManagers(managersOffset + 10, 10)
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
        item: IManagerDetailsManager;
        index: number;
    }) => (
        <List.Item
            title={formatAddressOrName(item)}
            description={i18n.t('managerSince', {
                date: moment(item.timestamp).format('MMM, YYYY'),
            })}
            right={() =>
                totalManagers > 2 && (
                    <Button
                        modeType="gray"
                        bold={true}
                        disabled={removing[index]}
                        loading={removing[index]}
                        style={{ marginVertical: 5 }}
                        onPress={() => handleRemoveManager(item, index)}
                    >
                        {i18n.t('remove')}
                    </Button>
                )
            }
            titleStyle={styles.textTitle}
            descriptionStyle={styles.textDescription}
            style={{ paddingLeft: 0 }}
        />
    );

    const formatAddressOrName = (from: IManagerDetailsManager) => {
        let titleMaxLength = 25;
        const fromHasName = from.username !== null && from.username.length > 0;
        let name = '';
        if (from.username !== null && fromHasName) {
            name = decrypt(from.username);
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
            removeClippedSubviews={true} // Unmount components when outside of window
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
        headerTitle: i18n.t('added'),
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
