import { createStackNavigator } from '@react-navigation/stack';
import { Screens } from 'helpers/constants';
import { IRootState } from 'helpers/types/state';
import React from 'react';
import { useSelector } from 'react-redux';
import { iptcColors } from 'styles/index';
import ClaimExplainedScreen from 'views/community/beneficiary/ClaimExplainedScreen';
import CommunityDetailsScreen from 'views/community/details';
import WaitingTxScreen from 'views/community/details/donate/waitingTx';
import AddBeneficiaryScreen from 'views/community/manager/views/AddBeneficiaryScreen';
import AddManagerScreen from 'views/community/manager/views/AddManagerScreen';
import AddedBeneficiaryScreen from 'views/community/manager/views/AddedBeneficiaryScreen';
import AddedManagerScreen from 'views/community/manager/views/AddedManagerScreen';
import RemovedBeneficiaryScreen from 'views/community/manager/views/RemovedBeneficiaryScreen';
import CreateCommunityScreen from 'views/createCommunity';
import FAQScreen from 'views/faq';
import WelcomeScreen from 'views/welcome/index';

import TabNavigator from './TabNavigator';
import StoriesScreen from 'views/stories';
import StoriesCarouselScreen from 'views/stories/StoriesCarousel';
import CommunitiesListScreen from 'views/communities/CommunitiesList';

const welcomeScreen = (Navigator: typeof Stack) => (
    <Navigator.Screen
        name={Screens.Welcome}
        component={WelcomeScreen}
        options={WelcomeScreen.navigationOptions}
    />
);

const commonScreens = (Navigator: typeof Stack) => (
    <>
        <Navigator.Screen
            name="TabNavigator" // doesn't really matter here
            component={TabNavigator}
            // options={TabNavigator.navigationOptions}
        />
        <Navigator.Screen
            name={Screens.WaitingTx}
            component={WaitingTxScreen}
            options={WaitingTxScreen.navigationOptions}
        />
        <Navigator.Screen
            name={Screens.Stories}
            component={StoriesScreen}
            options={StoriesScreen.navigationOptions}
        />
        <Navigator.Screen
            name={Screens.StoriesCarousel}
            component={StoriesCarouselScreen}
            options={StoriesCarouselScreen.navigationOptions}
        />
        <Navigator.Screen
            name={Screens.CommunitiesList}
            component={CommunitiesListScreen}
            options={CommunitiesListScreen.navigationOptions}
        />
        <Navigator.Screen
            name={Screens.CommunityDetails}
            component={CommunityDetailsScreen}
            options={CommunityDetailsScreen.navigationOptions}
        />
        <Navigator.Screen
            name={Screens.FAQ}
            component={FAQScreen}
            options={FAQScreen.navigationOptions}
        />
    </>
);

const nonBeneficiaryManagerScreens = (Navigator: typeof Stack) => (
    <>
        <Navigator.Screen
            name={Screens.CreateCommunity}
            component={CreateCommunityScreen}
            options={CreateCommunityScreen.navigationOptions}
        />
    </>
);

const beneficiaryScreens = (Navigator: typeof Stack) => (
    <>
        <Navigator.Screen
            name={Screens.ClaimExplained}
            component={ClaimExplainedScreen}
            options={ClaimExplainedScreen.navigationOptions}
        />
    </>
);

const managerScreens = (Navigator: typeof Stack) => (
    <>
        <Navigator.Screen
            name={Screens.AddedBeneficiary}
            component={AddedBeneficiaryScreen}
            options={AddedBeneficiaryScreen.navigationOptions}
        />
        <Navigator.Screen
            name={Screens.RemovedBeneficiary}
            component={RemovedBeneficiaryScreen}
            options={RemovedBeneficiaryScreen.navigationOptions}
        />
        <Navigator.Screen
            name={Screens.AddBeneficiary}
            component={AddBeneficiaryScreen}
            options={AddBeneficiaryScreen.navigationOptions}
        />
        <Navigator.Screen
            name={Screens.AddManager}
            component={AddManagerScreen}
            options={AddManagerScreen.navigationOptions}
        />
        <Navigator.Screen
            name={Screens.AddedManager}
            component={AddedManagerScreen}
            options={AddedManagerScreen.navigationOptions}
        />
    </>
);

const Stack = createStackNavigator();

function StackNavigator() {
    const isManager = useSelector(
        (state: IRootState) => state.user.community.isManager
    );
    const isBeneficiary = useSelector(
        (state: IRootState) => state.user.community.isBeneficiary
    );
    const isAuthenticated = useSelector(
        (state: IRootState) => state.user.wallet.address.length > 0
    );
    const fromWelcomeScreen = useSelector(
        (state: IRootState) => state.app.fromWelcomeScreen
    );

    return (
        <Stack.Navigator
            screenOptions={{
                headerTitleAlign: 'left',
                headerStyle: {
                    elevation: 0, // remove shadow on Android
                    shadowOpacity: 0, // remove shadow on iOS
                    // backgroundColor: 'tomato',
                    height: 100,
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontFamily: 'Gelion-Bold',
                    fontSize: 30,
                    lineHeight: 36,
                    color: iptcColors.almostBlack,
                },
            }}
            initialRouteName={fromWelcomeScreen}
        >
            {isAuthenticated || fromWelcomeScreen.length > 0
                ? commonScreens(Stack)
                : welcomeScreen(Stack)}
            {isBeneficiary && beneficiaryScreens(Stack)}
            {isManager && managerScreens(Stack)}
            {!isBeneficiary &&
                !isManager &&
                nonBeneficiaryManagerScreens(Stack)}
        </Stack.Navigator>
    );
}

export default StackNavigator;
