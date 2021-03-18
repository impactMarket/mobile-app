import { Alert } from 'react-native';
import i18n from 'assets/i18n';

import Api from 'services/api';
import { ISubmitEditCommunity } from 'helpers/types/state';

import { validateEmail } from 'helpers/index';
import { CommunityEditAttributes } from 'helpers/types/endpoints';

export const submitEditCommunity = async ({
    setIsNameValid,
    setIsDescriptionValid,
    setIsEmailValid,
    setSending,
    comunityDetails,
}: ISubmitEditCommunity) => {
    const { userAddress, name, description, email } = comunityDetails;

    const _isNameValid = name.length > 0;
    if (!_isNameValid) {
        setIsNameValid(false);
    }
    const _isDescriptionValid = description.length > 0;
    if (!_isDescriptionValid) {
        setIsDescriptionValid(false);
    }

    const _isEmailValid = validateEmail(email);
    if (!_isEmailValid) {
        setIsEmailValid(false);
    }

    const isSubmitAvailable =
        _isNameValid && _isDescriptionValid && _isEmailValid;

    if (!isSubmitAvailable) {
        return;
    }

    //
    setSending(true);

    try {
        const communityDetails: CommunityEditAttributes = {
            requestByAddress: userAddress,
            name,
            description,
            email,
        };

        await Api.community.edit(communityDetails);
    } catch (e) {
        Alert.alert(
            i18n.t('failure'),
            i18n.t('errorEditingCommunity'),
            [{ text: 'OK' }],
            { cancelable: false }
        );
        setSending(false);
        Api.system.uploadError(userAddress, 'create_community', e);
    }
};
