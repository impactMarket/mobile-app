import React from 'react';
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
    Headline,
    ProgressBar,
    DataTable,
    Title,
    Button,
} from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import { getAllValidCommunities } from '../../services';
import { calculateCommunityProgress } from '../../helpers';


interface IExploreScreenProps {
    navigation: any;
}
const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};

const connector = connect(mapStateToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & IExploreScreenProps
interface IExploreScreenState {
    communities: ICommunityInfo[];
    optionMenuVisible: boolean; // go explore the world my friend <3
}
class ExploreScreen extends React.Component<Props, IExploreScreenState> {

    constructor(props: any) {
        super(props);
        this.state = {
            communities: [],
            optionMenuVisible: true,
        }
    }

    componentDidMount = () => {
        // load communities
        getAllValidCommunities().then((communities) => this.setState({ communities }));
    }

    render() {
        const {
            communities,
            optionMenuVisible,
        } = this.state;

        if (optionMenuVisible === true) {
            return (
                <View style={{ ...styles.container, margin: 30 }}>
                    <Card>
                        <Card.Cover style={{ height: 100 }} source={{ uri: 'https://picsum.photos/500' }} />
                        <Card.Content>
                            <Title style={{ textAlign: 'center' }}>You don't have a community</Title>
                            <Button
                                mode="contained"
                                onPress={() => this.setState({ optionMenuVisible: false })}
                            >
                                Explore
                            </Button>
                        </Card.Content>
                    </Card>
                    <Card style={{ marginTop: 50 }}>
                        <Card.Cover style={{ height: 100 }} source={{ uri: 'https://picsum.photos/600' }} />
                        <Card.Content>
                            <Title style={{ textAlign: 'center' }}>You have a community</Title>
                            <Button
                                mode="contained"
                                onPress={() => this.props.navigation.navigate('CreateCommunityScreen')}
                            >
                                Create Community
                            </Button>
                        </Card.Content>
                    </Card>
                </View>
            );
        }

        return (
            <SafeAreaView style={styles.container}>
                <ScrollView style={styles.scrollView}>
                    {/** */}
                    <Headline style={{ margin: 10 }} onMagicTap={() => console.warn('oi')} >Explore</Headline>
                    {communities.map((community) => <Card
                        key={community.name}
                        elevation={12}
                        style={styles.card}
                        onPress={() => this.props.navigation.navigate('CommunityDetailsScreen', { community: community, user: this.props.user })}
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
                                <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'white' }}>{community.name}</Text>
                                <Text style={{ fontSize: 20, color: 'white' }}><AntDesign name="enviromento" size={20} /> {community.location.title}</Text>
                            </ImageBackground>
                            <View>
                                <DataTable>
                                    <DataTable.Row style={{ borderBottomColor: 'transparent', marginBottom: -20 }}>
                                        <DataTable.Cell>
                                            <Text style={{ fontWeight: 'bold' }}>{community.backers.length}</Text>
                                        </DataTable.Cell>
                                        <DataTable.Cell>
                                            <Text style={{ fontWeight: 'bold' }}>{community.beneficiaries.length}</Text>
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
                                        progress={calculateCommunityProgress('raised', community)}
                                        color="#5289ff"
                                    />
                                    <ProgressBar
                                        key="claimed"
                                        style={{
                                            marginTop: 10,
                                            backgroundColor: 'rgba(255,255,255,0)'
                                        }}
                                        progress={calculateCommunityProgress('raised', community)}
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

export default connector(ExploreScreen);