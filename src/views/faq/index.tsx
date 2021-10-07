import renderHeader from 'components/core/HeaderBottomSheetTitle';
import { docsURL } from 'helpers/index';
import { setOpenFaqModal } from 'helpers/redux/actions/app';
import { IRootState } from 'helpers/types/state';
import React, { useEffect, useRef } from 'react';
import { Dimensions } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { WebView } from 'react-native-webview';
import { useDispatch, useSelector } from 'react-redux';

function FAQ() {
    const dispatch = useDispatch();
    const { faqModalOpen } = useSelector((state: IRootState) => state.app);
    const { language } = useSelector(
        (state: IRootState) => state.user.metadata
    );
    const modalizeFaqRef = useRef<Modalize>(null);

    useEffect(() => {
        if (modalizeFaqRef.current !== null) {
            if (faqModalOpen) {
                modalizeFaqRef.current.open();
            } else {
                modalizeFaqRef.current.close();
            }
        }
    }, [faqModalOpen]);

    return (
        <Portal>
            <Modalize
                ref={modalizeFaqRef}
                HeaderComponent={renderHeader(
                    null,
                    modalizeFaqRef,
                    () => {
                        dispatch(setOpenFaqModal(false));
                    },
                    true
                )}
                adjustToContentHeight
            >
                <WebView
                    originWhitelist={['*']}
                    source={{
                        uri: docsURL(
                            '/general/difficulties-getting-your-ubi',
                            language
                        ),
                    }}
                    style={{
                        height: Dimensions.get('screen').height * 0.85,
                    }}
                />
            </Modalize>
        </Portal>
    );
}

export default FAQ;
