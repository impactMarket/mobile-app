import { useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import Button from 'components/core/Button';
import Card from 'components/core/Card';
import { Screens } from 'helpers/constants';
import React from 'react';
import { View } from 'react-native';
import { Headline } from 'react-native-paper';

interface IManagersProps {
    managers: number | undefined;
    testID: string | null;
}
function Managers(props: IManagersProps) {
    const navigation = useNavigation();

    const { managers, testID } = props;

    return (
        <View>
            <Card testID={testID} style={{ marginTop: 16 }}>
                <Card.Content>
                    <Headline
                        style={{
                            opacity: 0.48,
                            fontFamily: 'Gelion-Bold',
                            fontSize: 13,
                            fontWeight: '500',
                            lineHeight: 12,
                            letterSpacing: 0.7,
                        }}
                    >
                        {i18n.t('managers').toUpperCase()}
                    </Headline>
                    <Button
                        modeType="gray"
                        bold
                        disabled={managers === 0}
                        style={{ marginVertical: 5 }}
                        onPress={() =>
                            navigation.navigate(Screens.AddedManager)
                        }
                    >
                        {i18n.t('added')} ({managers})
                    </Button>
                    <Button
                        modeType="green"
                        bold
                        style={{
                            marginVertical: 5,
                        }}
                        onPress={() => navigation.navigate(Screens.AddManager)}
                    >
                        {i18n.t('addManager')}
                    </Button>
                </Card.Content>
            </Card>
        </View>
    );
}

export default Managers;
