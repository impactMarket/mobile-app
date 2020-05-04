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
    ICommunityViewInfo, IUserState,
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
export default function CommunityDetailsScreen({ route }: { route: any }) {
    const community = route.params.community as ICommunityViewInfo;
    const user = route.params.user as IUserState;

    const data = {
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
            <LineChart
                data={data}
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
    }
});