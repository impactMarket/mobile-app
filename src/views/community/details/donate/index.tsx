import i18n from 'assets/i18n';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Portal } from 'react-native-paper';

import {
    useDispatch,
    Provider,
    useStore,
} from 'react-redux';
import Button from 'components/core/Button';
import { ICommunity } from 'helpers/types/endpoints';
import DonateModal from '../donate/modals/donate';
import ConfirmModal from '../donate/modals/confirm';
import ErrorModal from '../donate/modals/error';
import { modalDonateAction } from 'helpers/constants';

interface IDonateProps {
    community: ICommunity;
}

export default function Donate(props: IDonateProps) {
    const dispatch = useDispatch();
    return (
        <>
            <Button
                modeType="green"
                bold={true}
                style={styles.donate}
                labelStyle={{
                    fontSize: 20,
                    lineHeight: 23,
                    color: 'white',
                }}
                onPress={() =>
                    dispatch({
                        type: modalDonateAction.OPEN,
                        payload: props.community,
                    })
                }
            >
                {i18n.t('donate')}
            </Button>
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
    donate: {
        borderRadius: 0,
        height: 69,
    },
    donateLabel: {
        fontSize: 16,
        lineHeight: 19,
        letterSpacing: 0.3,
    },
});
