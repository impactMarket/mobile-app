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
                    fontFamily: 'Inter-Regular',
                    fontSize: 18,
                    lineHeight: 20,
                    height: 22,
                    textAlign: 'center',
                    letterSpacing: 0.366667,
                    color: ipctColors.blueRibbon,
                    // marginLeft: 8.4,
                    marginRight: 16,
                }}
                onPress={props.submit}
                loading={props.submitting}
            >
                {i18n.t('generic.submit')}
            </Button>
        </View>
    );
}

export default SubmitStory;
