import { Body, colors, Label, Pill, Title } from '@impact-market/ui-kit';
import { useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import BackSvg from 'components/svg/header/BackSvg';
import { Screens } from 'helpers/constants';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StatusBar,
    Image,
    StyleSheet,
    Pressable,
    FlatList,
    RefreshControl,
} from 'react-native';

import arrow_right_blue from './assets/beneficiary/arrow_right_blue.png';
import avatar from './assets/beneficiary/avatar.png';
import filter_icon from './assets/beneficiary/filter_icon.png';
import lock_orange from './assets/beneficiary/lock_orange.png';
import red_warning from './assets/beneficiary/red_warning.png';
import search_icon from './assets/beneficiary/search_icon.png';
import sort_icon from './assets/beneficiary/sort_icon.png';
import { IManagerDetailsBeneficiary } from 'helpers/types/endpoints';
import { IRootState } from 'helpers/types/state';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import Api from 'services/api';
import { ScrollView } from 'react-native-gesture-handler';
import { amountToCurrency } from 'helpers/currency';

function ListItem(props: {
    userCurrency: string;
    exchangeRates: {
        [key: string]: number;
    };
    beneficiary: IManagerDetailsBeneficiary;
}) {
    const navigation = useNavigation();
    const { beneficiary, userCurrency, exchangeRates } = props;

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
        <Pressable
            style={{
                // backgroundColor: 'red',
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                // paddingHorizontal: 22,
                justifyContent: 'space-between',
            }}
            onPress={() =>
                navigation.navigate(Screens.BeneficiaryDetailsScreen, {
                    beneficiary: beneficiary.address,
                })
            }
        >
            <View>
                <View style={{ flexDirection: 'row' }}>
                    <Title>{formatAddressOrName(beneficiary)}</Title>
                    <Image source={lock_orange} />
                </View>
                <Body style={{ color: colors.text.secondary }}>
                    {i18n.t('manager.claimedSince', {
                        amount:
                            beneficiary.claimed === undefined
                                ? '0'
                                : amountToCurrency(
                                      beneficiary.claimed,
                                      userCurrency,
                                      exchangeRates
                                  ),
                        date: moment(beneficiary.timestamp).format('MMM, YYYY'),
                    })}
                </Body>
            </View>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                {/* <Image source={avatar} /> */}
                <Image source={red_warning} resizeMode="contain" />
                <Image source={arrow_right_blue} resizeMode="contain" />
            </View>
        </Pressable>
    );
}
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
    >([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const [reachedEndList, setReachedEndList] = useState(false);
    const [searchBeneficiary, setSearchBeneficiary] = useState('');

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

    return (
        <View>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 22,
                    paddingVertical: 16,
                    // backgroundColor: 'red',
                    alignItems: 'center',
                }}
            >
                <View style={{ flexDirection: 'row' }}>
                    <Pill color={colors.background.dark}>Added</Pill>
                    <View style={{ width: 8 }} />
                    <Pill>Removed</Pill>
                </View>
            </View>
            {/* <ScrollView>
                <View
                    style={{
                        backgroundColor: '#E9EDF4',
                        height: 42,
                        justifyContent: 'center',
                        paddingHorizontal: 22,
                    }}
                >
                    <Title>Suspicious (2)</Title>
                </View>
                {beneficiaries.map((b) => (
                    <ListItem beneficiary={b} />
                ))}
            </ScrollView> */}
            <FlatList
                data={beneficiaries}
                style={{ paddingHorizontal: 22 }}
                renderItem={({
                    item,
                    index,
                }: {
                    item: IManagerDetailsBeneficiary;
                    index: number;
                }) => (
                    <ListItem
                        beneficiary={item}
                        userCurrency={userCurrency}
                        exchangeRates={exchangeRates}
                    />
                )}
                ref={flatListRef}
                keyExtractor={(item) => item.address}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                onEndReachedThreshold={0.5}
                onEndReached={handleOnEndReached}
            />
        </View>
    );
}

AddedBeneficiaryScreen.navigationOptions = () => {
    return {
        headerLeft: () => <BackSvg />,
        headerTitle: i18n.t('generic.added'),
    };
};

const styles = StyleSheet.create({
    safeAreaContainer: { flex: 1, paddingTop: StatusBar.currentHeight },
    tagsContainer: { flexDirection: 'row', paddingHorizontal: 25 },
    tagContainer: { flexDirection: 'row', flex: 1 },
    activeTag: {
        color: '#fff',
        backgroundColor: '#1E3252',
        paddingHorizontal: 20,
        fontSize: 15,
        borderRadius: 25,
        paddingVertical: 8,
    },
    inActiveTag: {
        marginHorizontal: 10,
        color: '#333239',
        backgroundColor: '#E9EDF4',
        paddingHorizontal: 20,
        fontSize: 15,
        borderRadius: 25,
        paddingVertical: 8,
    },
    filterContainer: { flexDirection: 'row', justifyContent: 'space-around' },
    filterIconContainer: {
        backgroundColor: '#E9EDF4',
        justifyContent: 'center',
        alignItems: 'center',
        width: 35,
        height: 35,
        borderRadius: 25,
        marginHorizontal: 5,
    },
    sectionHeaderContainer: {
        backgroundColor: '#E9EDF4',
        height: 42,
        // marginVertical: 16,
        justifyContent: 'center',
    },
    sectionHeaderText: {
        fontSize: 16,
        marginHorizontal: 22,
        fontWeight: 'bold',
    },
    sectionItemContainer: {
        backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 22,
    },
    flex1: { flex: 1 },
    itemHeader: {
        fontSize: 18,
        marginHorizontal: 25,
        fontWeight: '800',
        color: '#333239',
        marginBottom: 3,
    },
    itemSubHeader: {
        fontSize: 16,
        marginHorizontal: 25,
        color: '#73839D',
        marginTop: 3,
    },
    avatarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    warningImage: { width: 20, height: 20, marginHorizontal: 15 },
    arrowRight: { width: 20, height: 20 },
});

export default AddedBeneficiaryScreen;
