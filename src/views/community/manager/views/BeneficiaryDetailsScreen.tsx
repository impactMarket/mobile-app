import {
    ArrowIcon,
    Body,
    colors,
    CopyIcon,
    Pill,
    Title,
    WarningIcon,
    Image,
} from '@impact-market/ui-kit';
import BackSvg from 'components/svg/header/BackSvg';
import { amountToCurrency } from 'helpers/currency';
import { IBeneficiaryActivities } from 'helpers/types/endpoints';
import { IRootState } from 'helpers/types/state';
import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import Api from 'services/api';

function ActivityItem(props: {
    userCurrency: string;
    exchangeRates: {
        [key: string]: number;
    };
    activity: IBeneficiaryActivities;
}) {
    const { activity, userCurrency, exchangeRates } = props;
    return (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 12,
            }}
        >
            <View>
                <View
                    style={{
                        flexDirection: 'row',
                    }}
                >
                    <Title>{activity.type}</Title>
                    <View style={{ width: 4 }} />
                    <WarningIcon color={colors.ui.error} width={12.37} />
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                    }}
                >
                    <Body style={{ color: colors.text.secondary }}>
                        1 days ago · 0xc1912f...JSA59aE31
                    </Body>
                    <View style={{ width: 8 }} />
                    <Pressable>
                        <CopyIcon width={16.41} />
                    </Pressable>
                </View>
            </View>
            {activity.amount && (
                <Title>
                    {amountToCurrency(
                        activity.amount,
                        userCurrency,
                        exchangeRates
                    )}
                </Title>
            )}
        </View>
    );
}

interface BeneficiaryDetailsScreenProps {
    route: {
        params: {
            beneficiary: string;
        };
    };
}

function BeneficiaryDetailsScreen(props: BeneficiaryDetailsScreenProps) {
    const { beneficiary } = props.route.params;
    const [activities, setActivities] = useState<IBeneficiaryActivities[]>([]);

    const userCurrency = useSelector(
        (state: IRootState) => state.user.metadata.currency
    );
    const exchangeRates = useSelector(
        (state: IRootState) => state.app.exchangeRates
    );

    useEffect(() => {
        Api.community.getBeneficiaryActivity(beneficiary, 0, 10).then((a) => {
            console.log(a.data);
            setActivities(a.data);
        });
    }, []);

    return (
        <ScrollView style={{ paddingHorizontal: 22 }}>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}
            >
                <View>
                    <Title>Cameron Williamson</Title>
                    <View
                        style={{
                            flexDirection: 'row',
                        }}
                    >
                        <Body style={{ color: colors.text.secondary }}>
                            $25 Claimed 0xc1912f...JSA59aE31
                        </Body>
                        <Pressable>
                            <CopyIcon />
                        </Pressable>
                    </View>
                </View>

                <Image
                    style={{
                        borderRadius: 21,
                    }}
                    height={42}
                    width={42}
                    source={require('./assets/beneficiary/avatar.png')}
                />
            </View>
            <View style={styles.boxContainer}>
                <View style={[styles.row, { padding: 5 }]}>
                    <WarningIcon color={colors.ui.error} />
                    <Text style={styles.textStyle1}>
                        Suspicious Activily Detected
                    </Text>
                </View>
                <Text style={styles.boxTxt}>
                    Beneficiary may be involved in suspicious activity.
                </Text>
            </View>
            <View style={styles.subContainer}>
                <View style={styles.topIconLeft}>
                    <Pill right={<ArrowIcon direction="down" />}>
                        All Transactions
                    </Pill>
                </View>
            </View>
            <View>
                {activities.map((a) => (
                    <ActivityItem
                        key={a.id}
                        activity={a}
                        userCurrency={userCurrency}
                        exchangeRates={exchangeRates}
                    />
                ))}
            </View>
        </ScrollView>
    );
}

BeneficiaryDetailsScreen.navigationOptions = () => {
    return {
        headerLeft: () => <BackSvg />,
        headerTitle: '',
    };
};

export default BeneficiaryDetailsScreen;

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
    },
    topIconLeft: {
        justifyContent: 'flex-start',
        flex: 1,
    },
    btnBackContainer: {
        height: 33.6,
        width: 33.6,
        borderRadius: 33.6 / 2,
        backgroundColor: '#E9EDF4',
        justifyContent: 'center',
    },
    backIcon: {
        alignSelf: 'center',
        height: 18,
        width: 11,
    },
    topIconRight: {
        justifyContent: 'flex-end',
        marginRight: 10,
    },
    center: {
        alignSelf: 'center',
    },
    end: {
        justifyContent: 'flex-end',
    },
    subContainer: {
        flexDirection: 'row',
        // marginTop: 20,
    },
    textStyle1: {
        fontFamily: 'Manrope-Bold',
        fontSize: 16,
        lineHeight: 22,
    },
    textStyle2: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        lineHeight: 24,
        color: '#73839D',
    },
    textStyle3: {
        color: '#2362FB',
        fontSize: 14,
        lineHeight: 24,
        fontFamily: 'Inter-Regular',
    },
    boxContainer: {
        height: 110,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#EB5757',
        padding: 15,
        marginTop: 20,
    },
    avatar: {
        height: 42,
        width: 42,
        borderRadius: 21,
    },
    boxTxt: {
        fontFamily: 'Inter-Regular',
        fontSize: 15,
        lineHeight: 24,
        color: '#172032',
    },
    btnTxt: {
        width: 115,
        height: 28,
        fontFamily: 'Inter-Regular',
        lineHeight: 28,
        fontSize: 15,
    },
    btn: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width: 169,
        height: 36,
        backgroundColor: '#E9EDF4',
        borderRadius: 46,
        paddingTop: 4,
    },
});
