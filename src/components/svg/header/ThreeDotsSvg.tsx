import * as React from 'react';
import { useState } from 'react';
import Svg, { SvgProps, Circle, Path } from 'react-native-svg';
import { BottomSheet } from 'react-native-btr';
import Button from 'components/core/Button';
import Card from 'components/core/Card';
import { useNavigation } from '@react-navigation/native';
import { Screens } from 'helpers/constants';
import i18n from 'assets/i18n';
import { useSelector } from 'react-redux';
import { IRootState } from 'helpers/types/state';

function ThreeDotsSvg(props: SvgProps) {
    const navigation = useNavigation();
    const community = useSelector(
        (state: IRootState) => state.user.community.metadata
    );
    const [openThreeDotsMenu, setOpenThreeDotsMenu] = useState(false);

    const toggleThreeDotsMenu = () => setOpenThreeDotsMenu(!openThreeDotsMenu);

    return (
        <>
            <Svg
                width={34}
                height={34}
                viewBox="0 0 34 34"
                fill="none"
                onPress={() => setOpenThreeDotsMenu(true)}
                {...props}
            >
                <Circle cx={16.8} cy={16.8} r={16.8} fill="#EAEDF0" />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.49 18.951c.655 0 1.233-.249 1.736-.747.503-.498.754-1.07.754-1.714 0-.664-.249-1.245-.747-1.743S10.154 14 9.49 14c-.683 0-1.27.249-1.758.747S7 15.827 7 16.49c0 .655.244 1.228.732 1.721.489.494 1.075.74 1.758.74zm7.617 0c.635 0 1.204-.249 1.707-.747.503-.498.754-1.07.754-1.714 0-.664-.249-1.245-.747-1.743S17.752 14 17.107 14c-.683 0-1.27.249-1.757.747-.489.498-.733 1.08-.733 1.743 0 .655.244 1.228.733 1.721.488.494 1.074.74 1.757.74zm9.31-.747c-.513.498-1.107.747-1.78.747-.664 0-1.24-.246-1.729-.74-.488-.493-.732-1.066-.732-1.72 0-.665.244-1.246.732-1.744S23.973 14 24.637 14c.683 0 1.279.249 1.787.747s.762 1.08.762 1.743c0 .645-.257 1.216-.77 1.714z"
                    fill="#161515"
                />
            </Svg>
            <BottomSheet
                visible={openThreeDotsMenu}
                onBackButtonPress={toggleThreeDotsMenu}
                onBackdropPress={toggleThreeDotsMenu}
            >
                <Card
                    style={{
                        borderBottomEndRadius: 0,
                        borderBottomStartRadius: 0,
                    }}
                >
                    <Card.Content>
                        <Button
                            modeType="gray"
                            bold={true}
                            disabled={true}
                            style={{ marginVertical: 10 }}
                            onPress={() => {
                                setOpenThreeDotsMenu(false);
                                navigation.navigate(Screens.CreateCommunity, {
                                    community,
                                });
                            }}
                        >
                            {i18n.t('editCommunityDetails')}
                        </Button>
                        <Button
                            modeType="gray"
                            bold={true}
                            style={{ marginVertical: 10 }}
                            onPress={() => {
                                setOpenThreeDotsMenu(false);
                                navigation.navigate(Screens.CommunityDetails, {
                                    community,
                                });
                            }}
                        >
                            {i18n.t('viewAsPublic')}
                        </Button>
                    </Card.Content>
                </Card>
            </BottomSheet>
        </>
    );
}

export default ThreeDotsSvg;
