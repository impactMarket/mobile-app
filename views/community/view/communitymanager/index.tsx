import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ImageBackground,
    RefreshControl,
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
} from 'react-native-paper';
import {
    getCommunityByContractAddress,
} from '../../../../services';
import { ScrollView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import Beneficiaries from './cards/Beneficiaries';
import CommuntyStatus from '../../../../components/CommuntyStatus';
import Header from '../../../../components/Header';
import { useNavigation } from '@react-navigation/native';


const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};
const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux

function CommunityManagerView(props: Props) {
    const navigation = useNavigation();
    const [community, setCommunity] = useState<ICommunityInfo>();
    const [openModalMore, setOpenModalMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        const loadCommunity = async () => {
            const { _address } = props.network.contracts.communityContract;
            const _community = await getCommunityByContractAddress(_address);
            if (_community === undefined) {
                // TODO: show error
                return;
            }
            setCommunity(_community);
            setRefreshing(false);
        }
        loadCommunity();
    }, []);

    const onRefresh = () => {
        const { _address } = props.network.contracts.communityContract;
        getCommunityByContractAddress(_address).then((_community) => {
            if (_community !== undefined) {
                setCommunity(_community);
                setRefreshing(false);
            }
        });
    }

    const communityStatus = (_community: ICommunityInfo) => {
        if (_community.status === 'valid') {
            return <>
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
            </>
        }
        return <Text>Communtiy is still waiting approval</Text>
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
            <ScrollView
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
                    {communityStatus(community)}
                </View>
            </ScrollView>
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