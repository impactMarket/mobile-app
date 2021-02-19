import i18n from 'assets/i18n';
import BackSvg from 'components/svg/header/BackSvg';
import { amountToCurrency } from 'helpers/currency';
import { IManagerDetailsBeneficiary } from 'helpers/types/endpoints';
import { IRootState } from 'helpers/types/state';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, View, StyleSheet } from 'react-native';
import { ActivityIndicator, List } from 'react-native-paper';
import { useSelector } from 'react-redux';
import Api from 'services/api';
import { ipctColors } from 'styles/index';
function RemovedBeneficiaryScreen() {
    const userCurrency = useSelector(
        (state: IRootState) => state.user.metadata.currency
    );
    const exchangeRates = useSelector(
        (state: IRootState) => state.app.exchangeRates
    );

    const [beneficiariesOffset, setBeneficiariesOffset] = useState(0);
    const [beneficiaries, setBeneficiaries] = useState<
        IManagerDetailsBeneficiary[]
    >(undefined as any);
    const [refreshing, setRefreshing] = React.useState(false);
    const [reachedEndList, setReachedEndList] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        Api.community.listBeneficiaries(false, 0, 10).then((l) => {
            if (l.length < 10) {
                setReachedEndList(true);
            }
            setBeneficiaries(l);
            setBeneficiariesOffset(0);
            setRefreshing(false);
        });
    }, []);

    useEffect(() => {
        const loadActiveBeneficiaries = () => {
            Api.community.listBeneficiaries(false, 0, 10).then((l) => {
                if (l.length < 10) {
                    setReachedEndList(true);
                }
                setBeneficiaries(l);
                setBeneficiariesOffset(0);
            });
        };
        loadActiveBeneficiaries();
    }, []);

    if (beneficiaries === undefined) {
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
                .listBeneficiaries(false, beneficiariesOffset + 10, 10)
                .then((l) => {
                    if (l.length < 10) {
                        setReachedEndList(true);
                    }
                    setBeneficiaries(beneficiaries.concat(l));
                    setBeneficiariesOffset(beneficiariesOffset + 10);
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
            titleStyle={styles.textTitle}
            descriptionStyle={styles.textDescription}
            style={{ paddingLeft: 0 }}
        />
    );

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

    return (
        <FlatList
            data={beneficiaries}
            style={{ paddingHorizontal: 15 }}
            renderItem={listRenderItem}
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
RemovedBeneficiaryScreen.navigationOptions = () => {
    return {
        headerLeft: () => <BackSvg />,
        headerTitle: i18n.t('removed'),
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

export default RemovedBeneficiaryScreen;
