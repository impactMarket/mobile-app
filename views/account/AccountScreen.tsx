import React from 'react';
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
interface IActivityListItem {
    from: string;
    description: string;
    amount: string;
    status: string;
    timestamp: number;
}
interface IAccountScreenState {
    activities: IActivityListItem[];
}
class AccountScreen extends React.Component<Props, IAccountScreenState> {

    constructor(props: any) {
        super(props);
        this.state = {
            activities: [],
        }
    }

    // TODO: load activity history
    componentDidMount = () => {
        const activities = [
            {
                from: 'Cliff',
                description: 'Thanks friend!!',
                amount: '2',
                status: 'Received',
                timestamp: 17263188,
            },
            {
                from: 'Fehsolna',
                description: 'Brasil',
                amount: '3',
                status: 'Claimed',
                timestamp: 17263179,
            }
        ];
        activities.sort((a, b) => a.timestamp - b.timestamp);
        this.setState({ activities });
    }

    handleLogout = () => {
        AsyncStorage.clear();
        AsyncStorage.setItem(STORAGE_USER_FIRST_TIME, 'false');
        setUserIsCommunityManager(false);
        setUserIsBeneficiary(false);
        setUserCeloInfo({
            address: '',
            phoneNumber: '',
            balance: '0',
        });
        setUserFirstTime(false);
    }

    render() {
        const { activities } = this.state;
        if (this.props.user.celoInfo.address.length === 0) {
            return <SafeAreaView>
                <Text>Login needed...</Text>
                <Button
                    mode="contained"
                    onPress={() => this.props.dispatch(setUserFirstTime(true))}
                >
                    Login now
                </Button>
            </SafeAreaView>;
        }
        return (
            <SafeAreaView>
                <Appbar.Header style={styles.appbar}>
                    <Appbar.Content title="Pay" />
                    <Appbar.Action icon="help-circle-outline" />
                    <Appbar.Action icon="qrcode" />
                </Appbar.Header>
                <ScrollView style={styles.scrollView}>

                    <Card style={styles.card}>
                        <Card.Content>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View>
                                    <Text>Afonso Barbosa</Text>
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
                                    <Headline>€{this.props.user.celoInfo.balance}</Headline>
                                    <Text>{this.props.user.celoInfo.balance} cUSD</Text>
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
                            {activities.map((activity) => <List.Item
                                key={activity.timestamp}
                                title={activity.from}
                                description={activity.description}
                                left={() => <Avatar.Text size={46} label={activity.from.slice(0, 1)} />}
                                right={() => <View>
                                    <Text>€{activity.amount}</Text>
                                    <Text>{activity.status}</Text>
                                </View>}
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
                        style={{ marginLeft: 10 }}
                        onPress={this.handleLogout}
                    >
                        Logout
                    </Button>
                </ScrollView>
            </SafeAreaView>
        );
    }
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