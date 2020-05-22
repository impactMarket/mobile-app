import React from 'react';
import {
    Text,
} from 'react-native';
import {
    connect,
    ConnectedProps
} from 'react-redux';
import {
    IRootState
} from '../../helpers/types';

import BeneficiaryView from './view/beneficiary';
import CommunityManagerView from './view/communitymanager';


const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};
const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux

function CommunityScreen(props: Props) {

    const contentView = () => {
        if (props.user.community.isBeneficiary) {
            return <BeneficiaryView />
        } else if (props.user.community.isCoordinator) {
            return <CommunityManagerView />;
        } else {
            return (
                <>
                    <Text>Not available!</Text>
                    <Text>Please, contact close communities.</Text>
                </>
            );
        }
    }

    return contentView();
}

export default connector(CommunityScreen);