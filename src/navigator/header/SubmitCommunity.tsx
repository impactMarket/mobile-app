import i18n from 'assets/i18n';
import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { ipctColors } from 'styles/index';

function SubmitCommunity(props: { submit: () => void; submitting: boolean }) {
    return (
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <Button
                mode="text"
                uppercase={false}
                labelStyle={{
                    fontFamily: 'Inter-Regular',
                    fontSize: 18,
                    lineHeight: 26,
                    height: 26,
                    textAlign: 'center',
                    letterSpacing: 0.366667,
                    color: ipctColors.blueRibbon,
                    // marginLeft: 8.4,
                    marginRight: 16,
                }}
                accessibilityLabel={i18n.t('generic.submit')}
                onPress={props.submit}
                loading={props.submitting}
                disabled={props.submitting}
                testID="submit-community-button"
            >
                {i18n.t('generic.submit')}
            </Button>
        </View>
    );
}

export default SubmitCommunity;
