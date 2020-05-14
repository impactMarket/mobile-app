import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from '../../helpers/types';

import { Appbar, Avatar } from 'react-native-paper';
import BeneficiaryView from './route/Beneficiary';
import CommunityManagerView from './route/CommunityManager';


interface ICommunityProps {
    navigation: any;
}
const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};

const connector = connect(mapStateToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & ICommunityProps
interface ICommunityState {
}
class CommunityScreen extends React.Component<Props, ICommunityState> {

    constructor(props: any) {
        super(props);
        this.state = {
        }
    }

    contentView = () => {
        if (this.props.user.community.isBeneficiary) {
            return <View>
                <Appbar.Header style={styles.appbar}>
                    <Avatar.Image size={58} source={require('../../assets/hello.png')} />
                    <Appbar.Content
                        title={this.props.user.celoInfo.balance + '$'}
                        subtitle="Balance"
                    />
                    <Appbar.Action icon="bell" />
                </Appbar.Header>
                <BeneficiaryView
                    navigation={this.props.navigation}
                />
            </View>;
        } else if (this.props.user.community.isCoordinator) {
            return <CommunityManagerView
                navigation={this.props.navigation}
            />;
        } else {
            return (
                <>
                    <Text>Not available!</Text>
                    <Text>Please, contact close communities.</Text>
                </>
            );
        }
    }

    render() {
        return this.contentView();
    }
}

const styles = StyleSheet.create({
    appbar: {
        height: 80
    },
});

export default connector(CommunityScreen);