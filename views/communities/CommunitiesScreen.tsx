import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import {
    connect,
    ConnectedProps,
} from 'react-redux';
import {
    IRootState,
    ICommunityInfo,
} from '../../helpers/types';
import {
    Card,
    ProgressBar,
    DataTable,
    Button,
    Appbar,
} from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import { getAllValidCommunities } from '../../services';
import { useNavigation } from '@react-navigation/native';
import { calculateCommunityProgress, claimFrequencyToText, humanifyNumber } from '../../helpers';


interface ICommunitiesScreenProps {
    navigation: any;
}
const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};

const connector = connect(mapStateToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & ICommunitiesScreenProps
function CommunitiesScreen(props: Props) {
    const navigation = useNavigation();
    const [communities, setCommunities] = useState<ICommunityInfo[]>([]);

    useEffect(() => {
        const loadCommunities = () => {
            getAllValidCommunities().then(setCommunities);
        }
        loadCommunities();
    }, []);

    return (
        <SafeAreaView>
            <ScrollView style={styles.scrollView}>
                <Appbar.Header style={styles.appbar}>
                    <Appbar.Content title="Communities" />
                    <Button
                        mode="text"
                        onPress={() => navigation.navigate('CreateCommunityScreen')}
                    >
                        Create
                        </Button>
                </Appbar.Header>
                {communities.map((community) => <Card
                    key={community.name}
                    elevation={12}
                    style={styles.card}
                    onPress={() => navigation.navigate('CommunityDetailsScreen', { community: community, user: props.user })}
                >
                    {/* <Card.Cover
                            source={{ uri: community.image }}
                        /> */}
                    <Card.Content style={{ margin: 0 }}>
                        <ImageBackground
                            source={{ uri: community.coverImage }}
                            resizeMode={'cover'}
                            style={{
                                width: '100%',
                                height: 180,
                                justifyContent: 'center',
                                alignContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <Text style={{ fontSize: 25, fontWeight: 'bold', fontFamily: 'Gelion-Bold', color: 'white' }}>{community.name}</Text>
                            <Text style={{ fontSize: 20, color: 'white' }}><AntDesign name="enviromento" size={20} /> {community.location.title}</Text>
                        </ImageBackground>
                        <View>
                            <DataTable>
                                <DataTable.Row style={{ borderBottomColor: 'transparent', marginBottom: -20 }}>
                                    <DataTable.Cell>
                                        <Text style={{ fontWeight: 'bold', fontFamily: 'Gelion-Bold' }}>{community.backers.length}</Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell>
                                        <Text style={{ fontWeight: 'bold', fontFamily: 'Gelion-Bold' }}>{community.beneficiaries.length}</Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell>
                                        <Text style={{ fontWeight: 'bold', fontFamily: 'Gelion-Bold' }}>${humanifyNumber(community.vars._amountByClaim)}/{claimFrequencyToText(community.vars._baseIntervalTime)}</Text>
                                    </DataTable.Cell>
                                </DataTable.Row>

                                <DataTable.Row style={{ borderBottomColor: 'transparent' }}>
                                    <DataTable.Cell>
                                        <Text style={{ color: 'grey' }}>Backers</Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell>
                                        <Text style={{ color: 'grey' }}>Beneficiaries</Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell>
                                        <Text style={{ color: 'grey' }}>UBI Rate</Text>
                                    </DataTable.Cell>
                                </DataTable.Row>
                            </DataTable>
                            <View>
                                <ProgressBar
                                    key="raised"
                                    style={{
                                        marginTop: 10,
                                        backgroundColor: '#d6d6d6',
                                        position: 'absolute'
                                    }}
                                    progress={calculateCommunityProgress('raised', community)}
                                    color="#5289ff"
                                />
                                <ProgressBar
                                    key="claimed"
                                    style={{
                                        marginTop: 10,
                                        backgroundColor: 'rgba(255,255,255,0)'
                                    }}
                                    progress={calculateCommunityProgress('claimed', community)}
                                    color="#50ad53"
                                />
                            </View>
                        </View>
                    </Card.Content>
                </Card>)}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    appbar: {
        backgroundColor: 'transparent',
    },
    scrollView: {
    },
    card: {
        margin: 30,
    }
});

export default connector(CommunitiesScreen);