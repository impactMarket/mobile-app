import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from '../helpers/types';


interface IActivityProps {
}
const mapStateToProps = (state: { users: IRootState }) => {
    const { users } = state
    return { users }
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

    render() {
        
        return (
            <View style={styles.container}>
                <Text>Welcome to Activity View</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default connector(Activity);