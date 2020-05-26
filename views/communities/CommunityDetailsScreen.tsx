import React from 'react';
import {
    Text,
    View,
    Dimensions,
    StyleSheet,
    ImageBackground,
} from 'react-native';
import {
    LineChart,
    ChartConfig,
    BarChart
} from 'react-native-chart-kit';
import {
    ICommunityInfo,
    IUserState,
} from '../../helpers/types';
import { AntDesign } from '@expo/vector-icons';
import Donate from './actions/Donate';
import {
    LinearGradient
} from 'expo-linear-gradient';
import {
    Paragraph,
    Button,
    Card,
    Divider,
    Headline,
    Subheading
} from 'react-native-paper';
import {
    ScrollView
} from 'react-native-gesture-handler';
import { humanifyNumber } from '../../helpers';


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
const barChartConfig: ChartConfig = {
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0,
    strokeWidth: 1,
    barPercentage: 0.5,
    color: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
    propsForLabels: {
        opacity: 0 // just make them transparent ¯\_(ツ)_/¯
    }
};
const screenWidth = Dimensions.get('window').width;
interface ICommunityDetailsScreen {
    route: {
        params: {
            community: ICommunityInfo,
            user: IUserState,
        }
    }
}
export default function CommunityDetailsScreen(props: ICommunityDetailsScreen) {
    const community = props.route.params.community as ICommunityInfo;
    const user = props.route.params.user as IUserState;

    const dummyData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
            {
                data: [10, 25, 31, 42, 39, 59, 61, 68, 63, 79, 89, 95]
            }
        ]
    };

    return (
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
                <Paragraph>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean sit amet augue justo. In id dolor nec nisi vulputate cursus in a magna. Donec varius elementum ligula, vitae vulputate felis eleifend non. Donec pellentesque convallis congue. Vivamus sed vestibulum turpis, et suscipit lorem. Aenean vehicula pretium sapien.</Paragraph>
                <View style={{ flex: 1, flexDirection: 'row-reverse', marginVertical: 25 }}>
                    <Button
                        mode="contained"
                        disabled={true}
                        onPress={() => console.log('Pressed')}
                    >
                        See More
                    </Button>
                </View>
                <Card>
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
                            <View>
                                <Headline>35%</Headline>
                                <Paragraph style={{ color: '#b0b0b0' }}>Self-sustainability index</Paragraph>
                            </View>
                        </View>
                    </Card.Content>
                </Card>
                <Card style={{ marginVertical: 25 }}>
                    <Card.Content>
                        <Subheading>Daily Volume</Subheading>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <AntDesign name="arrowup" size={12} color="green" />
                            <Text style={{ fontWeight: 'bold', fontFamily: 'Gelion-Bold' }}>12%</Text>
                            <Text> Last 30 days</Text>
                        </View>
                        <BarChart
                            data={dummyData}
                            width={300}
                            height={220}
                            yAxisLabel=""
                            yAxisSuffix=""
                            withInnerLines={false}
                            chartConfig={barChartConfig}
                            style={{
                                marginLeft: -50,
                            }}
                        />
                    </Card.Content>
                </Card>
            </View>
            <View style={{ backgroundColor: 'white', width: '100%', alignItems: 'center', padding: 10 }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Button
                        mode="contained"
                        disabled={true}
                        style={{ marginHorizontal: 5 }}
                        onPress={() => console.log('Pressed')}
                    >
                        $10
                    </Button>
                    <Button
                        mode="contained"
                        disabled={true}
                        style={{ marginHorizontal: 5 }}
                        onPress={() => console.log('Pressed')}
                    >
                        $20
                    </Button>
                    <Button
                        mode="contained"
                        disabled={true}
                        style={{ marginHorizontal: 5 }}
                        onPress={() => console.log('Pressed')}
                    >
                        $50
                    </Button>
                    <Donate
                        community={props.route.params.community}
                    />
                </View>
                <Text>50 donations will empower 7 people out of poverty.</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
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