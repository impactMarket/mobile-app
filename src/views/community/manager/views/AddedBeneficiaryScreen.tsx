import i18n from 'assets/i18n';
import Button from 'components/core/Button';
import BackSvg from 'components/svg/header/BackSvg';
import { amountToCurrency } from 'helpers/currency';
import { isOutOfTime } from 'helpers/index';
import { setCommunityMetadata } from 'helpers/redux/actions/user';
import { IManagerDetailsBeneficiary } from 'helpers/types/endpoints';
import { IRootState } from 'helpers/types/state';
import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    StyleSheet,
    Alert,
    View,
    FlatList,
    RefreshControl,
} from 'react-native';
import {
    ActivityIndicator,
    IconButton,
    List,
    Paragraph,
    Searchbar,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Api from 'services/api';
import { celoWalletRequest } from 'services/celoWallet';
import { iptcColors } from 'styles/index';

function AddedBeneficiaryScreen() {
    const dispatch = useDispatch();
    const flatListRef = useRef<FlatList<IManagerDetailsBeneficiary> | null>(
        null
    );
    const community = useSelector((state: IRootState) => state.user.community);
    const userWallet = useSelector((state: IRootState) => state.user.wallet);
    const userCurrency = useSelector(
        (state: IRootState) => state.user.metadata.currency
    );
    const kit = useSelector((state: IRootState) => state.app.kit);
    const exchangeRates = useSelector(
        (state: IRootState) => state.app.exchangeRates
    );

    const [removing, setRemoving] = useState<boolean[]>();
    const [beneficiariesOffset, setBeneficiariesOffset] = useState(0);
    const [beneficiaries, setBeneficiaries] = useState<
        IManagerDetailsBeneficiary[]
    >(undefined as any);
    const [refreshing, setRefreshing] = React.useState(false);
    const [reachedEndList, setReachedEndList] = useState(false);
    const [searchBeneficiary, setSearchBeneficiary] = useState('');
    const [searchResults, setSearchResults] = useState<
        IManagerDetailsBeneficiary[]
    >([]);
    const [showingSearchResults, setShowingSearchResults] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        Api.community.listBeneficiaries(true, 0, 10).then((l) => {
            if (l.length < 10) {
                setReachedEndList(true);
            }
            setBeneficiaries(l);
            setBeneficiariesOffset(0);
            setRemoving(Array(l.length).fill(false));
            setRefreshing(false);
        });
    }, []);

    useEffect(() => {
        const loadActiveBeneficiaries = () => {
            Api.community.listBeneficiaries(true, 0, 10).then((l) => {
                if (l.length < 10) {
                    setReachedEndList(true);
                }
                setBeneficiaries(l);
                setBeneficiariesOffset(0);
                setRemoving(Array(l.length).fill(false));
            });
        };
        loadActiveBeneficiaries();
    }, []);

    const handleRemoveBeneficiary = async (
        beneficiary: IManagerDetailsBeneficiary,
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
            await communityContract.methods.removeBeneficiary(
                beneficiary.address
            ),
            'removebeneficiary',
            kit
        )
            .then((tx) => {
                if (tx === undefined) {
                    return;
                }
                Alert.alert(
                    i18n.t('success'),
                    i18n.t('userWasRemoved', {
                        user: formatAddressOrName(beneficiary),
                    }),
                    [{ text: 'OK' }],
                    { cancelable: false }
                );
                // refresh community details
                setTimeout(() => {
                    Api.community
                        .getByPublicId(community.metadata.publicId)
                        .then((c) => dispatch(setCommunityMetadata(c!)));
                    flatListRef.current?.scrollToIndex({ index: 0 });
                    setRefreshing(true);
                    Api.community.listBeneficiaries(true, 0, 10).then((l) => {
                        if (l.length < 10) {
                            setReachedEndList(true);
                        }
                        setBeneficiaries(l);
                        setBeneficiariesOffset(0);
                        setRemoving(Array(l.length).fill(false));
                        setRefreshing(false);
                    });
                }, 2500);
            })
            .catch(async (e) => {
                let error = 'possibleNetworkIssues';
                if (
                    e.message.includes('nonce') ||
                    e.message.includes('gasprice is less')
                ) {
                    error = 'possiblyValoraNotSynced';
                } else if (e.message.includes('gas required exceeds')) {
                    error = 'unknown';
                    // verify clock time
                    if (await isOutOfTime()) {
                        error = 'clockNotSynced';
                    }
                } else if (e.message.includes('Invalid JSON RPC response:')) {
                    if (
                        e.message.includes('The network connection was lost.')
                    ) {
                        error = 'networkConnectionLost';
                    }
                    error = 'networkIssuesRPC';
                }
                Alert.alert(
                    i18n.t('failure'),
                    i18n.t('errorRemovingBeneficiary', {
                        error: i18n.t(error),
                    }),
                    [{ text: 'OK' }],
                    { cancelable: false }
                );
                Api.system.uploadError(
                    userWallet.address,
                    'remove_beneficiary',
                    e,
                    error
                );
            })
            .finally(() => {
                const newRemoving = removing!;
                newRemoving[index] = false;
                setRemoving(() => [...newRemoving]);
            });
    };

    if (beneficiaries === undefined || removing === undefined) {
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
                    color={iptcColors.blueRibbon}
                />
            </View>
        );
    }

    const handleOnEndReached = (info: { distanceFromEnd: number }) => {
        if (!refreshing && !reachedEndList) {
            setRefreshing(true);
            Api.community
                .listBeneficiaries(true, beneficiariesOffset + 10, 10)
                .then((l) => {
                    if (l.length < 10) {
                        setReachedEndList(true);
                    }
                    setBeneficiaries(beneficiaries.concat(l));
                    setBeneficiariesOffset(beneficiariesOffset + 10);
                    setRemoving(
                        Array(beneficiaries.length + l.length).fill(false)
                    );
                })
                .finally(() => setRefreshing(false));
        }
    };

    const listRenderItem = ({
        item,
        index,
    }: {
        item: IManagerDetailsBeneficiary;
        index: number;
    }) => (
        <List.Item
            title={formatAddressOrName(item)}
            description={i18n.t('claimedSince', {
                amount:
                    item.claimed === undefined
                        ? '0'
                        : amountToCurrency(
                              item.claimed,
                              userCurrency,
                              exchangeRates
                          ),
                date: moment(item.timestamp).format('MMM, YYYY'),
            })}
            right={() => (
                <Button
                    modeType="gray"
                    bold
                    disabled={removing[index]}
                    loading={removing[index]}
                    style={{ marginVertical: 5 }}
                    onPress={() => handleRemoveBeneficiary(item, index)}
                >
                    {i18n.t('remove')}
                </Button>
            )}
            titleStyle={styles.textTitle}
            descriptionStyle={styles.textDescription}
            style={{ paddingLeft: 0 }}
        />
    );

    const handleSearchBeneficiary = () => {
        if (beneficiaries.length > 30) {
            flatListRef.current?.scrollToIndex({ index: 0 });
        }
        Api.community
            .searchBeneficiary(true, searchBeneficiary)
            .then((r) => {
                setSearchResults(r);
                if (r.length > 0) {
                    setReachedEndList(true);
                    setRemoving(Array(r.length).fill(false));
                    setRefreshing(false);
                }
                setShowingSearchResults(true);
            })
            .catch((e) => {
                // an error occurred while searching
            });
    };

    const formatAddressOrName = (from: IManagerDetailsBeneficiary) => {
        const titleMaxLength = 25;
        const fromHasName = from.username !== null && from.username.length > 0;
        let name = '';
        if (from.username !== null && fromHasName) {
            name = from.username;
        }

        return fromHasName
            ? name
            : `${from.address.slice(
                  0,
                  (titleMaxLength - 4) / 2
              )}..${from.address.slice(42 - (titleMaxLength - 4) / 2, 42)}`;
    };

    const renderBeneficiariesList = () => {
        if (showingSearchResults && searchResults.length === 0) {
            return (
                <Paragraph
                    style={{
                        textAlign: 'center',
                        fontSize: 18,
                    }}
                >
                    {i18n.t('noResults')}
                </Paragraph>
            );
        }
        return (
            <FlatList
                data={showingSearchResults ? searchResults : beneficiaries}
                style={{ paddingHorizontal: 15 }}
                renderItem={listRenderItem}
                ref={flatListRef}
                keyExtractor={(item) => item.address}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
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
    };

    return (
        <>
            <Searchbar
                placeholder={i18n.t('search')}
                style={{
                    marginHorizontal: 22,
                    backgroundColor: 'rgba(206, 212, 218, 0.27)',
                    shadowRadius: 0,
                    elevation: 0,
                    borderRadius: 6,
                    marginBottom: 15,
                }}
                clearIcon={(p) => (
                    <IconButton
                        icon="close"
                        onPress={() => {
                            setSearchBeneficiary('');
                            setSearchResults([]);
                            setShowingSearchResults(false);
                        }}
                    />
                )}
                onChangeText={(e) => {
                    if (e.length === 0 && searchResults.length > 0) {
                        setSearchResults([]);
                    }
                    setSearchBeneficiary(e);
                }}
                value={searchBeneficiary}
                onEndEditing={handleSearchBeneficiary}
            />
            {renderBeneficiariesList()}
        </>
    );
}
AddedBeneficiaryScreen.navigationOptions = () => {
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

export default AddedBeneficiaryScreen;
