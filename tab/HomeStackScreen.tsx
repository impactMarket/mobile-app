import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './Home';
import Details from './Details';



const HomeStack = createStackNavigator();

export default function HomeStackScreen() {
    return (
        <HomeStack.Navigator>
            <HomeStack.Screen
                options={{
                    headerTransparent: true,
                  }}    
                name="Home" 
                component={Home}
            />
            <HomeStack.Screen name="Details" component={Details} />
        </HomeStack.Navigator>
    );
}