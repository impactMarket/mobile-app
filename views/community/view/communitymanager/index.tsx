import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ImageBackground,
    RefreshControl,
    Image,
    Linking,
} from 'react-native';
import {
    connect,
    ConnectedProps
} from 'react-redux';
import {
    IRootState,
    ICommunityInfo,
} from '../../../../helpers/types';
import {
    Button,
    Paragraph,
    IconButton,
    Dialog,
    Portal,
    Headline,
} from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import Beneficiaries from './cards/Beneficiaries';
import CommuntyStatus from '../../../../components/CommuntyStatus';
import Header from '../../../../components/Header';
import { useNavigation } from '@react-navigation/native';
import { updateCommunityInfo, iptcColors } from '../../../../helpers';


const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};
const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux

function CommunityManagerView(props: Props) {
    const navigation = useNavigation();
    const [community, setCommunity] = useState<ICommunityInfo>(props.network.community);
    const [openModalMore, setOpenModalMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        let contractAddress;
        if (props.network.contracts.communityContract !== undefined) {
            contractAddress = props.network.contracts.communityContract._address;
        } else if (props.network.community !== undefined) {
            contractAddress = props.network.community.contractAddress;
        }
        if (contractAddress !== undefined && contractAddress !== null) {
            updateCommunityInfo(props.user.celoInfo.address, props)
                .then(() => {
                    setRefreshing(false);
                });
        }
    }

    const communityStatus = (_community: ICommunityInfo) => {
        if (_community.status === 'valid') {
            return <ScrollView
                refreshControl={
                    <RefreshControl
                        //refresh control used for the Pull to Refresh
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <ImageBackground
                    source={{ uri: community.coverImage }}
                    resizeMode={'cover'}
                    style={styles.imageBackground}
                >
                    <Text style={styles.communityName}>{community.name}</Text>
                    <LinearGradient
                        colors={['transparent', 'rgba(246,246,246,1)']}
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            bottom: 0,
                            height: 80,
                        }}
                    />
                </ImageBackground>
                <View style={styles.container}>
                    <Beneficiaries
                        community={_community}
                        updateCommunity={(_communityUpdate) => setCommunity(_communityUpdate)}
                    />
                    <CommuntyStatus community={_community}>
                        <Button
                            mode="outlined"
                            disabled={true}
                            style={{ width: '100%' }}
                            onPress={() => console.log('Pressed')}
                        >
                            Full Dashboard
                    </Button>
                    </CommuntyStatus>
                </View>
            </ScrollView>
        }
        return <View style={{ flex: 1 }}>
            <ImageBackground
                source={{ uri: community.coverImage }}
                resizeMode={'cover'}
                style={styles.imageBackground}
            >
                <Text style={styles.communityName}>{community.name}</Text>
                <LinearGradient
                    colors={['transparent', 'rgba(246,246,246,1)']}
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: 80,
                    }}
                />
            </ImageBackground>
            <View style={{
                marginHorizontal: 20,
                flex: 1,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-around'
            }}
            >
                <Image
                    source={require('../../../../assets/pending.png')}
                    style={{ width: 50, height: 50 }}
                />
                <Headline
                    style={{
                        fontFamily: "Gelion-Regular",
                        fontSize: 22,
                        fontWeight: "bold",
                        fontStyle: "normal",
                        lineHeight: 22,
                        height: 22,
                        letterSpacing: 0,
                        textAlign: "center",
                    }}
                >
                    Pending Approval
                </Headline>
                <Text
                    style={{
                        fontFamily: "Gelion-Regular",
                        fontSize: 19,
                        fontWeight: "normal",
                        fontStyle: "normal",
                        lineHeight: 19,
                        height: 100,
                        letterSpacing: 0,
                        textAlign: "center",
                    }}
                >
                    This community has not yet been approved. If you have any question please contact us at <Text style={{ color: iptcColors.softBlue }} onPress={() => Linking.openURL('mailto:hello@impactmarket.com')}>hello@impactmarket.com</Text>
                </Text>
            </View>
        </View>
    }

    if (community === undefined) {
        return <View>
            <Paragraph>Loading...</Paragraph>
        </View>
    }

    return (
        <>
            <Header
                title="Manager"
                navigation={navigation}
            >
                {community.status === 'valid' && <IconButton
                    icon="dots-horizontal"
                    style={{ backgroundColor: '#eaedf0' }}
                    onPress={() => setOpenModalMore(true)}
                />}
            </Header>
            {communityStatus(community)}
            <Portal>
                <Dialog
                    visible={openModalMore}
                    onDismiss={() => setOpenModalMore(false)}
                >
                    <Dialog.Content>
                        <Button
                            mode="outlined"
                            style={{ marginVertical: 10 }}
                            onPress={() => {
                                setOpenModalMore(false);
                                navigation.navigate('CreateCommunityScreen',
                                    { community: community }
                                )
                            }}
                        >
                            Edit community details
                        </Button>
                        <Button
                            mode="outlined"
                            style={{ marginVertical: 10 }}
                            onPress={() => {
                                setOpenModalMore(false);
                                navigation.navigate('CommunityDetailsScreen',
                                    { community: community, user: props.user }
                                )
                            }}
                        >
                            View as public
                        </Button>
                        <Button
                            mode="outlined"
                            style={{ marginVertical: 10 }}
                            disabled={true}
                        >
                            Share
                        </Button>
                    </Dialog.Content>
                </Dialog>
            </Portal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: -40,
        marginHorizontal: 20
    },
    imageBackground: {
        width: '100%',
        height: 180,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    communityName: {
        fontSize: 25,
        fontWeight: 'bold',
        fontFamily: 'Gelion-Bold',
        color: 'white',
        textAlign: 'center'
    },
    communityLocation: {
        fontSize: 20,
        color: 'white'
    },
});

export default connector(CommunityManagerView);