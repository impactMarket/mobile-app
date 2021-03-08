import { useNavigation } from '@react-navigation/native';
import { Screens } from 'helpers/constants';
import * as React from 'react';
import Svg, {
    SvgProps,
    Circle,
    G,
    Path,
    Defs,
    ClipPath,
} from 'react-native-svg';

import ReportCard from './ReportCard';

function ReportSvg(props: { isLink: boolean }) {
    const [openModal, setOpenModal] = React.useState(false);

    function toggleModal() {
        setOpenModal(!openModal);
    }

    return (
        <>
            {props.isLink ? (
                <Svg
                    onPress={toggleModal}
                    width={34}
                    height={34}
                    viewBox="0 0 34 34"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    {...props}
                >
                    <Circle cx={17.2} cy={17} r={16.8} fill="#EAEDF0" />
                    <G clipPath="url(#prefix__clip0)" fill="#172B4D">
                        <Path d="M24.635 15.414l-1.484-.344.473-1.481-.034-.012a14.48 14.48 0 00-1.886-.48A4.342 4.342 0 0117.4 16.91a4.343 4.343 0 01-4.292-3.723c-.675.142-1.311.318-1.892.528l.433 1.356-1.485.344L7.4 20.51v3.102h3.294V18.38h13.412v5.232H27.4v-3.13l-2.765-5.068zM22.282 9.386a5.38 5.38 0 00-3.834-3.035 5.338 5.338 0 00-2.096 0 5.379 5.379 0 00-3.834 3.035l-1.427 3.13c1.744-.584 3.956-.919 6.273-.944 2.302-.026 4.514.255 6.276.792l-1.358-2.978z" />
                        <Path d="M14.263 12.98a3.168 3.168 0 003.137 2.757 3.168 3.168 0 003.145-2.82 23.932 23.932 0 00-6.282.064zM11.866 26.153h11.068v-6.601H11.866v6.601zm5.534-4.13l.829.83-.829.828-.829-.829.83-.828z" />
                    </G>
                    <Defs>
                        <ClipPath id="prefix__clip0">
                            <Path
                                fill="#fff"
                                transform="translate(7.4 6.2)"
                                d="M0 0h20v20H0z"
                            />
                        </ClipPath>
                    </Defs>
                </Svg>
            ) : (
                <Svg
                    width={54}
                    height={54}
                    viewBox={'0 0 54 54'}
                    fill="none"
                    {...props}
                >
                    <G clipPath="url(#prefix__clip0)">
                        <Path
                            d="M46.535 24.877l-4.006-.928 1.275-4-.093-.03a39.102 39.102 0 00-5.09-1.295c-.702 5.789-5.646 10.289-11.62 10.289-5.894 0-10.783-4.377-11.59-10.05-1.821.383-3.54.858-5.107 1.424l1.167 3.662-4.008.928L0 38.637v8.375h8.895V32.886h36.21v14.126H54v-8.449l-7.465-13.686zM40.18 8.603A14.523 14.523 0 0029.83.407a14.413 14.413 0 00-5.66 0 14.523 14.523 0 00-10.35 8.196l-3.856 8.452c4.71-1.58 10.682-2.483 16.94-2.552 6.213-.068 12.185.689 16.943 2.14l-3.666-8.04z"
                            fill="#172B4D"
                        />
                        <Path
                            d="M18.53 18.308c.543 4.192 4.133 7.441 8.47 7.441 4.397 0 8.027-3.34 8.492-7.614-5.476-.69-11.515-.628-16.961.173z"
                            fill="#172B4D"
                        />
                        <Path
                            d="M12.059 53.874H41.94V36.05H12.06v17.824zM27 42.724l2.237 2.238L27 47.199l-2.237-2.237L27 42.724z"
                            fill={props.isLink ? '#172B4D' : '#5E72E4'}
                        />
                    </G>
                    <Defs>
                        <ClipPath id="prefix__clip0">
                            <Path fill="#fff" d="M0 0h54v54H0z" />
                        </ClipPath>
                    </Defs>
                </Svg>
            )}

            {openModal && <ReportCard setOpenModal={setOpenModal} />}
        </>
    );
}

export default ReportSvg;
