import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './home/HomeScreen';
import ClaimExplainedScreen from './home/ClaimExplainedScreen';



const HomeStack = createStackNavigator();

export default function HomeStackScreen() {
    return (
        <HomeStack.Navigator>
            <HomeStack.Screen
                options={{
                    headerTransparent: true,
                  }}    
                name="HomeScreen" 
                component={HomeScreen}
            />
            <HomeStack.Screen name="ClaimExplainedScreen" component={ClaimExplainedScreen} />
        </HomeStack.Navigator>
    );
}