import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    AsyncStorage,
} from 'react-native';
import {
    connect,
    ConnectedProps
} from 'react-redux';
import {
    IRootState,
    STORAGE_USER_FIRST_TIME
} from '../../helpers/types';
import {
    Appbar,
    Avatar,
    Card,
    Button,
    Headline,
    List
} from 'react-native-paper';
import {
    SafeAreaView
} from 'react-native-safe-area-context';
import {
    ScrollView
} from 'react-native-gesture-handler';
import {
    ChartConfig,
    BarChart
} from 'react-native-chart-kit';
import {
    setUserFirstTime,
    setUserIsCommunityManager,
    setUserIsBeneficiary,
    setUserCeloInfo
} from '../../helpers/redux/actions/ReduxActions';
import {
    useNavigation
} from '@react-navigation/native';
import ListActionItem, { IListActionItem } from '../../components/ListActionItem';


const barChartConfig: ChartConfig = {
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0,
    strokeWidth: 1,
    barPercentage: 0.5,
    color: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
    propsForLabels: {
        opacity: 0 // just make them transparent ¯\_(ツ)_/¯
    }
};
const dummyData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
        {
            data: [10, 25, 31, 42, 39, 59, 61, 68, 63, 79, 89, 95]
        }
    ]
};
interface IAccountScreenProps {
}
const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};

const connector = connect(mapStateToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & IAccountScreenProps
function AccountScreen(props: Props) {
    const navigation = useNavigation();
    const [activities, setActivities] = useState<IListActionItem[]>([]);

    // TODO: load activity history
    useEffect(() => {
        const loadActivities = () => {
            const _activities = [
                {
                    title: 'Cliff',
                    from: 'Cliff',
                    description: 'Thanks friend!!',
                    value: '2',
                    timestamp: 1590519328,
                    key: '1590519328',
                },
                {
                    title: 'Fehsolna',
                    from: 'Fehsolna',
                    avatar: 'https://www.kindpng.com/picc/m/24-248442_female-user-avatar-woman-profile-member-user-profile.png',
                    description: 'Brasil',
                    value: '3',
                    timestamp: 1590119328,
                    key: '1590119328',
                }
            ];
            _activities.sort((a, b) => a.timestamp - b.timestamp);
            setActivities(_activities.reverse());
        }
        loadActivities();
    }, []);

    const handleLogout = () => {
        AsyncStorage.clear();
        AsyncStorage.setItem(STORAGE_USER_FIRST_TIME, 'false');
        props.dispatch(setUserCeloInfo({
            address: '',
            phoneNumber: '',
            balance: '0',
        }));
        props.dispatch(setUserIsCommunityManager(false));
        props.dispatch(setUserIsBeneficiary(false));
    }

    if (props.user.celoInfo.address.length === 0) {
        return <SafeAreaView>
            <Text>Login needed...</Text>
            <Button
                mode="contained"
                onPress={() => props.dispatch(setUserFirstTime(true))}
            >
                Login now
            </Button>
        </SafeAreaView>;
    }
    return (
        <SafeAreaView>
            <Appbar.Header style={styles.appbar}>
                <Appbar.Content title="Account" />
                <Appbar.Action icon="help-circle-outline" />
                <Appbar.Action icon="qrcode" onPress={() => navigation.navigate('UserShowScanQRScreen')} />
            </Appbar.Header>
            <ScrollView style={styles.scrollView}>
                <Card style={styles.card}>
                    <Card.Content>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View>
                                <Text>John Doe</Text>
                                <Text style={{ color: 'grey' }}>United States</Text>
                                <Button
                                    mode="text"
                                    disabled={true}
                                    onPress={() => console.log('hi')}
                                >
                                    Edit Profile
                                </Button>
                            </View>
                            <Avatar.Image
                                style={{ alignSelf: 'center', right: -80 }}
                                size={58}
                                source={require('../../assets/hello.png')}
                            />
                        </View>
                    </Card.Content>
                </Card>
                <Card style={styles.card}>
                    <Card.Title
                        title=""
                        style={{ backgroundColor: '#f0f0f0' }}
                        subtitleStyle={{ color: 'grey' }}
                        subtitle="WALLET BALANCE"
                    />
                    <Card.Content>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View>
                                <Headline>${props.user.celoInfo.balance}</Headline>
                                <Text>{props.user.celoInfo.balance} cUSD</Text>
                            </View>
                            <BarChart
                                data={dummyData}
                                width={270}
                                height={45}
                                yAxisLabel=""
                                yAxisSuffix=""
                                withInnerLines={false}
                                chartConfig={barChartConfig}
                                style={{
                                    marginLeft: -65,
                                }}
                            />
                        </View>
                    </Card.Content>
                </Card>
                <Card style={styles.card}>
                    <Card.Title
                        title=""
                        style={{ backgroundColor: '#f0f0f0' }}
                        subtitleStyle={{ color: 'grey' }}
                        subtitle="RECENT TRANSACTIONS"
                    />
                    <Card.Content>
                        {activities.map((activity) => <ListActionItem
                            key={activity.timestamp}
                            item={activity}
                            prefix={{ top: '$' }}
                        />)}
                        <Button
                            mode="contained"
                            disabled={true}
                            style={{ marginLeft: 10 }}
                            onPress={() => console.log('Pressed')}
                        >
                            All Transactions
                        </Button>
                    </Card.Content>
                </Card>
                <Button
                    mode="contained"
                    style={styles.card}
                    onPress={handleLogout}
                >
                    Logout
                </Button>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        marginTop: 10,
        marginBottom: 80
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

export default connector(AccountScreen);