import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    RefreshControl,
} from 'react-native';
import {
    connect,
    ConnectedProps
} from 'react-redux';
import {
    IRootState,
} from '../../helpers/types';
import {
    Card,
    Button,
    Headline,
} from 'react-native-paper';
import {
    SafeAreaView
} from 'react-native-safe-area-context';
import {
    ScrollView
} from 'react-native-gesture-handler';
import {
    useNavigation
} from '@react-navigation/native';
import Header from '../../components/Header';
import RecentTx, { IRecentTxRef } from './RecentTx';
import { humanifyNumber, amountToUserCurrency, getUserCurrencySymbol } from '../../helpers';
import i18n from '../../assets/i18n';


const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};
const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux

function WalletScreen(props: Props) {
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);
    const recentPaymentsRef = React.createRef<IRecentTxRef>();

    const onRefresh = () => {
        recentPaymentsRef.current?.updateRecentTx();
        setRefreshing(false);
    }

    if (props.user.celoInfo.address.length === 0) {
        return <SafeAreaView>
            <Button
                mode="contained"
                style={{
                    alignSelf: 'center',
                    marginTop: '50%'
                }}
                onPress={() => navigation.navigate('LoginScreen')}
            >
                {i18n.t('loginNow')}
            </Button>
        </SafeAreaView>;
    }
    return (
        <>
            <Header
                title={i18n.t('wallet')}
                navigation={navigation}
            >
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
                        //refresh control used for the Pull to Refresh
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <Card elevation={8} style={styles.card}>
                    <Card.Content>
                        <Text style={{ color: 'grey' }}>{i18n.t('balance').toUpperCase()}</Text>
                        <View style={{ alignItems: 'center' }}>
                            <Headline
                                style={{
                                    fontFamily: "Gelion-Bold",
                                    fontSize: 56,
                                    fontWeight: "bold",
                                    lineHeight: 56,
                                    letterSpacing: 0,
                                    marginTop: 20
                                }}
                            >
                                {getUserCurrencySymbol(props.user.user)}{amountToUserCurrency(props.user.celoInfo.balance, props.user.user)}
                            </Headline>
                            <Text>{humanifyNumber(props.user.celoInfo.balance)} cUSD</Text>
                        </View>
                    </Card.Content>
                </Card>
                <RecentTx userAddress={props.user.celoInfo.address} ref={recentPaymentsRef} />
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        marginTop: 10
    },
    card: {
        marginHorizontal: 20,
        marginVertical: 10,
    },
    appbar: {
        backgroundColor: 'transparent',
    },
    item: {
        marginBottom: 50,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default connector(WalletScreen);