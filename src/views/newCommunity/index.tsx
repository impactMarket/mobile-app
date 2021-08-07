import { NavigationProp } from '@react-navigation/native';
import i18n from 'assets/i18n';
import BackSvg from 'components/svg/header/BackSvg';
import SubmitCommunity from 'navigator/header/SubmitCommunity';
import React, { Suspense } from 'react';
import {
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Text,
} from 'react-native';
import { ipctColors } from 'styles/index';

import { formInitialState } from './state';

const Metadata = React.lazy(() => import('./metadata'));

function CreateCommunityScreen() {
    return (
        <KeyboardAvoidingView
            style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
            }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            enabled
            keyboardVerticalOffset={140}
        >
            <ScrollView
                style={{
                    paddingHorizontal: 20,
                    marginBottom: 20,
                    marginTop: 16,
                }}
            >
                <Suspense fallback={<Text>Loading...</Text>}>
                    <Metadata />
                </Suspense>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

CreateCommunityScreen.navigationOptions = ({
    navigation,
}: {
    navigation: NavigationProp<any, any>;
}) => {
    const handlePressGoBack = () => {
        navigation.goBack();
    };

    const submitNewCommunity = () => {
        //
        console.log(formInitialState);
    };

    return {
        headerLeft: () => <BackSvg onPress={handlePressGoBack} />,
        headerTitle: i18n.t('applyCommunity'),
        headerRight: () => (
            <SubmitCommunity
                submit={submitNewCommunity}
                submitting={false}
                // submitting={sending}
            />
        ),
        headerTitleStyle: {
            fontFamily: 'Manrope-Bold',
            fontSize: 22,
            lineHeight: 28,
            color: '#333239',
        },
        headerTitleContainerStyle: {
            left: 58,
        },
    };
};

const styles = StyleSheet.create({
    cardContent: {
        marginLeft: 30,
        marginRight: 30,
    },
    inputTextFieldLabel: {
        marginHorizontal: 10,
        color: 'grey',
        fontSize: 15,
        fontFamily: 'Gelion-Regular',
    },
    inputTextField: {
        fontFamily: 'Gelion-Regular',
        backgroundColor: 'transparent',
        paddingHorizontal: 0,
    },
    container: {
        marginHorizontal: 20,
        marginBottom: 20,
        marginTop: 16,
    },
    //
    textNote: {
        fontFamily: 'Gelion-Regular',
    },
    communityName: {
        fontSize: 25,
        fontFamily: 'Gelion-Bold',
        color: 'white',
    },
    communityLocation: {
        fontSize: 20,
        color: 'white',
    },
    picker: {
        height: 50,
        width: '100%',
        fontFamily: 'Gelion-Regular',
    },
    pickerBorder: {
        margin: 10,
        borderStyle: 'solid',
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 5,
    },
    imageCover: {
        flex: 1,
        flexDirection: 'column',
        resizeMode: 'cover',
        justifyContent: 'flex-end',
        width: '100%',
        height: 180,
    },
    aroundCurrencyValue: {
        position: 'absolute',
        marginHorizontal: 10,
        right: 0,
        fontFamily: 'Inter-Regular',
        fontSize: 12,
        lineHeight: 20,
        color: ipctColors.regentGray,
    },
    communityDetailsHeadline: {
        fontFamily: 'Manrope-Bold',
        fontSize: 15,
        lineHeight: 24,
    },
    createCommunityDescription: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        lineHeight: 24,
    },
    createCommunityAlertDescription: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        lineHeight: 20,
    },
    uploadContainer: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: 24,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    uploadFilledContainer: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E9EDF4',
        paddingVertical: 18.1,
    },
    uploadBtn: {
        width: 98,
        height: 44,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#E9EDF4',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    gpsBtn: {
        width: '100%',
        height: 44,
        paddingVertical: 8,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    gpsBtnText: {
        fontFamily: 'Inter-Regular',
        fontSize: 15,
        lineHeight: 28,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingRight: 16,
    },
    itemTitle: {
        fontSize: 15,
        lineHeight: 24,
        fontFamily: 'Inter-Regular',
    },
    searchBarContainer: {
        borderColor: ipctColors.borderGray,
        borderWidth: 1,
        borderStyle: 'solid',
        shadowRadius: 0,
        elevation: 0,
        borderRadius: 6,
    },
    createCommunityAlert: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
        minHeight: 80,
        width: '90%',
        marginHorizontal: 20,
        marginTop: 20,
        borderColor: ipctColors.blueRibbon,
        borderRadius: 8,
        borderWidth: 2,
        borderStyle: 'solid',
        paddingVertical: 12,
    },
    errorText: {
        fontFamily: 'Inter-Regular',
        fontSize: 12,
        fontWeight: '400',
        lineHeight: 20,
        textAlign: 'left',
    },
});

export default CreateCommunityScreen;
