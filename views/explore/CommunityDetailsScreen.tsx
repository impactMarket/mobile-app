import React from 'react';
import {
    Text,
    View,
    Dimensions,
    StyleSheet,
    ImageBackground,
} from 'react-native';
import {
    LineChart, ChartConfig,
} from 'react-native-chart-kit';
import {
    ICommunityInfo, IUserState,
} from '../../helpers/types';
import { AntDesign } from '@expo/vector-icons';
import ApplyAsBeneficiary from './actions/ApplyAsBeneficiary';
import Donate from './actions/Donate';


const chartConfig: ChartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#08130D',
    backgroundGradientToOpacity: 0,
    strokeWidth: 1,
    barPercentage: 0.5,
    color: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
    style: {
        // borderRadius: 6
    },
};
const screenWidth = Dimensions.get('window').width + 140;
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
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
            {
                data: [10, 25, 38, 20, 39, 23]
            }
        ]
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={{ uri: community.coverImage }}
                resizeMode={'cover'}
                style={styles.imageBackground}
            >
                <Text style={styles.communityName}>{community.name}</Text>
                <Text style={styles.communityLocation}>
                    <AntDesign name="enviromento" size={20} /> {community.location.title}
                </Text>
            </ImageBackground>
            <LineChart
                data={dummyData}
                width={screenWidth}
                height={150}
                chartConfig={chartConfig}
                withInnerLines={false}
                withOuterLines={false}
                withHorizontalLabels={false}
                withVerticalLabels={false}
                withDots={false}
                bezier={true}
                style={{
                    // marginVertical: 8,
                }}
            />
            <Donate
                community={community}
            />
            <ApplyAsBeneficiary
                community={community}
                beneficiaryWalletAddress={user.celoInfo.address}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
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
        color: 'white'
    },
    communityLocation: {
        fontSize: 20,
        color: 'white'
    },
});