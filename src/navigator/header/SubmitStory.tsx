import i18n from 'assets/i18n';
import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { ipctColors } from 'styles/index';

function SubmitStory(props: {
    submit: () => void;
    submitting: boolean;
    disabled: boolean;
}) {
    return (
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <Button
                mode="text"
                disabled={props.disabled}
                uppercase={false}
                labelStyle={{
                    fontFamily: 'Gelion-Bold',
                    fontSize: 22,
                    lineHeight: 26,
                    height: 26,
                    textAlign: 'center',
                    letterSpacing: 0.366667,
                    color: ipctColors.blueRibbon,
                    // marginLeft: 8.4,
                    marginRight: 16,
                }}
                onPress={props.submit}
                loading={props.submitting}
            >
                {i18n.t('submit')}
            </Button>
        </View>
    );
}

export default SubmitStory;
