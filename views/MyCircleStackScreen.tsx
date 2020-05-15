import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MyCircleScreen from './mycircle/MyCircleScreen';
import CreateCommunityScreen from './CreateCommunityScreen';



const MyCircleStack = createStackNavigator();

export default function MyCircleStackScreen() {
    return (
        <MyCircleStack.Navigator>
            <MyCircleStack.Screen
                options={{
                    headerShown: false
                }}
                name="MyCircleScreen"
                component={MyCircleScreen}
            />
            <MyCircleStack.Screen
                name="CreateCommunityScreen"
                component={CreateCommunityScreen}
            />
        </MyCircleStack.Navigator>
    );
}