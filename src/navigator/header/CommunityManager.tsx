import { useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import Button from 'components/core/Button';
import ProfileSvg from 'components/svg/ProfileSvg';
import FAQSvg from 'components/svg/header/FaqSvg';
import ThreeDotsSvg from 'components/svg/header/ThreeDotsSvg';
import { Screens } from 'helpers/constants';
import { IRootState } from 'helpers/types/state';
import React, { useState } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';

function CommunityManager() {
    const navigation = useNavigation();
    const [openThreeDotsMenu, setOpenThreeDotsMenu] = useState(false);

    const community = useSelector(
        (state: IRootState) => state.user.community.metadata
    );
    return (
        <View
            style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                marginRight: community.status !== 'valid' ? 22 : 0,
            }}
        >
            <FAQSvg />
            <ProfileSvg />
            {community.status === 'valid' && (
                <ThreeDotsSvg
                    setOpenThreeDotsMenu={setOpenThreeDotsMenu}
                    openThreeDotsMenu={openThreeDotsMenu}
                    style={{ marginRight: 16, marginLeft: 10 }}
                    hasCloseBtn={false}
                >
                    <>
                        <Button
                            modeType="gray"
                            bold
                            style={{ marginVertical: 10, width: '100%' }}
                            onPress={() => {
                                setOpenThreeDotsMenu(false);
                                navigation.navigate(Screens.CommunityDetails, {
                                    communityId: community.id,
                                });
                            }}
                        >
                            {i18n.t('manager.viewAsPublic')}
                        </Button>
                        <Button
                            modeType="gray"
                            bold
                            style={{ marginVertical: 10, width: '100%' }}
                            onPress={() => {
                                setOpenThreeDotsMenu(false);
                                navigation.navigate(Screens.EditCommunity);
                            }}
                        >
                            {i18n.t('manager.editCommunityDetails')}
                        </Button>
                    </>
                </ThreeDotsSvg>
            )}
        </View>
    );
}

export default CommunityManager;
