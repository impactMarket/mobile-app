import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
            return <BeneficiaryView
                navigation={this.props.navigation}
            />;
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
        return (
            <View>
                <Appbar.Header style={styles.appbar}>
                    <Avatar.Image size={58} source={require('../../assets/hello.png')} />
                    <Appbar.Content
                        title={this.props.user.celoInfo.balance + '$'}
                        subtitle="Balance"
                    />
                    <Appbar.Action icon="bell" />
                </Appbar.Header>
                <View style={{
                    alignItems: 'center',
                }}>
                    <ImageBackground
                        source={require('../../assets/favela.jpg')}
                        resizeMode={'cover'}
                        style={{
                            width: '100%',
                            height: '100%',
                        }}
                    >
                        <LinearGradient
                            colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,0.3)', 'transparent']}
                            style={{
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                top: 0,
                                height: 500,
                            }}
                        />
                    </ImageBackground>
                    <View style={styles.contentView}>
                        {this.contentView()}
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    contentView: {
        flex: 1,
        alignItems: 'center',
        position: 'absolute',
        top: 50,
    },
    title: {
        marginVertical: 8,
        fontSize: 20,
        fontWeight: 'bold'
    },
    appbar: {
        height: 80
    },
    button: {
        backgroundColor: "blue",
        padding: 20,
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 20,
        color: '#fff',
    },
});

export default connector(CommunityScreen);