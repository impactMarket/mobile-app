import * as React from 'react';
import { Text, View, Dimensions } from 'react-native';
import {
    LineChart,
} from "react-native-chart-kit";
import { ICommunityInfo } from '../../helpers/types';


export default function CommunityDetailsScreen({ route, navigation }: { route: any, navigation: any }) {

    const community = route.params as ICommunityInfo;

    const data = {
        labels: ["January", "February", "March", "April", "May", "June"],
        datasets: [
            {
                data: [20, 45, 28, 80, 99, 43]
            }
        ]
    };
    const chartConfig = {
        backgroundGradientFrom: "#1E2923",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#08130D",
        backgroundGradientToOpacity: 0,
        strokeWidth: 1,
        barPercentage: 0.5,
        color: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
        style: {
            borderRadius: 6
        },
    };
    const screenWidth = Dimensions.get("window").width;

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin: 50 }}>
            <Text>title: {community.title}</Text>
            <Text>location: {community.location}</Text>
            <Text>backers: {community.backers}</Text>
            <LineChart
                data={data}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                withInnerLines={false}
                withOuterLines={false}
                withHorizontalLabels={false}
                withVerticalLabels={false}
                withDots={false}
                bezier={true}
                style={{
                    marginVertical: 8,
                }}
            />
        </View>
    );
}