import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

// Set the key-value pairs for the different languages you want to support.
i18n.translations = {
    en: {
        testnetWarning: 'A friendly reminder you\'re using the Alfajores network build - the balances are not real.',
        pendingApprovalMessage: 'This community has not yet been approved. If you have any question please contact us at',
        pendingApproval: 'Pending Approval',
        fullDashboard: 'Full Dashboard',
        editCommunityDetails: 'Edit community details',
        viewAsPublic: 'View as public',
        share: 'Share',
        beneficiaries: 'Beneficiaries',
        backers: 'Backers',
        added: 'Added',
        removed: 'Removed',
        addBeneficiary: 'Add Beneficiary',
        add: 'Add',
        cancel: 'Cancel',
        claimed: 'Claimed',
        raised: 'Raised',
        claim: 'Claim',
        manage: 'Manage',
        communities: 'Communities',
        pay: 'Pay',
        wallet: 'Wallet',
        loginNow: 'Login Now',
        editProfile: 'Edit Profile',
        balance: 'Balance',
        name: 'Name',
        currency: 'Currency',
        country: 'Country',
        phoneNumber: 'Phone Number',
        logout: 'Logout',
        recentTransactions: 'Recent Transactions',
        nameAddressPhone: 'Name, address or phone number',
        noteOptional: 'Note (optional)',
        recent: 'Recent',
        remove: 'Remove',
        beneficiaryAddress: 'Beneficiary Address',
        useText: 'Use Text',
        useCamera: 'Use Camera',
        tapToScanAgain: 'Tap to Scan Again',
        currentAddress: 'Current Address',
        allowCamera: 'Allow camera',
        moreAboutYourCommunity: 'More about your community',
        howClaimWorks: 'How claim works',
        upToPerBeneficiary: 'Up to ${{amount}} / beneficiary',
        ssi: 'Self-Sustainability Index',
        ssiDescription: 'SSI indicates how self-sustainable a community is and how it progresses overtime, by measuring their beneficiaries claim urgency',
        seeMore: 'See More',
        seeLess: 'See Less',
        exploreCommunityContract: 'Explore Community Contract',
        edit: 'Edit',
        create: 'Create',
        submit: 'Submit',
        needLoginToCreateCommunity: 'You need to login to create communities.',
        communityDetails: 'Community Details',
        createCommunityDescription: 'By creating a community, you are creating a contract where all beneficiaries added to that community by you, have equal access to the funds raised to that contract, based on a few parameters.',
        selectCoverImage: 'Select Cover Image',
        changeCoverImage: 'Change Cover Image',
        communityName: 'Community Name',
        shortDescription: 'Short Description',
        city: 'City',
        getGPSLocation: 'Get GPS Location',
        validCoordinates: 'Valid Coordinates',
        email: 'Email',
        contractDetails: 'Contract Details',
    },
    pt: {
        testnetWarning: 'Lembre-se que está a usar a testnet Alfajores - os balanços não são reais.',
        pendingApprovalMessage: 'Esta comunidade ainda não foi aprovada. Se você tem alguma questão, contacte-nos através de',
        pendingApproval: 'Pedido pendente',
        fullDashboard: 'Dashboard Completa',
        editCommunityDetails: 'Editar detalhes da comunidade',
        viewAsPublic: 'Ver como publico',
        share: 'Partilhar',
        beneficiaries: 'Beneficiarios',
        backers: 'Backers',
        added: 'Adicionado',
        removed: 'Removido',
        addBeneficiary: 'Adicionar Beneficiario',
        add: 'Adicionar',
        cancel: 'Cancelar',
        claimed: 'Recolhido',
        raised: 'Angariado',
        claim: 'Pedir',
        manage: 'Gerir',
        communities: 'Comunidades',
        pay: 'Pagar',
        wallet: 'Carteira',
        loginNow: 'Autenticar Agora',
        editProfile: 'Editar Perfil',
        balance: 'Balanço',
        name: 'Nome',
        currency: 'Moeda',
        country: 'País',
        phoneNumber: 'Número de telemovel',
        logout: 'Sair',
        recentTransactions: 'Transações Recentes',
        nameAddressPhone: 'Nome, endereço ou número de telemovel',
        noteOptional: 'Nota (opcional)',
        recent: 'Recente',
        remove: 'Remover',
        beneficiaryAddress: 'Endereço do Beneficiário',
        useText: 'Usar Texto',
        useCamera: 'Usar Camera',
        tapToScanAgain: 'Clique para scannear de novo',
        currentAddress: 'Endereço Atual',
        allowCamera: 'Permitir camera',
        moreAboutYourCommunity: 'Mais info acerca da sua comunidade',
        howClaimWorks: 'Como funcionam os pedidos',
        upToPerBeneficiary: 'Até ${{amount}} / beneficiário',
    },
};
// Set the locale once at the beginning of your app.
i18n.locale = Localization.locale;
// When a value is missing from a language it'll fallback to another language with the key present.
i18n.fallbacks = true;

export default i18n;