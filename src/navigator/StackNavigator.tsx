import { createStackNavigator } from '@react-navigation/stack';
import { Screens } from 'helpers/constants';
import { IRootState } from 'helpers/types/state';
import React from 'react';
import { useSelector } from 'react-redux';
import { ipctColors } from 'styles/index';
import ListCommunitiesScreen from 'views/communities/List';
import AnonymousReportScreen from 'views/community/beneficiary/AnonymousReportScreen';
import ClaimExplainedScreen from 'views/community/beneficiary/ClaimExplainedScreen';
import WelcomeRulesScreen from 'views/community/beneficiary/WelcomeRulesScreen';
import CommunityDetailsScreen from 'views/community/details';
import WaitingTxScreen from 'views/community/details/donate/waitingTx';
import CommunityExtendedDetailsScreen from 'views/community/extendedDetails';
import AddBeneficiaryScreen from 'views/community/manager/views/AddBeneficiaryScreen';
import AddManagerScreen from 'views/community/manager/views/AddManagerScreen';
import AddedBeneficiaryScreen from 'views/community/manager/views/AddedBeneficiaryScreen';
import AddedManagerScreen from 'views/community/manager/views/AddedManagerScreen';
import RemovedBeneficiaryScreen from 'views/community/manager/views/RemovedBeneficiaryScreen';
import CreateCommunityScreen from 'views/createEditCommunity/create';
import EditCommunityScreen from 'views/createEditCommunity/edit';
import FAQScreen from 'views/faq';
import ProfileScreen from 'views/profile';
import Auth from 'views/profile/auth';
import StoriesScreen from 'views/stories';
import Carousel from 'views/stories/Carousel';
import NewStoryScreen from 'views/stories/NewStory';
import StoriesCarouselScreen from 'views/stories/StoriesCarousel';
import WelcomeScreen from 'views/welcome/index';

import TabNavigator from './TabNavigator';
import CommunitiesScreen from 'views/communities';

const welcomeScreen = (Navigator: typeof Stack) => (
    <>
        <Navigator.Screen
            name={Screens.Welcome}
            component={WelcomeScreen}
            options={WelcomeScreen.navigationOptions}
        />
    </>
);

const commonScreens = (Navigator: typeof Stack, isInCommunity: boolean) => (
    <>
        {isInCommunity ? (
            <Navigator.Screen
                name="TabNavigator" // doesn't really matter here
                component={TabNavigator}
            />
        ) : (
            <Navigator.Screen
                name={Screens.Communities}
                component={CommunitiesScreen}
                options={CommunitiesScreen.navigationOptions as any}
            />
        )}
        <Navigator.Screen
            name={Screens.CreateCommunity}
            component={CreateCommunityScreen}
            options={CreateCommunityScreen.navigationOptions}
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
            name={Screens.NewStory}
            component={NewStoryScreen}
            options={NewStoryScreen.navigationOptions}
        />
        <Navigator.Screen
            name={Screens.StoriesCarousel}
            component={StoriesCarouselScreen}
            options={StoriesCarouselScreen.navigationOptions}
        />
        <Navigator.Screen
            name={Screens.Carousel}
            component={Carousel}
            options={{ headerShown: false }}
        />
        <Navigator.Screen
            name={Screens.CommunityDetails}
            component={CommunityDetailsScreen}
            options={CommunityDetailsScreen.navigationOptions}
        />
        <Navigator.Screen
            name={Screens.CommunityExtendedDetailsScreen}
            component={CommunityExtendedDetailsScreen}
            options={CommunityExtendedDetailsScreen.navigationOptions}
        />
        <Navigator.Screen
            name={Screens.FAQ}
            component={FAQScreen}
            options={FAQScreen.navigationOptions}
        />
        <Navigator.Screen
            name={Screens.WelcomeRulesScreen}
            component={WelcomeRulesScreen}
            options={WelcomeRulesScreen.navigationOptions}
        />
        <Navigator.Screen
            name={Screens.ListCommunities}
            component={ListCommunitiesScreen}
            options={ListCommunitiesScreen.navigationOptions}
        />
        <Navigator.Screen
            name={Screens.Profile}
            component={ProfileScreen}
            options={ProfileScreen.navigationOptions}
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
        <Navigator.Screen
            name={Screens.AnonymousReport}
            component={AnonymousReportScreen}
            // options={AnonymousReportScreen.navigationOptions}
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
            name={Screens.EditCommunity}
            component={EditCommunityScreen}
            options={EditCommunityScreen.navigationOptions}
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
            headerMode="screen"
            screenOptions={{
                headerTitleAlign: 'left',
                headerLeft: () => null,
                headerStyle: {
                    elevation: 0, // remove shadow on Android
                    shadowOpacity: 0, // remove shadow on iOS
                    height: 100,
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontFamily: 'Gelion-Bold',
                    fontSize: 30,
                    lineHeight: 36,
                    color: ipctColors.almostBlack,
                },
            }}
            initialRouteName={fromWelcomeScreen}
        >
            {isAuthenticated || fromWelcomeScreen.length > 0
                ? commonScreens(Stack, isBeneficiary || isManager)
                : welcomeScreen(Stack)}
            {isBeneficiary && beneficiaryScreens(Stack)}
            {isManager && managerScreens(Stack)}
        </Stack.Navigator>
    );
}

export default StackNavigator;
