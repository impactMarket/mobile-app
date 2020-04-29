import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ExploreScreen from './explore/ExploreScreen';
import CommunityDetailsScreen from './explore/CommunityDetailsScreen';
import CreateCommunityScreen from './explore/CreateCommunityScreen';



const ExploreStack = createStackNavigator();

export default function ExploreStackScreen() {
    return (
        <ExploreStack.Navigator>
            <ExploreStack.Screen
                options={{
                    headerShown: false,
                }}
                name="ExploreScreen"
                component={ExploreScreen}
            />
            <ExploreStack.Screen
                name="CommunityDetailsScreen"
                component={CommunityDetailsScreen}
            />
            <ExploreStack.Screen
                name="CreateCommunityScreen"
                component={CreateCommunityScreen}
            />
        </ExploreStack.Navigator>
    );
}