import * as React from 'react';
import { Text, View } from 'react-native';


export default function CommunityDetailsScreen({ route, navigation }: { route: any, navigation: any }) {

    const { itemId } = route.params;
    const { otherParam } = route.params;

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin: 50 }}>
            <Text>Details Screen</Text>
            <Text>itemId: {JSON.stringify(itemId)}</Text>
            <Text>otherParam: {JSON.stringify(otherParam)}</Text>
        </View>
    );
}