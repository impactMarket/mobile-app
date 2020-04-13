import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from '../helpers/types';


interface ISendProps {
}
const mapStateToProps = (state: { users: IRootState }) => {
    const { users } = state
    return { users }
};

const connector = connect(mapStateToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & ISendProps
interface ISendState {
}
class Send extends React.Component<Props, ISendState> {

    constructor(props: any) {
        super(props);
        this.state = {
        }
    }

    render() {
        
        return (
            <View style={styles.container}>
                <Text>Welcome to Send View</Text>
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

export default connector(Send);