import { Heading } from '@impact-market/ui-kit';
import i18n from 'assets/i18n';
import Button from 'components/core/Button';
import { CommunityAttributes } from 'helpers/types/models';
import React, { useRef } from 'react';
import { StyleSheet } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';

import DonateModal from '../donate/modals/donate';

interface IDonateProps {
    community: CommunityAttributes;
}

export default function Donate(props: IDonateProps) {
    const modalizeWelcomeRef = useRef<Modalize>(null);

    return (
        <>
            <Button
                modeType="green"
                bold
                style={styles.donate}
                labelStyle={{
                    fontSize: 20,
                    lineHeight: 23,
                    color: 'white',
                }}
                onPress={() => modalizeWelcomeRef.current?.open()}
            >
                {i18n.t('donate.donate')}
            </Button>
            <Portal>
                <Modalize
                    ref={modalizeWelcomeRef}
                    HeaderComponent={<Heading>Hello</Heading>}
                    adjustToContentHeight
                    onClose={() => {}}
                >
                    <DonateModal />
                </Modalize>
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
