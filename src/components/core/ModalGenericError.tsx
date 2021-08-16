import Button from 'components/core/Button';
import CloseStorySvg from 'components/svg/CloseStorySvg';
import WarningRedTriangle from 'components/svg/WarningRedTriangle';
import React from 'react';
import { View, Text } from 'react-native';
import { Card, Portal as RNPortal, Modal } from 'react-native-paper';
import { ipctColors } from 'styles/index';

interface ErrorProps {
    title: string | null;
    description: string | null;
    btnString: string | null;
    closeFn?: React.SetStateAction<any>;
    btnFn?: React.SetStateAction<any>;
}
const ModalGenericError: React.FC<ErrorProps> = ({
    title,
    description,
    btnString,
    closeFn,
    btnFn,
}) => {
    return (
        <RNPortal>
            <Modal visible dismissable={false}>
                <Card
                    style={{
                        display: 'flex',
                        marginHorizontal: 22,
                        borderRadius: 12,
                        paddingHorizontal: 22,
                        paddingVertical: 16,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                            marginBottom: 13.5,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'Manrope-Bold',
                                fontSize: 18,
                                lineHeight: 20,
                                textAlign: 'left',
                            }}
                        >
                            {title}
                        </Text>
                        <CloseStorySvg onPress={closeFn} />
                    </View>
                    <View
                        style={{
                            paddingVertical: 16,
                            paddingHorizontal: 22,
                            borderStyle: 'solid',
                            borderColor: '#EB5757',
                            borderWidth: 2,
                            borderRadius: 8,
                            width: '100%',
                            flexDirection: 'row',
                            marginBottom: 16,
                        }}
                    >
                        <WarningRedTriangle
                            style={{
                                alignSelf: 'flex-start',
                                marginRight: 16,
                                marginTop: 8,
                            }}
                        />
                        <Text
                            style={{
                                fontFamily: 'Inter-Regular',
                                fontSize: 14,
                                lineHeight: 24,
                                color: ipctColors.almostBlack,
                                textAlign: 'left',
                                marginRight: 36,
                            }}
                        >
                            {description}
                        </Text>
                    </View>

                    <Button
                        modeType="gray"
                        bold
                        style={{ width: '100%' }}
                        onPress={btnFn}
                    >
                        {btnString}
                    </Button>
                </Card>
            </Modal>
        </RNPortal>
    );
};

export default ModalGenericError;
