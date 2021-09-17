import i18n from 'assets/i18n';
import React, {
    forwardRef,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import { View, Text, TextInput, ScrollView, Pressable } from 'react-native';
import {
    GooglePlaceData,
    GooglePlaceDetail,
    GooglePlacesAutocompleteProps,
} from 'react-native-google-places-autocomplete';
import { ipctColors } from 'styles/index';

const MockGooglePlacesAutocomplete = forwardRef(
    (props: GooglePlacesAutocompleteProps, ref: any) => {
        const [place, setPlace] = useState('');

        const handleChangeText = (text: string) => {
            setPlace(text);
        };

        const inputRef = useRef<any>();

        useImperativeHandle(ref, () => ({
            blur: () => inputRef.current.blur(),
            focus: () => inputRef.current.focus(),
            isFocused: () => inputRef.current.isFocused(),
            clear: () => inputRef.current.clear(),
        }));
        return (
            <View style={{ flexDirection: 'column' }}>
                <TextInput
                    ref={inputRef}
                    placeholder={i18n.t('generic.search')}
                    autoFocus
                    onChangeText={handleChangeText}
                    value={place}
                    style={{
                        // flex: 1,
                        height: 25,
                        borderWidth: 1,
                        borderColor: ipctColors.softGray,
                    }}
                />
                <ScrollView
                    style={{
                        height: 50,
                        backgroundColor: 'red',
                    }}
                >
                    <Pressable
                        testID="select-place"
                        onPress={(_) =>
                            props.onPress(
                                {
                                    id: '1',
                                    description: 'Beja, Portugal',
                                    matched_substrings: [
                                        { length: 1, offset: 1 },
                                    ],
                                    place_id: 'xyz123',
                                    reference: 'xyz123',
                                    structured_formatting: '' as any,
                                } as GooglePlaceData,
                                null
                            )
                        }
                    >
                        <Text>Beja, Portugal</Text>
                    </Pressable>
                </ScrollView>
            </View>
        );
    }
);

const PlacesSearch = (props: {
    userLanguage: string;
    onPress?: (data: GooglePlaceData, detail: GooglePlaceDetail) => void;
}) => {
    return (
        <MockGooglePlacesAutocomplete
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
                key: 'xyz',
                language: props.userLanguage.toLowerCase(),
                type: '(regions)',
            }}
        />
    );
};

export default PlacesSearch;
