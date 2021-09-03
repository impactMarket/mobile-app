import i18n from 'assets/i18n';
import Button from 'components/core/Button';
import CloseStorySvg from 'components/svg/CloseStorySvg';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Portal as RNPortal, Modal } from 'react-native-paper';
import { ipctColors } from 'styles/index';

interface ErrorProps {
    trigger: boolean;
    handleCloseModal?: React.SetStateAction<any>;
}
const ModalValoraTimeoutError: React.FC<ErrorProps> = ({
    trigger,
    handleCloseModal,
}) => {
    return (
        <RNPortal>
            <Modal visible={trigger} dismissable={false}>
                <Card style={styles.timedOutCard}>
                    <View style={styles.timedOutCardContent}>
                        <Text style={styles.timedOutCardText}>
                            {i18n.t('errors.modals.valora.title')}
                        </Text>
                        <CloseStorySvg onPress={() => handleCloseModal()} />
                    </View>
                    <View style={styles.timedOutCardDescriptionContainer}>
                        <Text style={styles.timedOutCardDescription}>
                            {i18n.t('errors.modals.valora.description')}
                        </Text>
                    </View>
                    <View style={styles.timedOutCardButtons}>
                        <Button
                            modeType="gray"
                            style={{ flex: 1, marginRight: 5 }}
                            onPress={() => handleCloseModal()}
                        >
                            {i18n.t('generic.close')}
                        </Button>
                        <Button
                            modeType="default"
                            style={{ flex: 1, marginLeft: 5 }}
                            onPress={() => {
                                // modalizeHelpCenterRef.current?.open();
                                // setTimedOut(false);
                            }}
                        >
                            {i18n.t('generic.faq')}
                        </Button>
                    </View>
                </Card>
            </Modal>
        </RNPortal>
    );
};

export default ModalValoraTimeoutError;

const styles = StyleSheet.create({
    timedOutCard: {
        marginHorizontal: 22,
        borderRadius: 12,
        paddingHorizontal: 22,
        paddingVertical: 16,
    },
    timedOutCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 13.5,
    },
    timedOutCardText: {
        fontFamily: 'Manrope-Bold',
        fontSize: 18,
        lineHeight: 20,
        textAlign: 'left',
    },
    timedOutCardButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    timedOutCardDescription: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        lineHeight: 24,
        color: ipctColors.almostBlack,
    },
    timedOutCardDescriptionContainer: {
        width: '100%',
        flexDirection: 'row',
        marginBottom: 16,
    },
});
