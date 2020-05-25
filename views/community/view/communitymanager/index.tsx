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
} from 'react-native-paper';
import {
    getCommunityByContractAddress,
} from '../../../../services';
import { ScrollView } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Beneficiaries from './cards/Beneficiaries';
import Status from './cards/Status';
import CommunityManagers from './cards/CommunityManagers';
import styles from '../../../styles';


const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};
const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux

function CommunityManagerView(props: Props) {
    const [community, setCommunity] = useState<ICommunityInfo>();
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
        if (_community.status === 'pending') {
            return <Text>Communtiy is still waiting approval</Text>
        }
        return <>
            <Beneficiaries
                community={_community}
                updateCommunity={(_communityUpdate) => setCommunity(_communityUpdate)}
            />
            <CommunityManagers
                managers={_community.managers}
            />
            <Status
                community={_community}
            />
        </>
    }

    if (community === undefined) {
        return <View>
            <Paragraph>Loading...</Paragraph>
        </View>
    }

    return (
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
                <Text style={styles.communityLocation}>
                    <AntDesign name="enviromento" size={20} /> {community.location.title}
                </Text>
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
                <Paragraph>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean sit amet augue justo. In id dolor nec nisi vulputate cursus in a magna. Donec varius elementum ligula, vitae vulputate felis eleifend non. Donec pellentesque convallis congue. Vivamus sed vestibulum turpis, et suscipit lorem. Aenean vehicula pretium sapien.</Paragraph>
                <View style={{ flex: 1, flexDirection: 'row', marginVertical: 25 }}>
                    <Button
                        mode="outlined"
                        disabled={true}
                        onPress={() => console.log('Pressed')}
                    >
                        Edit
                        </Button>
                    <Button
                        mode="outlined"
                        disabled={true}
                        style={{ marginLeft: 'auto' }}
                        onPress={() => console.log('Pressed')}
                    >
                        More...
                        </Button>
                </View>
                {communityStatus(community)}
            </View>
        </ScrollView>
    );
}

export default connector(CommunityManagerView);