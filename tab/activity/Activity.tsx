import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from '../../helpers/types';
import { Appbar, Avatar, List } from 'react-native-paper';
import { ethers } from 'ethers';


interface IActivityProps {
}
const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};

const connector = connect(mapStateToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & IActivityProps
interface IActivityListItem {
    from: string;
    description: string;
    amount: string;
    status: string;
    timestamp: number;
}
interface IActivityState {
    activities: IActivityListItem[];
}
class Activity extends React.Component<Props, IActivityState> {

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
                from: 'Fehsolna',
                description: 'Brasil',
                amount: '2',
                status: 'Claimed',
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

    render() {
        const { activities } = this.state;
        return (
            <View>
                <Appbar.Header style={styles.appbar}>
                    <Avatar.Image size={58} source={require('../../assets/hello.png')} />
                    <Appbar.Content
                        title="0$"
                        subtitle="Balance"
                    />
                    <Appbar.Action icon="bell" />
                </Appbar.Header>
                <View>
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
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    appbar: {
        height: 120
    },
});

export default connector(Activity);