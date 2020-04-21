import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './home/HomeScreen';
import ClaimExplainedScreen from './home/ClaimExplainedScreen';



const CommunityStack = createStackNavigator();

export default function CommunityStackScreen() {
    return (
        <CommunityStack.Navigator>
            <CommunityStack.Screen
                options={{
                    headerTransparent: true,
                  }}    
                name="HomeScreen" 
                component={HomeScreen}
            />
            <CommunityStack.Screen name="ClaimExplainedScreen" component={ClaimExplainedScreen} />
        </CommunityStack.Navigator>
    );
}