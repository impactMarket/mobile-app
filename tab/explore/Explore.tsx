import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    ImageBackground,
    SafeAreaView,
    ScrollView
} from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState, ICommunityInfo } from '../../helpers/types';
import { Card, Headline, ProgressBar, DataTable } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';


interface IExploreProps {
}
const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};

const connector = connect(mapStateToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & IExploreProps
interface IExploreState {
    communities: ICommunityInfo[];
}
class Explore extends React.Component<Props, IExploreState> {

    constructor(props: any) {
        super(props);
        this.state = {
            communities: [
                {
                    title: 'Fehsolna',
                    location: 'São Paulo',
                    image: 'https://picsum.photos/700',
                    backers: 2,
                    beneficiaries: 2,
                    ubiRate: 1,
                    totalClaimed: 0.1,
                    totalRaised: 0.3,
                },
                {
                    title: 'Curitiba',
                    location: 'Rio de Janeiro',
                    image: 'https://picsum.photos/600',
                    backers: 5,
                    beneficiaries: 12,
                    ubiRate: 2,
                    totalClaimed: 0.6,
                    totalRaised: 0.8,
                }
            ]
        }
    }

    render() {
        const { communities } = this.state;
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView style={styles.scrollView}>
                    {/** */}
                    <Headline style={{ margin: 10 }} onMagicTap={() => console.warn('oi')} >Explore</Headline>
                    {communities.map((community) => <Card key={community.title} elevation={12} style={styles.card}>
                        {/* <Card.Cover
                            source={{ uri: community.image }}
                        /> */}
                        <Card.Content style={{ margin: 0 }}>
                            <ImageBackground
                                source={{ uri: community.image }}
                                resizeMode={'cover'}
                                style={{
                                    width: '100%',
                                    height: 180,
                                    justifyContent: 'center',
                                    alignContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'white' }}>{community.title}</Text>
                                <Text style={{ fontSize: 20, color: 'white' }}><AntDesign name="enviromento" size={20} /> {community.location}</Text>
                            </ImageBackground>
                            <View>
                                <DataTable>
                                    <DataTable.Row style={{ borderBottomColor: 'transparent', marginBottom: -20 }}>
                                        <DataTable.Cell>
                                            <Text style={{ fontWeight: 'bold' }}>{community.backers}</Text>
                                        </DataTable.Cell>
                                        <DataTable.Cell>
                                            <Text style={{ fontWeight: 'bold' }}>{community.beneficiaries}</Text>
                                        </DataTable.Cell>
                                        <DataTable.Cell>
                                            <Text style={{ fontWeight: 'bold' }}>${community.ubiRate}/day</Text>
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
                                        progress={community.totalRaised}
                                        color="#5289ff"
                                    />
                                    <ProgressBar
                                        key="claimed"
                                        style={{
                                            marginTop: 10,
                                            backgroundColor: 'rgba(255,255,255,0)'
                                        }}
                                        progress={community.totalClaimed}
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
}

const styles = StyleSheet.create({
    container: {
        paddingTop: Expo.Constants.statusBarHeight,
    },
    scrollView: {
    },
    card: {
        margin: 30,
    }
});

export default connector(Explore);