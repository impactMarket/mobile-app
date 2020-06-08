import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
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
    setUserFirstTime,
} from '../../helpers/redux/actions/ReduxActions';
import {
    useNavigation
} from '@react-navigation/native';
import ListActionItem, { IListActionItem } from '../../components/ListActionItem';
import Header from '../../components/Header';
import faker from 'faker';
import RecentTx from './RecentTx';


const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};
const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux

function WalletScreen(props: Props) {
    const navigation = useNavigation();
    const [activities, setActivities] = useState<IListActionItem[]>([]);

    // TODO: load activity history
    useEffect(() => {
        const loadActivities = () => {
            const _activities = [
                {
                    title: faker.name.firstName(),
                    from: faker.name.firstName(),
                    avatar: faker.image.avatar(),
                    description: faker.lorem.words(3),
                    value: faker.finance.amount(1, 39, 2),
                    timestamp: 1590519328,
                    key: '1590519328',
                },
                {
                    title: faker.name.firstName(),
                    from: faker.name.firstName(),
                    avatar: faker.image.avatar(),
                    description: faker.lorem.words(3),
                    value: faker.finance.amount(1, 39, 2),
                    timestamp: 1590119328,
                    key: '1590119328',
                }
            ];
            _activities.sort((a, b) => a.timestamp - b.timestamp);
            setActivities(_activities.reverse());
        }
        loadActivities();
    }, []);

    if (props.user.celoInfo.address.length === 0) {
        return <SafeAreaView>
            <Button
                mode="contained"
                style={{
                    alignSelf: 'center',
                    marginTop: '50%'
                }}
                onPress={() => props.dispatch(setUserFirstTime(true))}
            >
                Login now
            </Button>
        </SafeAreaView>;
    }
    return (
        <>
            <Header
                title="Wallet"
                navigation={navigation}
            >
                <Button
                    mode="text"
                    onPress={() => navigation.navigate('EditProfile')}
                >
                    Edit Profile
                </Button>
            </Header>
            <ScrollView style={styles.scrollView}>
                <Card style={styles.card} elevation={5}>
                    <Card.Content>
                        <Text style={{ color: 'grey' }}>BALANCE</Text>
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
                                ${props.user.celoInfo.balance}
                            </Headline>
                            <Text>{props.user.celoInfo.balance} cUSD</Text>
                        </View>
                    </Card.Content>
                </Card>
                <RecentTx />
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