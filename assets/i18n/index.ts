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
        ssiDescription: 'SSI indicates how self-sustainable a community is and how it progresses over time, by measuring their beneficiaries claim urgency',
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
        claimAmount: 'Claim Amount',
        aroundValue: 'around {{symbol}}{{amount}}',
        totalClaimPerBeneficiary: 'Total claim amount per beneficiary',
        frequency: 'Frequency',
        hourly: 'Hourly',
        daily: 'Daily',
        weekly: 'Weekly',
        timeIncrementAfterClaim: 'Time increment after each claim (in minutes)',
        visibility: 'Visibility',
        public: 'Public',
        private: 'Private',
        createCommunityNote1: 'Note: These values should be a minimum basic income that is sufficient to meet your beneficiaries\' basic needs. They can claim while there are funds available in the contract. You will have the responsibility to promote your community and to raise funds for it.',
        createCommunityNote2: 'If there is another person or organization among your community you believe is more suitable to drive this initiative, let them know about this possibility and encourage them to create a community.',
        failure: 'Failure',
        success: 'Success',
        requestNewCommunityPlaced: 'Your request to create a new community was placed!',
        claimBiggerThanMax: 'Claim Amount should be bigger than Max Claim!',
        claimNotZero: 'Claim Amount should not be zero!',
        maxNotZero: 'Max Claim should not be zero!',
        communityUpdated: 'Your community was updated!',
        errorUpdatingCommunity: 'An error happened while updating your community!',
        errorCreatingCommunity: 'An error happened while placing the request to create a community!',
        anErroHappenedTryAgain: 'An error happened, please, try again.',
        toContinuePlease: 'To continue please',
        connectToYourCeloWallet: 'Connect to your Celo Wallet',
        loginDescription1: 'ImpactMarket operates on top of  Celo Network, financial system that creates conditions for prosperity for everyone.',
        loginDescription2: 'With Celo Wallet you can send money to anyone in the world with just a mobile phone.',
        step1: 'Step 1',
        downloadCeloApp: 'Download the Celo app',
        step2: 'Step 2',
        installCeloCreateAccount: 'Install the Celo App and create a Celo account',
        finalStep: 'Final Step',
        connectCeloWallet: 'Connect to Celo Wallet',
        notNow: 'Not now',
        beforeMovingInsertPin: 'Before moving any further, please, insert your PIN', // pin is for moving dude!
        continue: 'Continue',
        yourQRCode: 'Your QR Code',
        scanToPay: 'Scan to Pay',
        showQRToScan: 'Show QR to be scanned',
        youHaveDonated: 'You\'ve donated!',
        errorDonating: 'An error happened while donating!',
        addressCopiedClipboard: 'Address copied to clipboard!',
        donate: 'Donate',
        donatingTo: 'Donating to {{communityName}}',
        donateWithCelo: 'Donate with Celo wallet',
        amountSymbol: 'Amount ({{symbol}})',
        close: 'Close',
        done: 'Done',
        youCanClaimXin: 'You can claim {{symbol}}{{amount}} in',
        claimX: 'Claim {{symbol}}{{amount}}',
        loading: 'Loading...',
        youHaveClaimedXoutOfY: 'You have claimed ${{claimed}} out of ${{max}}',
        hour: 'hour',
        day: 'day',
        week: 'week',
    },
    pt: {
        testnetWarning: 'Lembre-se que está a usar a testnet Alfajores - os balanços não são reais.',
        pendingApprovalMessage: 'Esta comunidade ainda não foi aprovada. Se você tem alguma questão, contacte-nos através de',
        pendingApproval: 'Pedido Pendente',
        fullDashboard: 'Painel Completo',
        editCommunityDetails: 'Editar detalhes da comunidade',
        viewAsPublic: 'Ver como publico',
        share: 'Partilhar',
        beneficiaries: 'Beneficiários',
        backers: 'Apoiantes',
        added: 'Adicionado',
        removed: 'Removido',
        addBeneficiary: 'Adicionar Beneficiário',
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
        ssi: 'Indice de Auto Sustentabilidade',
        ssiDescription: 'O SSI indica o quão auto-sustentável é uma comunidade e como ela progride ao longo do tempo, medindo a urgência dos seus beneficiários',
        seeMore: 'Ver Mais',
        seeLess: 'Ver Menos',
        exploreCommunityContract: 'Explorar o COntrato da Comunidade',
        edit: 'Editar',
        create: 'Criar',
        submit: 'Enviar',
        needLoginToCreateCommunity: 'Você necessita estar autenticado para criar uma comunidade.',
        communityDetails: 'Detalhes da Comunidades',
        createCommunityDescription: 'Ao criar uma comunidade, você está a criar um contrato em que todos os beneficiários adicionados por você têm acesso igual aos fundos arrecadados para esse contrato, com base em alguns parâmetros.',
        selectCoverImage: 'Selecione Imagem de Capa',
        changeCoverImage: 'Altere a Imagem de Capa',
        communityName: 'Nome da Comunidade',
        shortDescription: 'Pequena Descrição',
        city: 'Cidade',
        getGPSLocation: 'Obter Localização GPS',
        validCoordinates: 'Coordenadas Validas',
        email: 'Email',
        contractDetails: 'Detalhes do Contrato',
        claimAmount: 'Quantidade a Pedir',
        aroundValue: 'cerca de {{symbol}}{{amount}}',
        totalClaimPerBeneficiary: 'Quantidade total pedida por beneficiário',
        frequency: 'Frequência',
        hourly: 'Por Hora',
        daily: 'Diariamente',
        weekly: 'Semanalmente',
        timeIncrementAfterClaim: 'Incremento de tempo após cada pedido (em minutos)',
        visibility: 'Visibilidade',
        public: 'Publico',
        private: 'Privado',
        createCommunityNote1: 'Nota: Esses valores devem ser uma renda básica mínima suficiente para atender às necessidades básicas dos seus beneficiários. Eles podem pedir enquanto houver fundos disponíveis no contrato. Você terá a responsabilidade de promover a comunidade e arrecadar fundos.',
        createCommunityNote2: 'Se houver outra pessoa ou organização na sua comunidade que você considere mais adequada para impulsionar essa iniciativa, informe-os sobre essa possibilidade e incentive-os a criar uma comunidade.',
        failure: 'Falhou',
        success: 'Sucesso',
        requestNewCommunityPlaced: 'O seu pedido para criar uma nova comunidade foi registado!',
        claimBiggerThanMax: 'O valor a pedir deve ser maior que o máximo pedido!',
        claimNotZero: 'Quantidade a pedir deve ser superior a zero!',
        maxNotZero: 'Quantidade máxima a pedir deve ser superior a zero!',
        communityUpdated: 'Os dados da comunidade foram atualizados!',
        errorUpdatingCommunity: 'Ocorreu um erro enquanto atualizava os dados da comunidade!',
        errorCreatingCommunity: 'Ocorreu um erro enquanto era registado o pedido para criar uma comunidade!',
        anErroHappenedTryAgain: 'Ocorreu um erro, por favor, tente novamente!',
        toContinuePlease: 'Para continuar, por favor',
        connectToYourCeloWallet: 'Conecte-se á sua Carteira Celo',
        loginDescription1: 'O ImpactMarket opera na rede Celo, um sistema financeiro que cria condições de prosperidade para todos.',
        loginDescription2: 'Com a carteira Celo, você pode enviar dinheiro para qualquer pessoa no mundo apenas com um telemóvel.',
        step1: 'Passo 1',
        downloadCeloApp: 'Descarregue a aplicação Celo',
        step2: 'Passo 2',
        installCeloCreateAccount: 'Instale a aplicação Celo e crie uma conta Celo',
        finalStep: 'Ultimo Passo',
        connectCeloWallet: 'Conecte-se á carteira Celo',
        notNow: 'Agora não',
        beforeMovingInsertPin: 'Antes de continuar, por favor, introduza o PIN',
        continue: 'Continuat',
        yourQRCode: 'Seu código QR',
        scanToPay: 'Scan para Pagar',
        showQRToScan: 'Mostrar código QR para scannear',
        youHaveDonated: 'Você fez um donativo!',
        errorDonating: 'Um erro ocorreu durante o donativo!',
        addressCopiedClipboard: 'Endereço copiado para a área de transferência!',
        donate: 'Doar',
        donatingTo: 'A fazer um donativo para {{communityName}}',
        donateWithCelo: 'Doar com a carteira Celo',
        amountSymbol: 'Quantidade ({{symbol}})',
        close: 'Fechar',
        done: 'Feito',
        youCanClaimXin: 'Você pode pedir {{symbol}}{{amount}} dentro de',
        claimX: 'Pedir {{symbol}}{{amount}}',
        loading: 'A carregar...',
        youHaveClaimedXoutOfY: 'Você pediu ${{claimed}} de ${{max}}',
        hour: 'hora',
        day: 'dia',
        week: 'semana',
    },
};
// Set the locale once at the beginning of your app.
i18n.locale = Localization.locale;
// When a value is missing from a language it'll fallback to another language with the key present.
i18n.fallbacks = true;

export default i18n;