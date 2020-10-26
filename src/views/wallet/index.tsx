import { useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import Header from 'components/Header';
import {
    humanifyNumber,
    getCurrencySymbol,
    amountToCurrency,
} from 'helpers/index';
import { IRootState } from 'helpers/types';
import React, { useState } from 'react';
import { StyleSheet, Text, View, RefreshControl } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, Headline } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect, ConnectedProps } from 'react-redux';

import RecentTx, { IRecentTxRef } from './RecentTx';
import BigNumber from 'bignumber.js';
import { setUserWalletBalance } from 'helpers/redux/actions/ReduxActions';
import Card from 'components/Card';
import Login from './Login';

const mapStateToProps = (state: IRootState) => {
    const { user, network, app } = state;
    return { user, network, app };
};
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;

function WalletScreen(props: Props) {
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);
    const recentPaymentsRef = React.createRef<IRecentTxRef>();

    const onRefresh = () => {
        const updateBalance = async () => {
            const stableToken = await props.app.kit.contracts.getStableToken();
            const cUSDBalanceBig = await stableToken.balanceOf(
                props.user.celoInfo.address
            );
            const balance = new BigNumber(cUSDBalanceBig.toString());
            props.dispatch(setUserWalletBalance(balance.toString()));
        };
        updateBalance();
        recentPaymentsRef.current?.updateRecentTx();
        setRefreshing(false);
    };

    if (props.user.celoInfo.address.length === 0) {
        return <Login />
    }
    const userBalance = amountToCurrency(
        props.user.celoInfo.balance,
        props.user.user.currency,
        props.app.exchangeRates
    );
    return (
        <>
            <Header title={i18n.t('wallet')} navigation={navigation}>
                <Button
                    mode="text"
                    onPress={() => navigation.navigate('EditProfile')}
                >
                    {i18n.t('editProfile')}
                </Button>
            </Header>
            <ScrollView
                style={styles.scrollView}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <Card elevation={8} style={styles.card}>
                    <Card.Content>
                        <Text style={{ color: 'grey' }}>
                            {i18n.t('balance').toUpperCase()}
                        </Text>
                        <View style={{ alignItems: 'center' }}>
                            <Headline
                                style={{
                                    fontSize: userBalance.length > 6 ? 43 : 56,
                                    lineHeight:
                                        userBalance.length > 6 ? 43 : 56,
                                    ...styles.headlineBalance,
                                }}
                            >
                                {getCurrencySymbol(props.user.user.currency)}
                                {userBalance}
                            </Headline>
                            <Text>
                                {humanifyNumber(props.user.celoInfo.balance)}{' '}
                                cUSD
                            </Text>
                        </View>
                    </Card.Content>
                </Card>
                <RecentTx
                    userAddress={props.user.celoInfo.address}
                    ref={recentPaymentsRef}
                />
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        marginTop: 10,
    },
    card: {
        marginHorizontal: 20,
        marginVertical: 10,
    },
    headlineBalance: {
        fontFamily: 'Gelion-Bold',
        letterSpacing: 0,
        marginTop: 20,
    },
    item: {
        marginBottom: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default connector(WalletScreen);
