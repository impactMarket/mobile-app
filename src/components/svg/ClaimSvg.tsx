import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function ClaimSvg(props: { focused: boolean }) {
    return (
        <Svg width={44} height={32} viewBox="0 0 44 32" fill="none">
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M40.325 14.813c2.056.623 3.19 1.469 3.413 2.52l.12 9.857c0 1.53-1.835 2.426-3.396 2.904-1.894.581-4.368.906-6.995.906-4.777 0-9.904-1.085-10.339-3.451-1.996-.017-3.881-.222-5.485-.598a10.217 10.217 0 01-6.44 2.29C5.563 29.24 1 24.66 1 19.014 1 13.378 5.58 8.79 11.211 8.79c.648 0 1.288.06 1.92.18l-.095-3.895a1.58 1.58 0 01-.025-.282c0-1.53 1.851-2.418 3.395-2.896 1.877-.58 4.36-.897 6.986-.897 2.636 0 5.136.316 7.055.897 1.92.58 3.054 1.358 3.37 2.315l.23 9.72c2.389.052 4.555.36 6.279.88zM23.375 2.708c-2.456 0-4.768.3-6.491.829-1.63.504-2.201 1.076-2.201 1.256.008.008.017.017.017.025.043.188.563.778 2.397 1.307 1.698.496 3.933.77 6.287.77 2.431 0 4.828-.308 6.56-.83 1.86-.563 2.26-1.144 2.26-1.264 0-.12-.4-.7-2.26-1.264-1.74-.53-4.137-.829-6.569-.829zm8.966 4.203v2.136a.867.867 0 00-.136.478c0 .111-.401.7-2.252 1.264-1.732.53-4.13.829-6.56.829-2.108 0-4.172-.222-5.81-.64-.011-.005-.023-.007-.034-.009-.013-.002-.025-.004-.034-.009a9.794 9.794 0 00-2.662-1.512l-.06-2.409a9.443 9.443 0 001.843.71c1.852.537 4.249.828 6.765.828 2.636 0 5.135-.316 7.046-.897a8.399 8.399 0 001.894-.769zM4.915 24.747a8.491 8.491 0 0012.011.564 8.455 8.455 0 002.781-6.296c0-.572-.06-1.153-.17-1.717a8.504 8.504 0 00-2.798-4.74 8.3 8.3 0 00-3.02-1.683 8.513 8.513 0 00-8.24 1.845c-3.472 3.16-3.72 8.55-.564 12.027zm14.178.752a10.318 10.318 0 001.638-2.81c.734.06 1.501.102 2.295.11a.877.877 0 000 .3l.034 2.75a25.924 25.924 0 01-3.967-.35zm3.839-7.44a30.368 30.368 0 01-1.561-.06c.025.341.043.675.043 1.008 0 .666-.069 1.34-.197 1.999.572.042 1.178.068 1.792.077l-.035-2.845c-.017-.06-.034-.12-.042-.18zm.52-1.7h-.068c-.828 0-1.612-.034-2.346-.094a10.295 10.295 0 00-1.518-3.178c1.28.162 2.576.248 3.864.248 2.636 0 5.135-.316 7.046-.897a9.026 9.026 0 001.903-.786v2.28c-2.133.06-4.138.334-5.733.787-1.501.427-2.55.974-3.148 1.64zm3.626.025c-1.664.462-2.304.983-2.449 1.247a.733.733 0 01.043.231c.205.29.896.795 2.5 1.23 1.671.453 3.847.71 6.107.71 2.431 0 4.743-.283 6.492-.804 1.894-.564 2.312-1.153 2.32-1.281v-.009c-.025-.145-.46-.691-2.252-1.238-1.731-.53-4.12-.812-6.56-.812h-.068c-2.286 0-4.461.257-6.133.726zM42.15 27.182c0 .12-.375.709-2.192 1.273-1.74.538-4.044.837-6.5.837-2.466 0-4.76-.29-6.475-.812-1.63-.504-2.175-1.068-2.175-1.256v-.017l-.009-.52-.026-1.931c.683.333 1.39.59 2.124.768 1.792.47 4.053.727 6.381.727 2.636 0 5.11-.317 7.02-.897.624-.188 1.34-.444 1.852-.778v2.606zm-2.337-3.468c1.834-.564 2.226-1.145 2.226-1.265 0-.095.035-.186.067-.269a.671.671 0 00.053-.183V19.86a9.323 9.323 0 01-1.92.777c-1.902.564-4.367.872-6.96.872-3.174 0-6.56-.479-8.574-1.53l.034 2.7c.734.82 3.89 1.854 8.53 1.854 2.475 0 4.795-.29 6.544-.82z"
                fill={props.focused ? '#5E72E4' : '#7E8DA6'}
            />
            <Path
                d="M43.738 17.333l.1-.002v-.01l-.002-.01-.098.022zm-3.413-2.52l.03-.096-.03.096zm3.532 12.377h.1v-.001l-.1.001zm-3.395 2.904l-.03-.095.03.096zM23.128 27.55l.098-.018-.014-.081-.083-.001v.1zm-5.485-.598l.023-.097-.048-.011-.038.03.063.078zM13.13 8.97l-.018.098.121.023-.003-.124-.1.003zm-.094-3.895l.1-.003v-.008l-.001-.007-.098.018zm3.37-3.178l-.03-.096.03.096zm14.041 0l-.029.096.03-.096zm3.37 2.315l.1-.003v-.014l-.005-.014-.095.03zm.23 9.72l-.1.003.002.096.096.002.002-.1zM16.884 3.538l-.03-.096.03.096zm-2.201 1.256h-.1v.041l.03.03.07-.071zm.017.025h-.1v.012l.002.01.098-.022zm2.397 1.307l.028-.096-.028.096zm12.847-.06l.029.096-.03-.096zm0-2.528l-.03.096.03-.096zm2.397 5.51l.084.054.016-.025v-.03h-.1zm0-2.136h.1v-.169l-.148.082.048.087zm-2.389 3.878l-.029-.095.03.095zm-12.369.188l-.031.095.006.002.025-.097zm-.034-.008l.018-.098-.018.098zm-.034-.009l-.062.078.008.007.01.005.044-.09zm-2.662-1.512l-.1.003.002.067.063.024.036-.094zm-.06-2.409l.046-.089-.15-.076.005.168.1-.003zm1.843.71l.028-.097h-.002l-.026.096zm13.811-.069l-.025-.097-.004.001.03.096zm-13.52 17.63l-.068-.073.067.074zm-12.012-.563l-.074.067.074-.067zm14.792-5.732h-.1.1zm-.17-1.717l.098-.019v-.001l-.098.02zm-2.798-4.74l-.066.075.066-.075zm-3.02-1.683l.03-.096h-.001l-.03.096zm-8.24 1.845l-.068-.074.067.074zm15.252 9.969l.008-.1-.074-.006-.027.07.093.036zm-1.638 2.81l-.077-.063-.11.133.17.029.017-.1zm3.933-2.7l.098.017.02-.115-.117-.001-.001.1zm0 .3l.1-.002v-.007l-.002-.008-.098.017zm.034 2.75l-.002.1.103.001-.001-.102-.1.001zM21.37 18l.008-.1-.116-.008.01.115.099-.007zm1.562.06l.099-.015-.012-.084-.085-.001-.002.1zm-1.715 2.947l-.098-.02-.021.111.112.008.007-.1zm1.792.077l-.002.1.103.001-.001-.103-.1.002zm-.035-2.845l.1-.001v-.016l-.005-.015-.095.032zm0 0l-.096.027.002.005.095-.032zm.478-1.88v.1h.045l.03-.032-.075-.067zm-2.414-.093l-.096.027.018.067.07.005.008-.1zm-1.518-3.178l.012-.1-.225-.028.131.186.082-.058zm10.91-.65l-.027-.095h-.002l.03.096zm1.903-.785h.1v-.17l-.149.082.049.088zm0 2.28l.002.1.097-.002v-.097h-.1zm-5.733.787l-.027-.096.027.096zm-1.97 2.912l-.088-.047-.021.038.014.041.094-.032zm2.448-1.247l.026.097-.026-.097zm-2.406 1.478h-.1v.032l.018.026.082-.058zm2.5 1.23l-.027.097.027-.097zm12.599-.094l-.029-.096.029.096zm2.32-1.281l.1.007v-.007h-.1zm0-.009h.1V17.7l-.001-.009-.099.017zM39.84 16.47l-.029.095.03-.095zm.12 11.985l.03.095-.03-.096zm-12.975.025l-.03.096.03-.096zm-2.175-1.273h.1v-.001l-.1.001zm-.009-.52h-.1.1zm-.026-1.931l.044-.09-.146-.071.002.162.1-.001zm2.124.768l.026-.096h-.002l-.024.096zm13.402-.17l-.029-.096.029.096zm1.851-.778h.1v-.184l-.154.1.054.084zm-2.337-.862l.029.095-.03-.095zm2.293-1.534l-.093-.036.093.036zm.053-.183l.1.006v-.006h-.1zm0-2.136h.1v-.168l-.148.08.048.088zm-1.92.777l-.027-.096h-.001l.028.096zm-15.534-.657l.047-.089-.149-.077.002.167.1-.001zm.034 2.699l-.1.001v.038l.026.028.074-.067zm19.096-5.368c-.118-.556-.475-1.05-1.057-1.48-.581-.43-1.39-.802-2.425-1.115l-.057.191c1.021.31 1.807.674 2.363 1.085.555.41.875.865.98 1.36l.196-.041zm.121 9.877l-.12-9.858-.2.003.12 9.857.2-.002zm-3.466 3.001c.785-.24 1.646-.588 2.313-1.073.666-.484 1.153-1.117 1.153-1.927h-.2c0 .72-.43 1.3-1.07 1.765-.642.466-1.478.806-2.254 1.044l.058.191zm-7.024.91c2.635 0 5.119-.325 7.024-.91L40.433 30c-1.882.577-4.346.901-6.966.901v.2zM23.03 27.567c.115.627.539 1.158 1.168 1.601.628.443 1.47.805 2.443 1.09 1.945.57 4.431.842 6.826.842v-.2c-2.382 0-4.848-.27-6.77-.834-.96-.282-1.78-.636-2.384-1.061-.604-.426-.984-.918-1.087-1.474l-.196.036zm-5.41-.519c1.612.378 3.505.584 5.507.601l.002-.2c-1.99-.017-3.868-.222-5.463-.595l-.046.194zm-6.418 2.292c2.37 0 4.67-.82 6.504-2.311l-.126-.156a10.116 10.116 0 01-6.377 2.267v.2zM.9 19.015c0 5.702 4.608 10.325 10.303 10.325v-.2C5.619 29.14 1.1 24.607 1.1 19.015H.9zM11.211 8.69C5.526 8.69.9 13.323.9 19.015h.2C1.1 13.433 5.636 8.89 11.211 8.89v-.2zm1.938.182a10.389 10.389 0 00-1.938-.182v.2c.642 0 1.276.06 1.9.178l.038-.196zm-.212-3.795l.093 3.895.2-.005-.094-3.895-.2.005zm-.026-.284c0 .1.009.2.027.3l.197-.036a1.476 1.476 0 01-.024-.264h-.2zM16.377 1.8c-.777.24-1.637.586-2.306 1.069-.668.482-1.16 1.112-1.16 1.923h.2c0-.72.434-1.297 1.077-1.761.643-.464 1.48-.802 2.248-1.04l-.06-.19zM23.392.9c-2.634 0-5.127.317-7.015.901l.059.191c1.864-.577 4.336-.892 6.956-.892V.9zm7.084.901C28.545 1.217 26.036.9 23.392.9v.2c2.63 0 5.119.315 7.026.893l.058-.192zm3.436 2.38c-.167-.506-.547-.956-1.122-1.35-.574-.394-1.348-.738-2.314-1.03l-.058.192c.954.288 1.707.624 2.259 1.003.551.378.896.796 1.045 1.247l.19-.062zm.235 9.75l-.23-9.722-.2.005.23 9.721.2-.005zm6.208.786c-1.734-.524-3.91-.833-6.306-.884l-.004.2c2.382.05 4.54.358 6.252.875l.058-.191zM16.913 3.633c1.711-.526 4.012-.825 6.462-.825v-.2c-2.463 0-4.785.3-6.52.833l.058.192zm-2.13 1.16c0 .002 0-.01.015-.036a.545.545 0 01.074-.098 1.91 1.91 0 01.355-.289c.337-.222.878-.487 1.686-.737l-.059-.192c-.821.254-1.38.527-1.737.762a2.102 2.102 0 00-.393.321.745.745 0 00-.1.135.282.282 0 00-.041.134h.2zm.017.025a.122.122 0 00-.025-.072c-.009-.012-.018-.021-.021-.024l-.142.141.004.004-.001-.002a.084.084 0 01-.015-.047h.2zm2.325 1.211c-.91-.263-1.49-.539-1.844-.77a1.99 1.99 0 01-.373-.3.443.443 0 01-.11-.163l-.196.044c.017.073.072.16.16.255.09.098.223.21.41.333.375.243.974.527 1.897.793l.056-.192zm6.259.765c-2.348 0-4.573-.273-6.259-.765l-.056.192c1.71.5 3.954.773 6.315.773v-.2zm6.531-.824c-1.72.517-4.107.824-6.531.824v.2c2.438 0 4.845-.308 6.589-.833l-.058-.191zm2.19-1.169c0-.008.002-.003-.01.02a.487.487 0 01-.06.085c-.059.072-.16.167-.32.279-.322.223-.877.505-1.8.785l.058.191c.936-.284 1.512-.574 1.855-.812.172-.12.288-.226.362-.315a.682.682 0 00.083-.122.252.252 0 00.031-.11h-.2zm-2.19-1.168c.923.28 1.478.562 1.8.785.16.111.261.207.32.279.03.035.05.064.06.084.011.023.01.029.01.02h.2a.252.252 0 00-.032-.11.681.681 0 00-.083-.122 1.814 1.814 0 00-.361-.315c-.344-.239-.92-.529-1.856-.813l-.058.192zm-6.54-.825c2.425 0 4.812.299 6.54.825l.058-.192c-1.752-.533-4.16-.833-6.598-.833v.2zm9.066 6.239V6.91h-.2v2.136h.2zm-.137.478c0-.154.039-.297.121-.424l-.168-.109a.966.966 0 00-.152.533h.2zm-2.322 1.36c.932-.284 1.505-.576 1.848-.816.171-.12.286-.227.36-.315a.69.69 0 00.082-.12.244.244 0 00.032-.109h-.2c0-.01.003-.006-.009.017a.506.506 0 01-.059.084c-.06.071-.16.167-.32.28-.321.223-.874.508-1.793.788l.059.191zm-6.59.833c2.438 0 4.846-.3 6.59-.833l-.059-.191c-1.72.525-4.106.824-6.53.824v.2zm-5.834-.644c1.648.421 3.721.644 5.834.644v-.2c-2.1 0-4.156-.222-5.784-.638l-.05.194zm-.027-.006l.013.002.008.002.063-.19c-.02-.006-.038-.01-.048-.011l-.036.197zm-.06-.018c.024.012.052.016.06.018l.036-.197-.013-.003.006.003-.09.179zm-2.653-1.508a9.69 9.69 0 012.635 1.496l.124-.156a9.893 9.893 0 00-2.688-1.527l-.07.187zm-.124-2.5l.06 2.409.2-.005-.06-2.41-.2.006zm1.968.61a9.342 9.342 0 01-1.823-.702l-.09.178a9.544 9.544 0 001.862.717l.051-.193zm6.739.825c-2.51 0-4.897-.29-6.737-.825l-.056.192c1.863.542 4.27.833 6.793.833v-.2zm7.017-.893c-1.899.578-4.388.893-7.017.893v.2c2.643 0 5.152-.317 7.075-.901l-.058-.192zm1.875-.76a8.3 8.3 0 01-1.871.76l.05.193a8.498 8.498 0 001.917-.778l-.096-.175zM16.859 25.237a8.391 8.391 0 01-11.87-.557l-.148.134a8.591 8.591 0 0012.153.57l-.135-.147zm2.748-6.221a8.355 8.355 0 01-2.748 6.22l.134.15a8.555 8.555 0 002.814-6.371h-.2zm-.168-1.698c.11.557.168 1.132.168 1.697h.2c0-.579-.06-1.166-.172-1.736l-.196.039zm-2.765-4.684a8.405 8.405 0 012.765 4.685l.196-.041a8.605 8.605 0 00-2.831-4.797l-.13.153zM13.69 10.97a8.2 8.2 0 012.983 1.663l.132-.15a8.401 8.401 0 00-3.057-1.704l-.058.191zm-2.488-.371a8.58 8.58 0 012.488.371l.058-.191a8.777 8.777 0 00-2.546-.38v.2zm-5.656 2.195a8.413 8.413 0 015.656-2.195v-.2c-2.14 0-4.203.804-5.79 2.247l.134.148zM4.99 24.68c-3.12-3.436-2.875-8.763.556-11.886l-.135-.148c-3.513 3.198-3.763 8.651-.57 12.168l.149-.134zm15.648-2.027a10.216 10.216 0 01-1.622 2.783l.155.126a10.418 10.418 0 001.653-2.838l-.186-.072zm2.389.047a32.396 32.396 0 01-2.288-.111l-.016.2c.735.06 1.505.102 2.302.11l.002-.2zm.097.382a.782.782 0 010-.266l-.197-.033a.984.984 0 000 .332l.197-.033zm.036 2.766l-.034-2.75-.2.002.034 2.75.2-.002zm-4.083-.25c1.327.223 2.654.334 3.981.351l.003-.2a25.829 25.829 0 01-3.951-.349l-.033.198zm2.287-7.5c.506.035 1.028.052 1.566.06l.003-.2a30.222 30.222 0 01-1.555-.059l-.014.2zm.15.909c0-.337-.018-.673-.043-1.016l-.2.015c.026.34.042.671.042 1h.2zm-.199 2.018c.13-.664.198-1.345.198-2.018h-.2c0 .66-.067 1.328-.194 1.98l.196.038zm1.695-.042a29.72 29.72 0 01-1.785-.077l-.015.2a29.9 29.9 0 001.797.077l.003-.2zm-.136-2.744l.035 2.845.2-.003-.035-2.844-.2.002zm.006.03l.19-.063-.19.064zm-.047-.196c.01.067.029.134.045.192l.193-.054a1.281 1.281 0 01-.04-.166l-.198.028zm.551-1.614h.068v-.2h-.068v.2zm-2.354-.095c.736.06 1.524.095 2.354.095v-.2c-.825 0-1.607-.034-2.338-.094l-.016.2zm-1.592-3.22a10.191 10.191 0 011.504 3.148l.192-.054a10.393 10.393 0 00-1.533-3.209l-.163.116zm3.946.09c-1.284 0-2.576-.084-3.852-.246l-.025.198c1.284.163 2.584.249 3.877.249v-.2zm7.017-.892c-1.899.577-4.388.893-7.017.893v.2c2.643 0 5.152-.317 7.075-.901l-.058-.192zm1.883-.778c-.6.33-1.223.592-1.881.778l.054.192a9.127 9.127 0 001.924-.794l-.097-.176zm.148 2.369v-2.28h-.2v2.28h.2zm-5.805.882c1.585-.45 3.582-.723 5.708-.782l-.005-.2c-2.139.06-4.152.334-5.757.79l.054.192zm-3.1 1.61c.578-.645 1.605-1.185 3.1-1.61l-.054-.192c-1.508.428-2.58.982-3.195 1.669l.149.133zm1.19 1.255c.06-.109.237-.294.617-.512.377-.215.944-.458 1.77-.687l-.053-.193c-.837.232-1.421.48-1.817.707-.391.224-.607.432-.692.588l.175.097zm.055.182c0-.091-.02-.18-.048-.262l-.19.063a.634.634 0 01.038.2h.2zm2.426 1.134c-.797-.217-1.363-.449-1.753-.661-.392-.213-.601-.403-.691-.53l-.164.115c.115.163.354.37.76.59.407.222.988.46 1.795.679l.053-.193zm6.081.705c-2.254 0-4.42-.255-6.081-.705l-.053.193c1.683.455 3.867.712 6.134.712v-.2zm6.463-.799c-1.736.518-4.038.8-6.463.8v.2c2.438 0 4.76-.283 6.52-.808l-.056-.192zm2.25-1.192c0-.004 0 .004-.013.028a.537.537 0 01-.064.09 1.701 1.701 0 01-.333.284c-.331.226-.9.51-1.84.79l.058.192c.953-.284 1.541-.576 1.895-.817.176-.12.296-.23.373-.32a.736.736 0 00.087-.124.278.278 0 00.036-.11l-.2-.013zm0-.002v.009h.2v-.009h-.2zm-2.182-1.142c.89.27 1.437.54 1.762.757.163.108.269.202.334.274a.583.583 0 01.083.118.084.084 0 01.003.008v.003l.198-.035a.51.51 0 00-.135-.227 1.964 1.964 0 00-.372-.308c-.346-.23-.913-.507-1.815-.782l-.058.192zm-6.53-.808c2.433 0 4.811.282 6.53.807l.058-.19c-1.744-.534-4.143-.817-6.589-.817v.2zm-.069 0h.068v-.2h-.068v.2zm-6.106.723c1.66-.467 3.826-.723 6.106-.723v-.2c-2.292 0-4.477.257-6.16.73l.054.193zM39.988 28.55c.916-.284 1.475-.576 1.807-.818.166-.12.277-.229.348-.319a.683.683 0 00.078-.122.26.26 0 00.03-.11h-.2c0-.006.001 0-.01.023a.492.492 0 01-.056.086 1.544 1.544 0 01-.307.28c-.31.225-.847.51-1.749.789l.06.191zm-6.53.842c2.464 0 4.778-.3 6.53-.842l-.059-.191c-1.728.534-4.02.833-6.47.833v.2zm-6.503-.816c1.727.524 4.032.816 6.504.816v-.2c-2.46 0-4.744-.29-6.446-.808l-.058.192zm-2.246-1.352c0 .046.016.092.038.134.023.043.055.09.097.137.084.095.21.205.386.322.35.234.903.505 1.724.759l.06-.191c-.809-.25-1.343-.514-1.673-.734a1.795 1.795 0 01-.347-.288.532.532 0 01-.083-.128l-.002-.01h-.2zm0-.017v.017h.2v-.017h-.2zm-.009-.52l.009.522.2-.003-.009-.521-.2.003zm-.026-1.93l.026 1.93.2-.002-.026-1.93-.2.002zm2.248.67a10.427 10.427 0 01-2.104-.761l-.087.18c.688.336 1.403.595 2.144.776l.047-.195zm6.357.724c-2.322 0-4.574-.256-6.355-.723l-.05.193c1.8.473 4.07.73 6.405.73v-.2zm6.992-.893c-1.9.577-4.363.893-6.992.893v.2c2.643 0 5.127-.317 7.05-.902l-.058-.191zm1.825-.765c-.499.324-1.203.577-1.825.765l.058.191c.624-.188 1.352-.447 1.877-.789l-.11-.168zm.155 2.689v-2.606h-.2v2.606h.2zm-.31-4.733c0-.008 0-.002-.01.02a.48.48 0 01-.058.086 1.596 1.596 0 01-.316.278c-.316.223-.862.505-1.773.785l.06.191c.923-.284 1.49-.574 1.828-.812.17-.12.283-.227.356-.316a.678.678 0 00.081-.121.254.254 0 00.031-.11h-.2zm.073-.305c-.031.08-.074.188-.074.305h.2c0-.074.027-.147.06-.233l-.186-.072zm.046-.154a.594.594 0 01-.046.154l.186.072c.024-.061.054-.138.06-.213l-.2-.013zm0-2.129v2.136h.2V19.86h-.2zm-1.793.874a9.418 9.418 0 001.94-.786l-.095-.176c-.608.33-1.24.583-1.899.77l.054.192zm-6.988.875c2.6 0 5.076-.308 6.99-.876l-.057-.192c-1.89.56-4.346.868-6.933.868v.2zm-8.62-1.54c2.036 1.061 5.443 1.54 8.62 1.54v-.2c-3.169 0-6.535-.479-8.527-1.518l-.092.177zm.181 2.609l-.034-2.7-.2.003.034 2.7.2-.003zm8.43 1.755c-2.312 0-4.254-.258-5.706-.617a10.712 10.712 0 01-1.793-.593c-.467-.21-.787-.421-.956-.61l-.15.133c.198.22.548.446 1.024.66.479.215 1.093.423 1.828.604 1.47.364 3.426.623 5.754.623v-.2zm6.515-.816c-1.737.526-4.047.816-6.514.816v.2c2.48 0 4.81-.291 6.572-.825l-.058-.191z"
                fill={props.focused ? '#5E72E4' : '#7E8DA6'}
            />
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.143 19a5.143 5.143 0 015.143-5.143A5.158 5.158 0 0116.429 19a5.148 5.148 0 01-5.143 5.143A5.148 5.148 0 016.143 19zm1.558.008a3.585 3.585 0 107.17-.001 3.585 3.585 0 00-7.17 0z"
                fill={props.focused ? '#5E72E4' : '#7E8DA6'}
            />
        </Svg>
    );
}

export default ClaimSvg;