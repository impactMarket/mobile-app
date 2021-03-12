import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';
import { useSelector } from 'react-redux';

import { IRootState } from 'helpers/types/state';
import FAQSvg from 'components/svg/header/FaqSvg';
import ThreeDotsSvg from 'components/svg/header/ThreeDotsSvg';
import Button from 'components/core/Button';
import { Screens } from 'helpers/constants';
import i18n from 'assets/i18n';

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
            }}
        >
            <FAQSvg />
            <ThreeDotsSvg
                setOpenThreeDotsMenu={setOpenThreeDotsMenu}
                openThreeDotsMenu={openThreeDotsMenu}
                style={{ marginLeft: 8.4, marginRight: 16 }}
            >
                <Button
                    modeType="gray"
                    bold
                    style={{ marginVertical: 10, width: '100%' }}
                    onPress={() => {
                        setOpenThreeDotsMenu(false);
                        navigation.navigate(Screens.CommunityDetails, {
                            communityId: community.publicId,
                        });
                    }}
                >
                    {i18n.t('viewAsPublic')}
                </Button>
            </ThreeDotsSvg>
        </View>
    );
}

export default CommunityManager;
