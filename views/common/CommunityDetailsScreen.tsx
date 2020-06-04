import React, { useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    ImageBackground,
} from 'react-native';
import {
    LineChart,
    ChartConfig,
} from 'react-native-chart-kit';
import {
    ICommunityInfo,
    IUserState,
} from '../../helpers/types';
import { AntDesign } from '@expo/vector-icons';
import Donate from '../communities/actions/Donate';
import {
    LinearGradient
} from 'expo-linear-gradient';
import {
    Paragraph,
    Button,
    Card,
    Divider,
    Headline,
} from 'react-native-paper';
import {
    ScrollView
} from 'react-native-gesture-handler';
import { humanifyNumber } from '../../helpers';
import CommuntyStatus from '../../components/CommuntyStatus';
import Header from '../../components/Header';
import { useNavigation } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';
import config from '../../config';


const lineChartConfig: ChartConfig = {
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0,
    strokeWidth: 1,
    barPercentage: 0.5,
    color: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
    style: {
        // borderRadius: 6
    },
    fillShadowGradientOpacity: 0
};
interface ICommunityDetailsScreen {
    route: {
        params: {
            community: ICommunityInfo,
        }
    }
}
export default function CommunityDetailsScreen(props: ICommunityDetailsScreen) {
    const navigation = useNavigation();
    const community = props.route.params.community as ICommunityInfo;

    const [seeFullDescription, setSeeFullDescription] = useState(false);

    const dummyData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
            {
                data: [10, 25, 31, 42, 39, 59, 61, 68, 63, 79, 89, 95]
            }
        ]
    };

    let description;
    if (seeFullDescription || community.description.indexOf('\n') == -1) {
        description = community.description;
    } else {
        description = community.description.slice(0, community.description.indexOf('\n'));
    }

    return (
        <>
            <Header
                title=""
                hasBack={true}
                hasShare={true}
                hasHelp={true}
                navigation={navigation}
            />
            <ScrollView>
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
                    <Card>
                        <Card.Content>
                            <Paragraph>{description}</Paragraph>
                            <Button
                                mode="contained"
                                disabled={community.description.indexOf('\n') === -1}
                                onPress={() => setSeeFullDescription(!seeFullDescription)}
                            >
                                See {(seeFullDescription ? 'Less' : 'More')}
                            </Button>
                        </Card.Content>
                    </Card>
                    <Card style={{ marginVertical: 25 }}>
                        <Card.Content>
                            <View style={{ flex: 1, flexDirection: 'row', margin: 0 }}>
                                <View>
                                    <Headline>${humanifyNumber(community.vars._amountByClaim)}</Headline>
                                    <Paragraph style={{ color: '#b0b0b0' }}>Up to ${humanifyNumber(community.vars._claimHardCap)} / beneficiary</Paragraph>
                                </View>
                            </View>
                            <Divider />
                            <View style={{ flex: 1, flexDirection: 'row', margin: 0 }}>
                                <LineChart
                                    data={dummyData}
                                    width={200}
                                    height={100}
                                    fromZero={true}
                                    chartConfig={lineChartConfig}
                                    withInnerLines={false}
                                    withOuterLines={false}
                                    withHorizontalLabels={false}
                                    withVerticalLabels={false}
                                    withDots={false}
                                    bezier={true}
                                    style={{
                                        marginLeft: -70,
                                    }}
                                />
                                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', marginRight: 0 }}>
                                    <Headline style={{
                                        fontFamily: "Gelion-Regular",
                                        fontSize: 36,
                                        fontStyle: "normal",
                                        lineHeight: 36,
                                        letterSpacing: 0,
                                        textAlign: 'right'
                                    }}>35%</Headline>
                                    <Paragraph style={{ color: '#b0b0b0' }}>Self-Sustainability Index</Paragraph>
                                </View>
                            </View>
                        </Card.Content>
                    </Card>
                    <CommuntyStatus community={community}>
                        <Button
                            mode="outlined"
                            style={{ width: '100%' }}
                            onPress={() => WebBrowser.openBrowserAsync(config.blockExplorer + community.contractAddress)}
                        >
                            Explore Community Contract
                    </Button>
                    </CommuntyStatus>
                </View>
                <Donate
                    community={community}
                />
            </ScrollView >
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: -40,
        margin: 20
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
        color: 'white'
    },
    communityLocation: {
        fontSize: 20,
        color: 'white'
    },
});