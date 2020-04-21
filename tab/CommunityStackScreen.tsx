import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CommunityScreen from './community/CommunityScreen';
import ClaimExplainedScreen from './community/ClaimExplainedScreen';



const CommunityStack = createStackNavigator();

export default function CommunityStackScreen() {
    return (
        <CommunityStack.Navigator>
            <CommunityStack.Screen
                options={{
                    headerTransparent: true,
                  }}    
                name="HomeScreen" 
                component={CommunityScreen}
            />
            <CommunityStack.Screen
                name="ClaimExplainedScreen"
                component={ClaimExplainedScreen}
            />
        </CommunityStack.Navigator>
    );
}