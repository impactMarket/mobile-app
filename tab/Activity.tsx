import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from '../helpers/types';
import { Appbar, Avatar, List } from 'react-native-paper';


interface IActivityProps {
}
const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};

const connector = connect(mapStateToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & IActivityProps
interface IActivityState {
}
class Activity extends React.Component<Props, IActivityState> {

    constructor(props: any) {
        super(props);
        this.state = {
        }
    }

    // TODO: load activity history

    render() {
        return (
            <View>
                <Appbar.Header style={styles.appbar}>
                    <Avatar.Image size={58} source={require('../assets/hello.png')} />
                    <Appbar.Content
                        title="0$"
                        subtitle="Balance"
                    />
                    <Appbar.Action icon="bell" />
                </Appbar.Header>
                <View>
                    <List.Item
                        title="Fehsolna"
                        description="Brasil"
                        left={() => <Avatar.Text size={46} label="F" />}
                        right={() => <View>
                            <Text>€2</Text>
                            <Text>Claimed</Text>
                        </View>}
                    />
                    <List.Item
                        title="Fehsolna"
                        description="Brasil"
                        left={() => <Avatar.Text size={46} label="F" />}
                        right={() => <View>
                            <Text>€2</Text>
                            <Text>Claimed</Text>
                        </View>}
                    />
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