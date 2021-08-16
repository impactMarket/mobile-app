import i18n from 'assets/i18n';
import Button from 'components/core/Button';
import { modalDonateAction } from 'helpers/constants';
import { CommunityAttributes } from 'helpers/types/models';
import React from 'react';
import { View, StyleSheet, Pressable, Image } from 'react-native';
import { Title, Text, Portal } from 'react-native-paper';
import { useDispatch, Provider, useStore } from 'react-redux';
import { ipctColors } from 'styles/index';

import ConfirmModal from '../views/community/details/donate/modals/confirm';
import DonateModal from '../views/community/details/donate/modals/donate';
import ErrorModal from '../views/community/details/donate/modals/error';

interface IDonateProps {
    community: CommunityAttributes;
}

export default function DonateCard(props: IDonateProps) {
    const { community } = props;
    const dispatch = useDispatch();

    return (
        <>
            <View style={styles.donateContainer}>
                <Title style={styles.title}>{i18n.t('contributeWith')}</Title>
                <Pressable
                    style={styles.button}
                    onPress={() =>
                        dispatch({
                            type: modalDonateAction.OPEN,
                            payload: community,
                        })
                    }
                >
                    <View style={{ flexDirection: 'row' }}>
                        <Text
                            style={{
                                fontFamily: 'Inter-Regular',
                                fontSize: 16,
                                lineHeight: 28,
                                color: 'white',
                                marginRight: 10,
                            }}
                        >
                            {i18n.t('donateWithCelo')}
                        </Text>
                        <Image
                            source={require('assets/images/celoDolar.png')}
                            width={24}
                            height={24}
                        />
                    </View>
                </Pressable>
                <Text style={styles.description}>{i18n.t('or')}</Text>
                <Pressable
                    style={[
                        styles.button,
                        {
                            backgroundColor: 'transparent',
                            borderColor: ipctColors.borderGray,
                            borderWidth: 1,
                        },
                    ]}
                    onPress={() =>
                        dispatch({
                            type: modalDonateAction.OPEN,
                            payload: community,
                        })
                    }
                >
                    <View>
                        <Text
                            style={{
                                fontFamily: 'Inter-Regular',
                                fontSize: 16,
                                lineHeight: 28,
                                color: ipctColors.blueRibbon,
                            }}
                        >
                            {i18n.t('donateWithESolidar')}
                        </Text>
                    </View>
                </Pressable>
            </View>
            <Portal>
                <Provider store={useStore()}>
                    <DonateModal />
                    <ConfirmModal />
                    <ErrorModal />
                </Provider>
            </Portal>
        </>
    );
}

const styles = StyleSheet.create({
    title: {
        fontFamily: 'Inter-Bold',
        fontSize: 20,
        lineHeight: 32,
        marginBottom: 8,
    },
    description: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: 24,
        letterSpacing: 0,
        marginVertical: 8,
    },
    donateContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 18,
    },
    button: {
        height: 44,
        width: '100%',
        borderRadius: 6,
        backgroundColor: ipctColors.blueRibbon,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
