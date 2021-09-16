import i18n from 'assets/i18n';
import React from 'react';
import {
    GooglePlaceData,
    GooglePlaceDetail,
    GooglePlacesAutocomplete,
} from 'react-native-google-places-autocomplete';
import { ipctColors } from 'styles/index';

import config from '../../../../config';

export default function PlaceSearch(props: {
    userLanguage: string;
    onPress?: (data: GooglePlaceData, detail: GooglePlaceDetail) => void;
}) {
    return (
        <GooglePlacesAutocomplete
            placeholder={i18n.t('generic.search')}
            textInputProps={{ autoFocus: true }}
            styles={{
                textInput: {
                    borderWidth: 1,
                    borderColor: ipctColors.softGray,
                },
                container: {},
            }}
            onPress={props.onPress}
            query={{
                key: config.googleApiKey,
                language: props.userLanguage.toLowerCase(),
                type: '(regions)',
            }}
        />
    );
}
