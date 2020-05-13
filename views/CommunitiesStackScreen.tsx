import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CommunitiesScreen from './communities/CommunitiesScreen';
import CommunityDetailsScreen from './communities/CommunityDetailsScreen';



const CommunitiesStack = createStackNavigator();

export default function CommunitiesStackScreen() {
    return (
        <CommunitiesStack.Navigator>
            <CommunitiesStack.Screen
                options={{
                    headerShown: false
                }}
                name="CommunitiesScreen"
                component={CommunitiesScreen}
            />
            <CommunitiesStack.Screen
                name="CommunityDetailsScreen"
                component={CommunityDetailsScreen}
            />
        </CommunitiesStack.Navigator>
    );
}