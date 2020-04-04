import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';


interface ICommunityState {
}
export default class Community extends React.Component<{}, ICommunityState> {

    constructor(props: any) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>You do not belong to a community!</Text>
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
