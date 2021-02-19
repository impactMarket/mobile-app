import * as React from 'react';
import Svg, {
    SvgProps,
    Path,
    Mask,
    G,
    Defs,
    LinearGradient,
    Stop,
} from 'react-native-svg';
import { ipctColors } from 'styles/index';

function DiversitySvg(props: SvgProps) {
    return (
        <Svg
            width={375}
            height={136}
            viewBox="0 0 375 136"
            fill="none"
            {...props}
        >
            <Path fill="#fff" d="M0 0h375v136H0z" />
            <Mask
                id="prefix__a"
                // maskUnits={EMaskUnits.USER_SPACE_ON_USE}
                x={0}
                y={0}
                width={375}
                height={136}
            >
                <Path fill="#fff" d="M0 0h375v136H0z" />
            </Mask>
            <G mask="url(#prefix__a)">
                <Path
                    opacity={0.059}
                    d="M459.375 90.987c-8.093 11.919-24.384 20.45-42.078 25.356-9.135 2.457-18.608 4.262-28.273 5.387-9.072 1.125-18.326 1.867-27.524 2.494a1987.84 1987.84 0 01-44.24 2.56c-2.043.109-4.047.218-6.09.306-25.449 1.151-50.898 1.866-76.41 2.303h-.181c-1.665 0-3.361.065-5.025.087-24.098.364-48.206.537-72.324.519-16.419 0-32.82-.037-49.202-.109-11.928-.044-23.855-.088-35.807-.322-24.573-.503-49.076-1.763-72.986-5.256-4.678-.65-9.325-1.436-13.963-2.282-12.867-2.363-25.796-5.599-35.965-11.592-10.168-5.992-17.19-15.205-15.312-24.336 1.728-8.421 10.524-15.429 20.463-20.428 9.94-5 21.3-8.553 31.374-13.394 19.304-9.185 33.456-22.666 51.781-32.746C52.168 11.5 63.723 5.071 82.703 7.833c17.892 2.603 33.236 11.22 51.277 13.677 23.666 3.209 46.41-6.473 69.421-11.51 29.189-6.277 69.345-5.137 97.427 3.214 26.262 7.903 48.666 21.907 76.465 26.683 25.67 4.404 56.484 1.32 75.125 14.283 13.387 9.343 15.122 24.865 6.957 36.807z"
                    fill="#2643E9"
                />
                <Path
                    d="M160 135.818c-3.753.278-7.229.146-11 .177.222-2.986 1.165-16.28 1.38-19.266.093-1.262.253-2.676 1.202-3.497a4.154 4.154 0 011.972-.801c1.448-.278 3.352-.632 4.813-.291 1.232.291 1.189 1.395 1.232 2.487.191 3.573-.363 17.707.401 21.191z"
                    fill="url(#prefix__paint0_linear)"
                />
                <Path
                    d="M104.368 114L104 134.528l10 .472s-.152-15.97-3.34-18.288a15.194 15.194 0 00-6.292-2.712z"
                    fill="url(#prefix__paint1_linear)"
                />
                <Path
                    d="M116.328 61.105c-1.377 3.896-1.258 8.119-1.195 12.236.203 6.703.024 13.413-.534 20.097-.346 3.589-.874 7.202-.428 10.773.447 3.571 2.025 7.203 5.03 9.218 2.15 1.439 4.803 1.955 7.393 2.225 2.647.248 5.306.357 7.965.326 2.853.099 5.706-.17 8.487-.799 2.754-.725 5.4-2.176 7.035-4.456 1.509-2.108 2.043-4.726 2.452-7.27a114.7 114.7 0 00.063-36.18 17.547 17.547 0 00-1.182-4.56c-.918-2.028-2.515-3.687-4.08-5.291-1.566-1.604-3.332-3.405-5.501-4.302a15.72 15.72 0 00-5.47-1.027c-8.198-.43-16.968.27-20.035 9.01z"
                    fill="#FFE368"
                />
                <Path
                    d="M148.431 89.21l-.824 1.708a14.658 14.658 0 01-.209-4.404l.295-5.444c.229-2.375.159-4.77-.209-7.128-.473-2.34-1.605-4.638-3.567-6.051-2.515-1.805-5.885-1.907-9.015-1.89-2.891 0-5.996.133-8.309 1.805a13.545 13.545 0 00-3.075 3.567 14.894 14.894 0 00-2.3 4.422 13.636 13.636 0 00-.338 3.356c-.092 5.763.209 11.634-1.396 17.187-.529 1.804-1.23 3.609-1.457 5.51-.068.325-.006.662.172.944.203.194.463.32.744.361 2.231.496 4.49.866 6.765 1.107l12.146 1.528a13.58 13.58 0 004.065.108c.928-.156 1.845-.511 2.749-.674 3.074-.547 4.716-2.147 4.255-5.245a67.987 67.987 0 01-.492-10.768z"
                    fill="url(#prefix__paint2_linear)"
                />
                <Path
                    d="M117.606 99.253c-7.221 1.959-13.038 7.269-15.606 14.247 3.945 2.478 8.315 5.631 8.633 10.258.044.576.063 11.311.531 11.645.294.167.63.247.968.229 12.397.508 24.797.49 37.198-.055.075-2.478.144-15.059.213-17.555a2.239 2.239 0 01.206-1.053c.248-.352.595-.624.998-.78a56.093 56.093 0 018.253-3.37 35.258 35.258 0 00-4.638-8.424c-1.786-2.404-11.187-7.576-26.724-7.39-3.515.037-6.636 1.356-10.032 2.248zM99 136c-19.528-.575-38.999-2.018-58-6.016.47-3.124.57-6.285 1.047-9.372.627-4.023 2.144-8.171 5.41-10.62 3.567-2.637 8.206-2.712 12.243-4.224 4.238-1.568 9.403-.299 13.892 0 5.61.369 11.541.869 16.08 4.149 3.134 2.261 5.316 5.691 6.657 9.321 1.342 3.63 1.881 7.497 2.32 11.352.05.237.3 3.467.351 5.41z"
                    fill={ipctColors.blueRibbon}
                />
                <Path
                    d="M62.275 101.31a17.692 17.692 0 01-10.286-2.548 11.438 11.438 0 01-2.168-1.667 17.45 17.45 0 01-2.006-2.604l-3.727-5.538a12.055 12.055 0 01-1.92-3.693 4.059 4.059 0 01.901-3.901c-.969-3.644-1.453-8.18.386-11.478 1.155-2.08 3.242-3.483 4.776-5.31 1.814-2.173 2.969-5.047 5.472-6.389 2.74-1.464 6.081-.572 9.187-.369 5.528.35 11.143-1.63 16.547-.412a10.57 10.57 0 013.64 1.514c2.633 1.797 3.981 4.923 6.093 7.292 2.112 2.37 5.13 4.308 5.727 7.385.621 3.268-1.752 6.339-2.15 9.644-.229 1.877.2 3.79-.105 5.655-.54 3.299-3.379 5.933-6.602 6.893-2.038.615-4.348.714-5.908 2.16-1.291 1.23-1.863 3.274-3.552 3.871a5.224 5.224 0 01-2.056.141c-3.87-.246-8.367-.892-12.25-.646z"
                    fill="#606161"
                />
                <Path
                    d="M62.275 101.31a17.692 17.692 0 01-10.286-2.548 11.438 11.438 0 01-2.168-1.667 17.45 17.45 0 01-2.006-2.604l-3.727-5.538a12.055 12.055 0 01-1.92-3.693 4.059 4.059 0 01.901-3.901c-.969-3.644-1.453-8.18.386-11.478 1.155-2.08 3.242-3.483 4.776-5.31 1.814-2.173 2.969-5.047 5.472-6.389 2.74-1.464 6.081-.572 9.187-.369 5.528.35 11.143-1.63 16.547-.412a10.57 10.57 0 013.64 1.514c2.633 1.797 3.981 4.923 6.093 7.292 2.112 2.37 5.13 4.308 5.727 7.385.621 3.268-1.752 6.339-2.15 9.644-.229 1.877.2 3.79-.105 5.655-.54 3.299-3.379 5.933-6.602 6.893-2.038.615-4.348.714-5.908 2.16-1.291 1.23-1.863 3.274-3.552 3.871a5.224 5.224 0 01-2.056.141c-3.87-.246-8.367-.892-12.25-.646z"
                    fill="url(#prefix__paint3_linear)"
                />
                <Path
                    d="M62.844 103.662a7.878 7.878 0 00-.818 2.191 4.41 4.41 0 00.57 2.689 6.94 6.94 0 005.612 3.451 8.778 8.778 0 006.282-2.303 4.243 4.243 0 001.488-2.309 6.216 6.216 0 00-.26-2.378 20.92 20.92 0 01-.522-4.892c0-1.242.124-2.613-.508-3.725-.713-1.241-2.164-1.775-3.54-2.048-1.93-.373-5.489-.95-6.146 1.515-.72 2.688-.955 5.251-2.158 7.809z"
                    fill="#775339"
                />
                <Path
                    d="M63.029 103.785c.025.134.065.264.118.387a7.288 7.288 0 001.427 1.97c.736.644 1.663.944 2.59.837 1.616-.143 3.132-.937 4.27-2.237 1.782-1.964 3.45-5.563 2.035-8.306-.646-1.268-1.961-1.813-3.209-2.091-1.747-.38-4.973-.97-5.568 1.546-.489 2.046-.747 4.156-1.337 6.171-.197.691-.439 1.134-.326 1.723z"
                    fill="url(#prefix__paint4_linear)"
                />
                <Path
                    d="M57.419 82.22c-.679-.306-1.662-.361-2.097.285-.131.23-.214.485-.244.75-.394 2.528.72 5.356 2.938 6.537.218.138.47.21.726.208.597-.056.909-.743 1.031-1.34.55-2.564.224-5.357-2.354-6.44zM80.946 83.164c.244-.368.563-.689.94-.945.387-.258.9-.29 1.323-.085.376.302.606.73.64 1.188.171.86.306 1.83-.234 2.56-.292.36-.676.648-1.118.84a1.918 1.918 0 01-1.366.242 1.623 1.623 0 01-.89-.866A1.775 1.775 0 0180 85.33a4.578 4.578 0 01.946-2.166z"
                    fill="#775339"
                />
                <Path
                    d="M59.201 90.804c1.728 3.542 4.442 6.974 8.29 7.944 3.848.97 8.23-.964 10.766-4.105 2.537-3.141 3.548-7.277 3.72-11.28.195-4.554-.797-9.514-4.247-12.54a12.286 12.286 0 00-8.315-2.814 19.03 19.03 0 00-8.578 2.498c-7.616 4.112-4.7 14.02-1.636 20.297z"
                    fill="#775339"
                />
                <Path
                    d="M56.494 81.933s-2.926-7.347 5.46-13.595c8.388-6.247 17.613 1.392 19.015 6.94 1.402 5.55.967 6.722.967 6.722s-2.834-9.438-10.45-9.578c-7.615-.14-11.686 3.185-14.992 9.511z"
                    fill={ipctColors.blueRibbon}
                />
                <Path
                    d="M55.735 85.358c0-.264.096-.539 0-.792s-.365-.539-.836-.566c-.384.012-.712.16-.818.367a.632.632 0 000 .62c.235.5.557.988.962 1.455.183.22.394.474.817.539.318.05.66 0 .889-.134.23-.133.31-.326.208-.502-.183-.356-1.145-.415-1.222-.987z"
                    fill="url(#prefix__paint5_linear)"
                />
                <Path
                    d="M82.506 84.945a.943.943 0 010-.613c.1-.172.25-.29.417-.332.06.174.085.362.075.55v1.263c.007.19-.013.381-.058.564a.91.91 0 01-.429.572c-.165.091-.406.07-.48-.142-.132-.366.189-.656.372-.853.269-.303.217-.578.103-1.009z"
                    fill="url(#prefix__paint6_linear)"
                />
                <Path
                    d="M125.993 94.334c-1.168 2.672-2.475 5.556-1.816 8.409.708 3.114 3.8 5.263 6.886 5.257 3.086-.006 5.99-1.943 7.66-4.616a7.075 7.075 0 001.21-5.032c-.248-1.246-.944-2.318-1.21-3.532-.605-2.535.605-5.338-.333-7.761-.756-1.975-2.753-3.152-4.744-3.738a6.501 6.501 0 00-3.63-.118c-2.208.691-2.553 2.336-2.42 4.36.097 2.404-.666 4.616-1.603 6.77z"
                    fill="url(#prefix__paint7_linear)"
                />
                <Path
                    d="M128.941 95.207c.846 1.284 2.108 2.202 3.551 2.583 1.473.5 3.089.094 4.188-1.052 1.476-1.396 2.318-3.384 2.317-5.469a3.148 3.148 0 00-.58-1.975 2.91 2.91 0 00-1.262-.796c-2.566-.913-5.388-.558-7.675.966-1.999 1.307-1.761 3.817-.539 5.743z"
                    fill="url(#prefix__paint8_linear)"
                />
                <Path
                    d="M122.693 85.62c1.692 3.14 4.218 5.911 7.429 6.96 3.765 1.144 7.819-.093 10.425-3.179a18.827 18.827 0 002.639-4.586c1.561-3.562 2.752-7.389 2.812-11.31.059-3.92-1.12-7.972-3.723-10.642-1.944-1.874-4.365-3.108-6.964-3.55-3.384-.666-7.024-.32-10.044 1.527-1.863 1.138-3.379 2.814-4.367 4.831-.983 2.03-.804 3.632-.87 5.774-.161 5.07.262 9.7 2.663 14.174z"
                    fill="url(#prefix__paint9_linear)"
                />
                <Path
                    d="M118.005 72.057a.98.98 0 00.126.59c.261.262.64.39 1.018.344 2.07.032 4.141-.062 6.198-.284.302-1.173.466-2.374.49-3.581a9.633 9.633 0 01.741 3.18 84.022 84.022 0 019.289-.25 6.294 6.294 0 01-.289-3.332 7.7 7.7 0 00.905 3.014c.085.2.228.375.414.502.391.148.832.129 1.206-.053a15.388 15.388 0 016.72-.544l.12-1.395c.457.76.83 1.562 1.111 2.394a4.034 4.034 0 012.946-.626l-.86-4.847c-.114-2.44-1.495-4.671-3.693-5.969a24.978 24.978 0 00-4.296-2.843 15.258 15.258 0 00-8.605-1.182 21.334 21.334 0 00-8.164 3.056 8.215 8.215 0 00-2.381 1.997c-.628.828-.628 1.738-1.036 2.625-1.055 2.393-1.96 4.556-1.96 7.204z"
                    fill="#FFE368"
                />
                <Path
                    d="M286.935 133.329c-19.855 1.335-39.734 2.165-59.638 2.671a.423.423 0 01-.166-.177 1.29 1.29 0 01-.123-.557 60.38 60.38 0 01.683-10.071c.344-2.165.806-4.381 1.957-6.216 1.151-1.836 3.551-4.134 5.853-4.254 2.4-.101 4.923.5 7.385.475 2.942 0 5.878-.279 8.814-.576 5.779-.583 11.509-1.513 17.313-1.868 2.344-.126 4.745-.202 6.973-1.031 1.052-.399 2.178-.981 3.255-.602.426.169.823.406 1.176.703 1.496 1.184 3.01 2.367 3.988 4.007 1.126 1.861 1.471 4.076 1.767 6.241.516 3.728 1.009 7.501.763 11.255z"
                    fill={ipctColors.blueRibbon}
                />
                <Path
                    d="M287.945 133.323c-19.857 1.338-39.714 2.17-59.621 2.677h-.142s-.049 0-.074-.076a1.116 1.116 0 01-.098-.558 60.739 60.739 0 01.659-10.093c.344-2.195.806-4.39 1.982-6.255 1.175-1.865 3.527-4.142 5.829-4.244 2.4-.12 4.924.482 7.386.457 2.943 0 5.879-.254 8.815-.552 5.78-.634 11.535-1.516 17.315-1.903 2.345-.152 4.771-.203 6.974-1.034 1.053-.406 2.204-.983 3.256-.634.427.178.824.424 1.176.729 1.496 1.161 3.01 2.373 3.995 4.009 1.12 1.846 1.465 4.067 1.785 6.236.493 3.749.985 7.505.763 11.241z"
                    fill="url(#prefix__paint10_linear)"
                />
                <Path
                    d="M244.35 70.025c-6.831 8.335-9.12 19.536-6.111 29.91.684 2.279 1.635 4.652 1.076 6.969-.665 2.761-3.251 4.551-4.917 6.849a1.608 1.608 0 00-.398 1.071c.056.501.535.833.982 1.058a9.943 9.943 0 003.842 1.058c1.199.082 2.436-.056 3.574.338.925.393 1.782.93 2.542 1.591 3.568 2.679 7.758 4.383 11.891 6.029 1.48.595 3.021 1.196 4.612 1.09a8.538 8.538 0 003.519-1.202 22.095 22.095 0 009.715-10.97c.147-.541.463-1.02.901-1.365.759-.451 1.772 0 2.58-.332 1.374-.595.895-2.767-.211-3.757-1.107-.989-2.667-1.659-3.208-3.055-.665-1.728.553-3.538 1.287-5.234 1.367-3.162 1.082-6.769.727-10.2-.777-7.47-2.101-15.565-7.608-20.624-2.225-2.035-4.973-3.4-7.726-4.596-2.891-1.252-6.583-2.504-9.567-.883a27.451 27.451 0 00-7.502 6.255z"
                    fill={ipctColors.blueRibbon}
                />
                <Path
                    d="M243.009 95.595c-2.484-5.963-1.863-13.052 2.713-17.595-1.652 1.075-3.508 3.626-4.179 6.567-.49 2.124-.49 4.7-.54 6.88a20.488 20.488 0 004.762 13.512l.869-1.465a65.484 65.484 0 009.369 10.47c.404.31.735.707.969 1.162.162.522.225 1.07.186 1.615a9.048 9.048 0 002.086 5.656c.189.259.448.457.745.572.308.059.625.033.919-.076a17.313 17.313 0 009.034-6.284 17.9 17.9 0 01-7.96 2.872 3.118 3.118 0 01-1.8-.188 2.637 2.637 0 01-1.155-1.603 6.932 6.932 0 01.621-5.19 20.363 20.363 0 013.172-4.28l3.005-3.374a9.648 9.648 0 001.354-1.785c.375-.804.662-1.647.857-2.514.621-2.2 1.539-4.304 2.198-6.491.658-2.187 1.043-4.537.527-6.768-.515-2.231-2.092-4.305-4.271-4.908a9.758 9.758 0 00-2.807-.22l-9.021.138a10.387 10.387 0 00-3.812.534c-2.08.861-4.476 3.425-5.848 5.197a5.847 5.847 0 00-1.043 2.74c-.236.95-1.323 3.934-.95 4.826z"
                    fill="url(#prefix__paint11_linear)"
                />
                <Path
                    d="M256.058 77.377a2.79 2.79 0 011.449-.377c.551.116 1.064.37 1.492.742 3.165 2.204 7.382 3.379 9.135 6.852 1.015 2.022.941 4.397.749 6.677-.309 3.58-.892 7.21-2.57 10.369-1.678 3.16-4.62 5.81-8.125 6.281-4.595.628-9.06-2.575-11.302-6.702-1.926-3.523-4.23-10.514-1.914-14.282 2.521-4.051 6.856-7.537 11.086-9.56z"
                    fill="url(#prefix__paint12_linear)"
                />
                <Path
                    d="M265.248 80.898c.77.598 4.441 4.654 5.323 5.093.882.44 1.509-15.413-9.937-20.538-.783-.35-1.789-.764-2.354-.102-.429.497-.274 1.274-.131 1.91.367 1.735.565 3.503.59 5.278.037 1.311-.385 3.298.242 4.456 1.112 2.031 4.497 2.54 6.267 3.903z"
                    fill="url(#prefix__paint13_linear)"
                />
                <Path
                    d="M222.66 135.404a2448.27 2448.27 0 01-56.66.595c.117-4.282.34-9.834 1.032-15.311.694-5.201 3.675-9.804 8.108-12.519.396-.226.816-.501.909-.946a2.03 2.03 0 00-.192-.92c-.618-2.065 1.274-4.507 3.443-4.331.117-2.022 2.014-3.562 3.98-3.888 4.005-.626 7.62 2.442 11.742 2.216 2.312-.1 4.598-.57 6.91-.45 1.993.153 3.964.529 5.877 1.12a5.923 5.923 0 012.064.901c1.595 1.221 1.595 3.631 1.446 5.634 4.16.945 7.33 4.457 9.048 8.388s2.188 8.269 2.633 12.519c.006.263-.167 3.875-.34 6.992z"
                    fill={ipctColors.blueRibbon}
                />
                <Path
                    d="M183.665 102.38c-.529-.863-.991-2.083-.36-2.86.474-.581 1.285-.555 1.987-.482l17.252 1.753a1.78 1.78 0 011.171.429c.42.597.371 1.443-.114 1.978a9.97 9.97 0 01-1.549 1.318c-1.057.923-1.717 2.374-2.93 3.027a5.524 5.524 0 01-2.613.441h-6.191c-1.399 0-2.672-.158-3.603-1.378-1.015-1.371-2.137-2.762-3.05-4.226z"
                    fill="url(#prefix__paint14_linear)"
                />
                <Path
                    d="M179.219 71.028c.308-.755.574-1.526.797-2.31.467-1.978.05-4.047.093-6.08.044-2.033.742-4.325 2.597-5.178 1.651-.772 3.581-.16 5.4-.068 3.469.167 6.85-1.63 10.288-1.365a8.838 8.838 0 016.545 3.781c1.121 1.656 1.694 3.738 3.264 4.986.479.383 1.033.668 1.532 1.026a8.019 8.019 0 012.889 4.807 23.9 23.9 0 01.33 5.696c-.056 2.404-.18 5.005-1.712 6.865-1.532 1.86-4.173 2.527-6.614 2.916a71.814 71.814 0 01-19.667.408c-3.257-.383-5.935-1.236-6.595-4.659a20.522 20.522 0 01.853-10.825z"
                    fill="#606161"
                />
                <Path
                    d="M179.219 71.028c.308-.755.574-1.526.797-2.31.467-1.978.05-4.047.093-6.08.044-2.033.742-4.325 2.597-5.178 1.651-.772 3.581-.16 5.4-.068 3.469.167 6.85-1.63 10.288-1.365a8.838 8.838 0 016.545 3.781c1.121 1.656 1.694 3.738 3.264 4.986.479.383 1.033.668 1.532 1.026a8.019 8.019 0 012.889 4.807 23.9 23.9 0 01.33 5.696c-.056 2.404-.18 5.005-1.712 6.865-1.532 1.86-4.173 2.527-6.614 2.916a71.814 71.814 0 01-19.667.408c-3.257-.383-5.935-1.236-6.595-4.659a20.522 20.522 0 01.853-10.825z"
                    fill="url(#prefix__paint15_linear)"
                />
                <Path
                    d="M187.346 106.022a2 2 0 00-.32 1.445c.123.281.315.527.558.717 1.672 1.525 3.475 3.087 5.686 3.625 3.453.787 6.995-.911 8.498-4.076.123-.255.201-.528.232-.809a4.073 4.073 0 00-.626-1.748c-.558-1.284-.47-2.735-.508-4.137-.037-1.402-.281-2.909-1.296-3.878a5.118 5.118 0 00-3.432-1.155c-1.697-.056-6.626.247-7.39 2.02-.444 1.043-.119 2.914-.294 4.075a13.614 13.614 0 01-1.108 3.921z"
                    fill="#F1B475"
                />
                <Path
                    d="M188.369 98.064c.297 1.16.679 2.298 1.143 3.405a4.379 4.379 0 002.601 2.405c1.2.335 2.475-.055 3.631-.511a12.492 12.492 0 002.243-1.097 12.626 12.626 0 002.054-1.747 8.215 8.215 0 001.539-1.961c.419-.692.53-1.518.309-2.29a2.98 2.98 0 00-1.484-1.809 8.313 8.313 0 00-2.186-.84 16.867 16.867 0 00-5.107-.61c-1.332.068-3.481.324-4.467 1.31-.986.987-.641 2.619-.276 3.745z"
                    fill="url(#prefix__paint16_linear)"
                />
                <Path
                    d="M178.796 82.602c-.82 1.273-1.022 2.955-.534 4.447.488 1.491 1.596 2.579 2.93 2.875.548.193 1.143.013 1.544-.468.125-.216.207-.463.238-.723.126-1.805-.208-3.614-.959-5.195-.591-1.19-2.396-2.24-3.219-.936zM211.68 80.014c.719.141 1.129 1.139 1.258 2.047.266 2.004-.332 4.036-1.569 5.323-.27.294-.594.496-.942.588-.352.088-.717-.036-.989-.334a2.588 2.588 0 01-.386-1.43c-.076-1.295-.152-3.023.416-4.177.421-.856 1.34-2.18 2.212-2.017z"
                    fill="#F1B475"
                />
                <Path
                    d="M180.043 81.51c-.03 4.348.731 8.795 2.984 12.524 2.253 3.73 6.19 6.631 10.523 6.956a21.165 21.165 0 005.745-.613c.998-.169 1.974-.45 2.909-.834 2.557-1.148 4.21-3.68 5.342-6.196a28.89 28.89 0 001.04-20.578c-.383-1.178-1.033-2.49-2.259-2.736a3.02 3.02 0 00-1.473.147c-1.857.577-3.454 1.877-5.305 2.533-2.334.829-4.952.565-7.336 0-2.383-.564-4.76-1.429-7.217-1.778a4.806 4.806 0 00-2.192.073c-3.423 1.172-2.742 7.76-2.761 10.501z"
                    fill="#F1B475"
                />
                <Path
                    d="M191 114.583a57.508 57.508 0 01-8.269-.846 22.703 22.703 0 00-4.005-.507 9.653 9.653 0 00-8.139 4.77c-.903-1.324-.685-3.184.118-4.573.804-1.39 2.091-2.421 3.343-3.417a4.605 4.605 0 011.518-.918c2.162-.626 4.956 2.128 6.811 2.981a30.056 30.056 0 008.623 2.51z"
                    fill="url(#prefix__paint17_linear)"
                />
                <Path
                    d="M198 115.728c5.251-.768 10.696-1.53 15.785 0a3.013 3.013 0 002.11.147c.359-.187.649-.488.827-.858a3.415 3.415 0 00-.224-3.131 7.556 7.556 0 00-2.246-2.292c-1.083-.781-3.111-2.058-4.517-1.423-1.064.483-2.004 2.268-2.918 3.087a19.09 19.09 0 01-8.817 4.47z"
                    fill="url(#prefix__paint18_linear)"
                />
                <Path
                    d="M348 125.235c-7.136 1.282-14.415 2.129-21.651 2.845a1087.655 1087.655 0 01-34.8 2.92c-.522-7.901-.937-24.045.049-27.395a19.458 19.458 0 016.913-10.404c.621 0 2.389-1.457 3.035-1.78a29.73 29.73 0 013.506-1.314 57.74 57.74 0 016.491-1.681c4.884-1.015 10.661.075 15.65.292 3.059.125 6.205.274 8.961 1.638a16.325 16.325 0 015.895 5.498c2.842 4.065 5.138 19.276 5.951 29.381z"
                    fill={ipctColors.blueRibbon}
                />
                <Path
                    d="M311.957 88.871c-.432 1.067-.981 2.14-.956 3.294a4.967 4.967 0 001.456 3.174 7.986 7.986 0 006.657 2.629c2.508-.287 4.663-1.942 5.621-4.316.167-.41.257-.849.265-1.293a5.907 5.907 0 00-.37-1.65 20.684 20.684 0 01-.944-7.34c.08-1.55.216-3.394-.993-4.34a3.497 3.497 0 00-1.234-.566 11.703 11.703 0 00-6.522 0c-2.418.697-1.74 2.008-1.752 4.085a17.318 17.318 0 01-1.228 6.323z"
                    fill="#775339"
                />
                <Path
                    d="M316.155 87.57c1.613.674 3.651.61 4.931-.58 1.279-1.189 1.472-2.976 1.646-4.647l.238-2.308a.643.643 0 00-.753-.823 35.19 35.19 0 00-5.992-.147c-1.33.077-3.214 0-3.921 1.395-1.248 2.61 1.607 6.17 3.851 7.11z"
                    fill="url(#prefix__paint19_linear)"
                />
                <Path
                    d="M306.805 73.126a18.324 18.324 0 003.128 5.037c3.233 3.456 8.621 4.616 13.232 3.323 4.612-1.292 8.393-4.808 10.505-9.015 2.112-4.208 2.66-9.052 2.155-13.71-.277-2.573-.911-5.205-2.543-7.213a11.66 11.66 0 00-5.074-3.474c-7.318-2.752-15.608-.072-19.796 6.401-3.854 5.957-4.519 12.226-1.607 18.65z"
                    fill="#775339"
                />
                <Path
                    d="M302.443 66.813a2.831 2.831 0 00-.349 2.246 5.74 5.74 0 001.031 2.055c.274.469.719.79 1.225.886.491-.026.938-.31 1.198-.76 1.53-2.259-1.154-7.176-3.105-4.427zM336.465 64.002c.892-.038 1.728.46 2.153 1.28.408.819.493 1.772.236 2.654a6.609 6.609 0 01-1.259 2.372 4.383 4.383 0 01-1.911 1.563 1.911 1.911 0 01-2.214-.634 2.924 2.924 0 01-.37-.95c-.492-2.111.868-6.046 3.365-6.285z"
                    fill="#775339"
                />
                <Path
                    d="M304.415 66.996c.62-.155.689-.974.62-1.59a16.702 16.702 0 012.04-9.02c1.104.974 2.84.418 4.26-.048 6.052-2.003 12.656-1.357 19.036-.819.263-.001.52.074.738.215.129.117.228.26.291.419a22.622 22.622 0 012.387 9.564 7.8 7.8 0 012.096-1.195c.335-1.608-.111-3.258-.564-4.842-.93-3.288-1.935-6.713-4.297-9.254-3.224-3.467-8.427-4.621-13.251-4.4-5.276.245-10.857 2.23-13.641 6.576-1.544 2.433-2.015 5.302-2.065 8.112 0 1.148-.241 2.923.205 4.01.236.509 1.736 2.368 2.145 2.272z"
                    fill="#606161"
                />
                <Path
                    d="M304.415 66.996c.62-.15.689-.968.62-1.584a16.69 16.69 0 012.04-9.02c1.104.968 2.84.419 4.26-.054 6.052-1.996 12.656-1.357 19.036-.813.263 0 .52.074.738.216.127.115.226.256.291.412a22.682 22.682 0 012.387 9.564c.63-.501 1.338-.904 2.096-1.196.335-1.608-.111-3.263-.564-4.841-.93-3.294-1.935-6.713-4.297-9.253-3.224-3.467-8.427-4.627-13.251-4.4-5.276.245-10.857 2.23-13.641 6.575-1.544 2.433-2.015 5.308-2.065 8.118 0 1.147-.241 2.923.205 4.01.236.509 1.736 2.368 2.145 2.266z"
                    fill="url(#prefix__paint20_linear)"
                />
                <Path
                    d="M306.953 76.468c.289.966.707 1.89 1.242 2.743a10.645 10.645 0 004.251 3.381c.869.447 1.783.801 2.725 1.056a16.31 16.31 0 004.053.338c2.899 0 5.792-.194 8.69-.382.635.01 1.263-.14 1.825-.437a3.573 3.573 0 001.117-1.412 23.436 23.436 0 002.974-9.28c.025-1.15.11-2.297.254-3.438.304-1.687 1.105-3.337.875-5.037-.72.194-1.117.956-1.415 1.65-.621 1.4-1.173 2.818-1.862 4.18a9.147 9.147 0 01-1.527 2.338c-1.527 1.594-3.855 2.106-6.052 2.287-1.676.132-3.358.113-5.04.082-2.65-.05-5.475-.188-7.641-1.72-2.644-1.874-3.563-5.567-6.319-7.23-.304.513.156 1.388.199 1.956.068 1.038.161 2.069.31 3.125.281 1.968.73 3.909 1.341 5.8z"
                    fill="#606161"
                />
                <Path
                    d="M306.953 76.468c.289.966.707 1.89 1.242 2.743a10.645 10.645 0 004.251 3.381c.869.447 1.783.801 2.725 1.056a16.31 16.31 0 004.053.338c2.899 0 5.792-.194 8.69-.382.635.01 1.263-.14 1.825-.437a3.573 3.573 0 001.117-1.412 23.436 23.436 0 002.974-9.28c.025-1.15.11-2.297.254-3.438.304-1.687 1.105-3.337.875-5.037-.72.194-1.117.956-1.415 1.65-.621 1.4-1.173 2.818-1.862 4.18a9.147 9.147 0 01-1.527 2.338c-1.527 1.594-3.855 2.106-6.052 2.287-1.676.132-3.358.113-5.04.082-2.65-.05-5.475-.188-7.641-1.72-2.644-1.874-3.563-5.567-6.319-7.23-.304.513.156 1.388.199 1.956.068 1.038.161 2.069.31 3.125.281 1.968.73 3.909 1.341 5.8z"
                    fill="url(#prefix__paint21_linear)"
                />
                <Path
                    d="M321.33 77.172l-3.615-.103a5.3 5.3 0 00-1.664.13c-.551.14-.959.528-1.051 1.001.009.376.168.74.45 1.033.15.198.34.373.561.517.464.206.993.288 1.514.234l6.526-.114c.176.007.351-.023.509-.088a.68.68 0 00.313-.375c.313-.789.036-1.657-.705-2.213-.705-.435-1.984 0-2.838-.022z"
                    fill="#775339"
                />
            </G>
            <Defs>
                <LinearGradient
                    id="prefix__paint0_linear"
                    x1={149}
                    y1={136.001}
                    x2={160}
                    y2={136.001}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#E5C6D6" />
                    <Stop offset={0.42} stopColor="#EAD4D0" />
                    <Stop offset={1} stopColor="#F0E9CB" />
                </LinearGradient>
                <LinearGradient
                    id="prefix__paint1_linear"
                    x1={104}
                    y1={135.009}
                    x2={114}
                    y2={135.009}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#E5C6D6" />
                    <Stop offset={0.42} stopColor="#EAD4D0" />
                    <Stop offset={1} stopColor="#F0E9CB" />
                </LinearGradient>
                <LinearGradient
                    id="prefix__paint2_linear"
                    x1={89.516}
                    y1={45.722}
                    x2={87.028}
                    y2={161.095}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#010101" stopOpacity={0.01} />
                    <Stop offset={0.95} stopColor="#010101" />
                </LinearGradient>
                <LinearGradient
                    id="prefix__paint3_linear"
                    x1={41.097}
                    y1={52.463}
                    x2={43.249}
                    y2={95.786}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#010101" stopOpacity={0.01} />
                    <Stop offset={0.95} stopColor="#010101" />
                </LinearGradient>
                <LinearGradient
                    id="prefix__paint4_linear"
                    x1={79.18}
                    y1={112.802}
                    x2={84.853}
                    y2={84.759}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#010101" stopOpacity={0.01} />
                    <Stop offset={0.95} stopColor="#010101" />
                </LinearGradient>
                <LinearGradient
                    id="prefix__paint5_linear"
                    x1={53.71}
                    y1={93.368}
                    x2={67.001}
                    y2={89.244}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#010101" stopOpacity={0.01} />
                    <Stop offset={0.95} stopColor="#010101" />
                </LinearGradient>
                <LinearGradient
                    id="prefix__paint6_linear"
                    x1={79.43}
                    y1={96.465}
                    x2={88.059}
                    y2={97.101}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#010101" stopOpacity={0.01} />
                    <Stop offset={0.95} stopColor="#010101" />
                </LinearGradient>
                <LinearGradient
                    id="prefix__paint7_linear"
                    x1={124.002}
                    y1={108.019}
                    x2={140.012}
                    y2={108.019}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#E5C6D6" />
                    <Stop offset={0.42} stopColor="#EAD4D0" />
                    <Stop offset={1} stopColor="#F0E9CB" />
                </LinearGradient>
                <LinearGradient
                    id="prefix__paint8_linear"
                    x1={179.719}
                    y1={105.51}
                    x2={186.396}
                    y2={19.64}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#010101" stopOpacity={0.01} />
                    <Stop offset={0.95} stopColor="#010101" />
                </LinearGradient>
                <LinearGradient
                    id="prefix__paint9_linear"
                    x1={116.304}
                    y1={90.634}
                    x2={142.656}
                    y2={93.785}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#E5C6D6" />
                    <Stop offset={0.42} stopColor="#EAD4D0" />
                    <Stop offset={1} stopColor="#F0E9CB" />
                </LinearGradient>
                <LinearGradient
                    id="prefix__paint10_linear"
                    x1={370.777}
                    y1={144.28}
                    x2={370.884}
                    y2={50.236}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#010101" stopOpacity={0.01} />
                    <Stop offset={1} stopColor="#010101" />
                </LinearGradient>
                <LinearGradient
                    id="prefix__paint11_linear"
                    x1={285.906}
                    y1={178.023}
                    x2={393.854}
                    y2={92.615}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#010101" stopOpacity={0.01} />
                    <Stop offset={0.95} stopColor="#010101" />
                </LinearGradient>
                <LinearGradient
                    id="prefix__paint12_linear"
                    x1={243.994}
                    y1={108.012}
                    x2={269.001}
                    y2={108.012}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#E5C6D6" />
                    <Stop offset={0.42} stopColor="#EAD4D0" />
                    <Stop offset={1} stopColor="#F0E9CB" />
                </LinearGradient>
                <LinearGradient
                    id="prefix__paint13_linear"
                    x1={231.428}
                    y1={46.869}
                    x2={265.799}
                    y2={120.021}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#010101" stopOpacity={0.01} />
                    <Stop offset={0.95} stopColor="#010101" />
                </LinearGradient>
                <LinearGradient
                    id="prefix__paint14_linear"
                    x1={153.507}
                    y1={95.235}
                    x2={153.276}
                    y2={129.703}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#010101" stopOpacity={0.01} />
                    <Stop offset={0.95} stopColor="#010101" />
                </LinearGradient>
                <LinearGradient
                    id="prefix__paint15_linear"
                    x1={212.125}
                    y1={87.189}
                    x2={220.394}
                    y2={52.455}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#010101" stopOpacity={0.01} />
                    <Stop offset={0.95} stopColor="#010101" />
                </LinearGradient>
                <LinearGradient
                    id="prefix__paint16_linear"
                    x1={215.46}
                    y1={109.837}
                    x2={223.656}
                    y2={72.085}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#010101" stopOpacity={0.01} />
                    <Stop offset={0.95} stopColor="#010101" />
                </LinearGradient>
                <LinearGradient
                    id="prefix__paint17_linear"
                    x1={218.831}
                    y1={116.758}
                    x2={220.1}
                    y2={83.641}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#010101" stopOpacity={0.01} />
                    <Stop offset={0.95} stopColor="#010101" />
                </LinearGradient>
                <LinearGradient
                    id="prefix__paint18_linear"
                    x1={253.597}
                    y1={113.473}
                    x2={252.409}
                    y2={74.531}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#010101" stopOpacity={0.01} />
                    <Stop offset={0.95} stopColor="#010101" />
                </LinearGradient>
                <LinearGradient
                    id="prefix__paint19_linear"
                    x1={327.68}
                    y1={91.076}
                    x2={332.44}
                    y2={70.44}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#010101" stopOpacity={0.01} />
                    <Stop offset={0.95} stopColor="#010101" />
                </LinearGradient>
                <LinearGradient
                    id="prefix__paint20_linear"
                    x1={299.32}
                    y1={40.376}
                    x2={299.176}
                    y2={65.153}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#010101" stopOpacity={0.01} />
                    <Stop offset={0.95} stopColor="#010101" />
                </LinearGradient>
                <LinearGradient
                    id="prefix__paint21_linear"
                    x1={304.973}
                    y1={83.992}
                    x2={334.972}
                    y2={83.992}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#010101" stopOpacity={0.01} />
                    <Stop offset={0.95} stopColor="#010101" />
                </LinearGradient>
            </Defs>
        </Svg>
    );
}

export default DiversitySvg;
