import { Body, Button, colors, Image, Title } from '@impact-market/ui-kit';
import { useNavigation } from '@react-navigation/core';
import i18n from 'assets/i18n';
import ManageSvg from 'components/svg/ManageSvg';
import { Screens } from 'helpers/constants';
import { chooseMediaThumbnail } from 'helpers/index';
import { ITabBarIconProps } from 'helpers/types/common';
import { IRootState } from 'helpers/types/state';
import React from 'react';
import {
    Text,
    View,
    Dimensions,
    StyleSheet,
    Platform,
    ViewStyle,
    StyleProp,
    ViewProps,
    Pressable,
} from 'react-native';
import { useSelector } from 'react-redux';
// import * as Progress from 'react-native-progress';

// ================ DEFAULT STYLING COMPONENTS ================ //
const width = Dimensions.get('window').width;

function ProgressBar(props: ViewProps & { progress: number }) {
    return (
        <View {...props.style}>
            <View
                style={{
                    height: 6,
                    width: '100%',
                    backgroundColor: colors.background.secondary,
                    borderRadius: 3,
                }}
            >
                <View
                    style={{
                        height: 6,
                        width: `${props.progress * 100}%`,
                        backgroundColor: colors.brand.primary,
                        borderRadius: 3,
                    }}
                />
            </View>
        </View>
    );
}

function CommunityManagerScreen() {
    const navigation = useNavigation();
    const community = useSelector(
        (state: IRootState) => state.user.community.metadata
    );

    return (
        <View style={styles.container}>
            {/* // ================ HEADER TAB ================ // */}
            <View style={{ marginHorizontal: 22 }}>
                <View style={styles.headerTabWrapper}>
                    <Image
                        source={{
                            uri: chooseMediaThumbnail(community.cover, {
                                heigth: 42,
                                width: 42,
                            }),
                        }}
                        style={{
                            borderRadius: 4,
                        }}
                        width={42}
                        height={42}
                    />

                    <View style={{ width: width / 1.5 }}>
                        <Text
                            style={{
                                fontFamily: 'Manrope_800ExtraBold',
                                fontSize: 16,
                            }}
                        >
                            {community.name}
                        </Text>
                        <Text style={styles.smallInterText}>
                            {community.city}, {community.country}
                        </Text>
                    </View>
                    <Image
                        source={require('./assets/icons/right.png')}
                        style={{ width: 7, height: 12 }}
                    />
                </View>

                {/* // ================ PROGESS BAR ================ // */}
                <View style={{ paddingVertical: 8 }}>
                    <View style={styles.progressWrapper}>
                        <View>
                            <Body style={{ color: colors.text.secondary }}>
                                14 Beneficiaries
                            </Body>
                            <Title>$1456 (9%)</Title>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Body style={{ color: colors.text.secondary }}>
                                Max.
                            </Body>
                            <Title>$14,560</Title>
                        </View>
                    </View>
                    <ProgressBar style={{ paddingTop: 12 }} progress={0.3} />
                </View>
            </View>

            {/* // ================ BUTTON WRAPPER ================ // */}
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                {/* <View style={{ flexDirection: 'row' }}>
                    <Image
                        source={require('./assets/icons/warning.png')}
                        style={{ width: 16, height: 16, marginRight: 10 }}
                    />
                    <Text
                        style={{ color: '#1E3252', ...styles.smallInterText }}
                    >
                        Funds will run out in 3 days.
                    </Text>
                </View>
                <Text
                    style={{
                        color: '#2362FB',
                        fontSize: 15,
                        fontFamily: 'Inter_500Medium',
                    }}
                >
                    Request more funds
                </Text> */}

                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingTop: 8,
                        paddingBottom: 32,
                        paddingHorizontal: 22,
                        width: '100%',
                    }}
                >
                    <Button
                        onPress={() =>
                            navigation.navigate(Screens.AddBeneficiary)
                        }
                        style={{ flex: 1 }}
                    >
                        {i18n.t('manager.addBeneficiary')}
                    </Button>
                    <View style={{ width: 16 }} />
                    <Button
                        onPress={() => navigation.navigate(Screens.AddManager)}
                        style={{ flex: 1 }}
                        mode="gray"
                    >
                        {i18n.t('manager.addManager')}
                    </Button>
                </View>
            </View>

            {/* // ================ BOTTOM OPTIONS START ================ // */}
            <View style={{ backgroundColor: '#E9EDF4', flex: 1 }}>
                <Pressable
                    style={{
                        ...styles.headerTabWrapper,
                        marginHorizontal: 22,
                        paddingVertical: 10,
                    }}
                    onPress={() =>
                        navigation.navigate(Screens.AddedBeneficiary)
                    }
                >
                    <Text style={styles.mediumManropeText}>
                        Beneficiaries (4)
                    </Text>
                    <Image
                        source={require('./assets/icons/right.png')}
                        style={{ width: 7, height: 12 }}
                    />
                </Pressable>
                <View
                    style={{
                        ...styles.headerTabWrapper,
                        marginHorizontal: 22,
                        paddingVertical: 10,
                    }}
                >
                    <Text style={styles.mediumManropeText}>Managers (2)</Text>
                    <Image
                        source={require('./assets/icons/right.png')}
                        style={{ width: 7, height: 12 }}
                    />
                </View>
            </View>
        </View>
    );
}

CommunityManagerScreen.navigationOptions = () => {
    return {
        headerTitle: i18n.t('generic.manage'),
        tabBarLabel: i18n.t('generic.manage'),
        tabBarIcon: (props: ITabBarIconProps) => (
            <ManageSvg focused={props.focused} />
        ),
    };
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    headerText: {
        fontFamily: 'Manrope_800ExtraBold',
        fontSize: 22,
    },
    headerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 22,
        paddingVertical: Platform.OS === 'ios' ? 0 : 20,
    },
    headerTabWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    progressWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    smallInterText: {
        fontFamily: 'Inter_400Regular',
        fontSize: 14,
        color: '#73839D',
    },
    smallManropeText: {
        fontFamily: 'Manrope_800ExtraBold',
        fontSize: 14,
        color: '#333239',
    },
    mediumManropeText: {
        fontFamily: 'Manrope_800ExtraBold',
        fontSize: 16,
        color: '#333239',
    },
    btnWrapper: {
        backgroundColor: '#2362FB',
        width: width / 2.4,
        height: 50,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
});

export default CommunityManagerScreen;
