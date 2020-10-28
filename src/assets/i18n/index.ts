// import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
// import moment from 'moment';
import 'moment/locale/pt';

// Set the key-value pairs for the different languages you want to support.
i18n.translations = {
    en: {
        testnetWarning:
            "A friendly reminder you're using the Alfajores network build - the balances are not real.",
        pendingApprovalMessage:
            'This community is being reviewed. If you have any question please contact us at',
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
        pay: 'Send',
        wallet: 'Wallet',
        profile: 'Profile',
        balance: 'Balance',
        name: 'Name',
        currency: 'Currency',
        country: 'Country',
        phoneNumber: 'Phone Number',
        logout: 'Logout',
        recentTransactions: 'Recent Transactions',
        nameAddressPhone: 'Destinatary address',
        nameAddressPhoneNotFound: 'Address not found.',
        noteOptional: 'Note (optional)',
        recent: 'Recent destinataries',
        remove: 'Remove',
        beneficiaryAddress: 'Beneficiary Account No (address)',
        useText: 'Use Text',
        useCamera: 'Use Camera',
        tapToScanAgain: 'Tap to Scan Again',
        currentAddress: 'Current Address',
        allowCamera: 'Allow camera',
        moreAboutYourCommunity: 'About my community',
        ssi: 'Self-Sustainability Index',
        ssiDescription:
            'SSI measures how financially sustainable a community is, and its progress.',
        seeMore: 'See More',
        seeLess: 'See Less',
        exploreCommunityContract: 'See Community Contract',
        edit: 'Edit',
        create: 'Create',
        submit: 'Submit',
        needLoginToCreateCommunity:
            'You need to connect with Valora to create a community.',
        communityDetails: 'Community Details',
        createCommunityDescription:
            'By creating a new community, you are initiating a new basic income mechanism for your community where each beneficiary you add will have equal access to claim a recurring amount defined by you in this form.',
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
        aroundValue: '~ {{symbol}}{{amount}}',
        totalClaimPerBeneficiary: 'Total claim amount per beneficiary',
        frequency: 'Frequency',
        hourly: 'Hourly',
        daily: 'Daily',
        weekly: 'Weekly',
        timeIncrementAfterClaim: 'Time increment after each claim',
        timeInMinutes: 'Time in minutes',
        visibility: 'Visibility',
        public: 'Public',
        private: 'Private',
        createCommunityNote1:
            "Note: These parameters should be a minimum basic income that is sufficient to meet your beneficiaries' basic needs. They can claim while there are funds available in the contract. You will have the responsibility to promote your community and to raise funds for it.",
        createCommunityNote2:
            'If there is another person or organization among your community you believe is more suitable to drive this initiative, let them know about this possibility and encourage them to create a community.',
        failure: 'Failure',
        success: 'Success',
        requestNewCommunityPlaced:
            'Your request to create a new community was placed!',
        claimBiggerThanMax:
            'Claim Amount should not be bigger than Total claim amount per beneficiary!',
        claimNotZero: 'Claim Amount should not be zero!',
        maxNotZero: 'Total claim amount should not be zero!',
        communityUpdated: 'Your community was updated!',
        errorUpdatingCommunity:
            'An error happened while updating your community!',
        errorCreatingCommunity:
            'An error happened while placing the request to create a community!',
        anErroHappenedTryAgain: 'An error happened, please, try again.',
        toContinuePlease: 'To continue please',
        loginDescription1:
            'impactMarket operates on top of Celo network, an open and global financial platform.',
        loginDescription2: 'With Valora you can easily send and receive money.',
        step1: 'Step 1',
        step2: 'Step 2',
        createValoraAccount: 'Create an Valora account.',
        installValoraApp: 'Install Valora App',
        connectWithValora: 'Connect with Valora',
        notNow: 'Not now',
        beforeMovingInsertPin:
            'Before moving any further, please, insert your PIN', // pin is for moving dude!
        pin4Digits: 'PIN (4 digits)',
        continue: 'Continue',
        yourQRCode: 'Your QR Code',
        scanToPay: 'Scan to Pay',
        showQRToScan: 'Show QR to be scanned',
        youHaveDonated: 'Thank you for your donation!',
        errorDonating: 'An error happened while donating!',
        addressCopiedClipboard:
            'Community address copied to clipboard! Send only $cUSD (Celo Dollar) to this contract',
        donate: 'Donate',
        donateWithValora: 'Donate with Valora',
        amountSymbol: 'Amount ({{symbol}})',
        donateSymbol: 'Donate ({{symbol}})',
        close: 'Close',
        youCanClaimXin: 'You can claim {{symbol}}{{amount}} in',
        claimX: 'Claim {{symbol}}{{amount}}',
        loading: 'Loading...',
        youHaveClaimedXoutOfY: 'You have claimed ${{claimed}} out of ${{max}}',
        hour: 'hour',
        day: 'day',
        week: 'week',
        changePhoto: 'Change Photo',
        tryingToAddInvalidAddress: 'You are trying to add an invalid address!',
        errorSendingPayment: 'An error happened while sending the payment!',
        paymentSent: 'Payment done!',
        scanningInvalidAddress: 'You are trying to scan an invalid address!',
        select: 'Select',
        errorGettingGPSLocation:
            'An error happened while getting the GPS location.',
        errorWhileLoadingRestart:
            'An error happened while loading. Please restart the app.',
        beneficiaryWasRemoved: '{{beneficiary}} was successfully removed!',
        errorRemovingBeneficiary:
            'An error happened while removing the beneficiary.',
        addedNewBeneficiary: "You've successfully added a new beneficiary!",
        addingInvalidAddress: 'You are trying to add an invalid address!',
        errorAddingBeneficiary:
            'An error happened while adding the beneficiary.',
        oneTimeWelcomeMessage1:
            'impactMarket enables any community to create its own unconditional basic income system for their beneficiaries, where each member can claim a fixed amount on a regular basis',
        oneTimeWelcomeMessage2:
            'Anyone can back those beneficiaries by donating directly to their communities.',
        exploreCommunities: 'Explore Communities',
        noFunds: 'No Funds',
        notFundsToAddBeneficiary:
            'Your community does not has enough funds! You need at least $0.05 cUSD in the contract to add a beneficiary.',
        claimExplained1:
            'Each community has a group of beneficiaries, added by the coommunity managers, that can access a basic income under a set of rules. For example, each beneficiary can claim $1/day up to $500.',
        claimExplained2:
            'There is a minimum time you have to wait before being able to claim again, but there is no maximum. You should only claim when you need those funds. The more you claim, the more time you have to wait to claim again.',
        claimAmountHelp:
            'This is the UBI amount, in $cUSD, that each beneficiary will be able to claim each time from this community contract. For example, each beneficiary can claim $2 from the contract on a regular basis, while there are funds available.',
        totalClaimPerBeneficiaryHelp:
            'This value is the limit each beneficiary can get in total after several claims. For example, each beneficiary can claim $2/day until it reaches a total of $1,000, meaning that each beneficiary will have access to a UBI ($2/day) for at least 16 months. This time can increase if minutes are added to the Time increment.',
        frequencyHelp:
            'Each beneficiary will be able to access a basic income on a regular basis, that can be daily or weekly. For example, if daily, each beneficiary will have to wait at least 1 day (24h) before being able to claim again (more $2).',
        timeIncrementAfterClaimHelp:
            'It is possible to add a time increment each time a beneficiary claims. For example, in a community where each beneficiary can claim $2/day, 20 minutes can be added to the time that that beneficiary will have to wait before being able to claim again (in this case, 24h20m after claiming for the 2nd time, 24h40m after the 3rd time, and so on). This benefits those who claimed less and incentivizes self-sustainability progress.',
        visibilityHelp:
            'A community can be public (need our approval to be listed on the app), or private where anyone can create its own UBI and will not show up on the communities list.',
        currencyHelp: 'Choose the currency used among the beneficiaries.',
        coverImageRequired: 'Cover image is required!',
        communityNameRequired: 'Comunity name is required!',
        communityDescriptionRequired: 'Comunity description is required!',
        cityRequired: 'City is required!',
        countryRequired: 'Country is required!',
        enablingGPSRequired: 'Enabling GPS is required!',
        emailRequired: 'Email address is invalid!',
        claimAmountRequired: 'Claim amount is required!',
        maxClaimAmountRequired: 'Max claim amount is required!',
        incrementalIntervalRequired: 'Incremental interval is required!',
        turnOn: 'Turn On',
        turnOnLocationHint: 'Turn on your location for a better experience.',
        tryAgain: 'Try Again',
        payConfirmMessage:
            "By pressing 'Send', you will send {{symbol}}{{amount}} (${{amountInDollars}} cUSD) to {{to}}",
        donateConfirmMessage:
            "By pressing 'Donate', you will donate {{symbol}}{{amount}} (${{amountInDollars}} cUSD) to {{to}}",
        yourDonationWillBackFor:
            'It will back {{backNBeneficiaries}} beneficiaries for {{backForDays}}+ days.',
        eachBeneficiaryCanClaimXUpToY:
            'Each beneficiary can claim ~{{communityCurrency}}{{claimXCCurrency}} (${{claimX}} cUSD) per day, up till ${{upToY}} cUSD. Each claim adds {{minIncrement}} min to its waiting interval.',
        nextTimeWillWaitClaim:
            'Next time you will have to wait at least {{nextWait}}.',
        knowHowClaimWorks: 'How claims work.',
        copyContractAddress: 'Copy Contract Address',
        donationBiggerThanBalance:
            'You are trying to donate an amount bigger than your balance. Add funds on your Valora app.',
        errorClaiming: 'An error happened while claiming.',
        consentAnonymousAnalytics: 'Consent Anonymous Analytics',
        youCreatedPrivateCommunity:
            "You've created a private community. Welcome!",
        youAreNotConnected:
            'You are not connected to your Valora. Connect to send directly.',
        errorConnectToValora:
            'An error happened while connecting to Valora. Please, try again.',
        addingYourOwnAddress:
            'You are trying to add your own address. Are you sure?',
        alreadyInCommunity:
            'You are trying to add an address that already is in this community!',
        requestingPermission: 'Questing Permission',
        requestCameraPermission:
            'impactMarket requires permission to use your camera in order to scan the QR code.',
        claimedSince: '{{symbol}}{{amount}} claimed since {{date}}',
        language: 'Language',
        update: 'Update',
        skip: 'Skip',
        newVersionAvailable: 'New version available',
        newVersionAvailableMessage: 'To get the latest improvements and features we need you to update to the latest version.'
    },
    pt: {
        testnetWarning:
            'Lembre-se que está a usar a testnet Alfajores - os balanços não são reais.',
        pendingApprovalMessage:
            'Esta comunidade ainda não foi aprovada. Alguma questão, contacte-nos',
        pendingApproval: 'Pedido Pendente',
        fullDashboard: 'Painel Completo',
        editCommunityDetails: 'Editar detalhes da comunidade',
        viewAsPublic: 'Ver página da comunidade',
        share: 'Partilhar',
        beneficiaries: 'Beneficiários',
        backers: 'Apoiantes',
        added: 'Adicionado',
        removed: 'Removido',
        addBeneficiary: 'Adicionar Beneficiário',
        add: 'Adicionar',
        cancel: 'Fechar',
        claimed: 'Distribuído',
        raised: 'Angariado',
        claim: 'Pegar',
        manage: 'Gerir',
        communities: 'Comunidades',
        pay: 'Enviar',
        wallet: 'Carteira',
        profile: 'Perfil',
        balance: 'Balanço',
        name: 'Nome',
        currency: 'Moeda',
        country: 'País',
        phoneNumber: 'Número de telemóvel',
        logout: 'Sair',
        recentTransactions: 'Transações Recentes',
        nameAddressPhone: 'Endereço do destinatário',
        nameAddressPhoneNotFound: 'Não encontrado.',
        noteOptional: 'Nota (opcional)',
        recent: 'Recentes',
        remove: 'Remover',
        beneficiaryAddress: 'Conta do Beneficiario',
        useText: 'Usar Texto',
        useCamera: 'Usar Camera',
        tapToScanAgain: 'Clique para tentar de novo',
        currentAddress: 'Endereço Atual',
        allowCamera: 'Permitir camera',
        moreAboutYourCommunity: 'Sobre a minha comunidade',
        ssi: 'Índice de Autossustentabilidade',
        ssiDescription:
            'SSI mede a sustentabilidade financeira de uma comunidade.',
        seeMore: 'Ver Mais',
        seeLess: 'Ver Menos',
        exploreCommunityContract: 'Ver Contrato da Comunidade',
        edit: 'Editar',
        create: 'Criar',
        submit: 'Enviar',
        needLoginToCreateCommunity:
            'É necessário estar conectado com a app Valora para criar uma comunidade.',
        communityDetails: 'Detalhes da Comunidade',
        createCommunityDescription:
            'Ao criar uma comunidade, um novo contrato de renda mínima é iniciado, onde todos os beneficiários adicionados terão acesso igual aos fundos nesse contrato, de forma regular.',
        selectCoverImage: 'Selecione Imagem de Capa',
        changeCoverImage: 'Altere a Imagem de Capa',
        communityName: 'Nome da Comunidade',
        shortDescription: 'Descrição',
        city: 'Cidade',
        getGPSLocation: 'Obter Localização GPS',
        validCoordinates: 'Coordenadas Validas',
        email: 'Email',
        contractDetails: 'Detalhes do Contrato',
        claimAmount: 'Montante por Pedido',
        aroundValue: '~ {{symbol}}{{amount}}',
        totalClaimPerBeneficiary: 'Montante total por beneficiário',
        frequency: 'Frequência',
        hourly: 'Por Hora',
        daily: 'Diariamente',
        weekly: 'Semanalmente',
        timeIncrementAfterClaim: 'Incremento de tempo após cada pedido',
        timeInMinutes: 'Tempo em minutos',
        visibility: 'Visibilidade',
        public: 'Publico',
        private: 'Privado',
        createCommunityNote1:
            'Nota: Esses valores devem ser uma renda básica mínima suficiente para atender às necessidades básicas dos seus beneficiários. Quem cria a comunidade tem a responsabilidade de a promover, gerir e angariar fundos.',
        createCommunityNote2:
            'Se existir outra pessoa ou organização social na sua comunidade que seja mais adequada para gerir esta iniciativa, informe sobre esta possibilidade e incentive a criar uma comunidade.',
        failure: 'Falhou',
        success: 'Sucesso',
        requestNewCommunityPlaced:
            'O seu pedido para criar uma nova comunidade foi registado! Validação a decorrer.',
        claimBiggerThanMax:
            'O valor por pedido deve ser inferior ao valor total!',
        claimNotZero: 'Montante por Pedido deve ser superior a zero!',
        maxNotZero: 'Montante total por beneficiário deve ser superior a zero!',
        communityUpdated: 'Os dados da comunidade foram atualizados!',
        errorUpdatingCommunity:
            'Ocorreu um erro enquanto atualizava os dados da comunidade!',
        errorCreatingCommunity:
            'Ocorreu um erro enquanto era registado o pedido para criar uma comunidade!',
        anErroHappenedTryAgain: 'Ocorreu um erro, por favor, tente novamente!',
        toContinuePlease: 'Para continuar, deverá',
        loginDescription1:
            'impactMarket opera na rede Celo, um sistema financeiro aberto focado em criar prosperidade para todos.',
        loginDescription2:
            'Com a carteira Valora, pode enviar e receber dinheiro usando apenas um telemóvel.',
        step1: 'Step 1',
        step2: 'Step 2',
        createValoraAccount: 'Criar conta com Valora',
        installValoraApp: 'Instalar aplicativo Valora',
        connectWithValora: 'Conectar com Valora',
        notNow: 'Agora não',
        beforeMovingInsertPin: 'Antes de continuar, por favor, introduza o PIN',
        pin4Digits: 'PIN (4 digitos)',
        continue: 'Continuar',
        yourQRCode: 'Seu código QR',
        scanToPay: 'Scan para Pagar',
        showQRToScan: 'Mostrar código QR',
        youHaveDonated: 'Obrigado pelo seu donativo!',
        errorDonating: 'Um erro ocorreu durante o donativo!',
        addressCopiedClipboard:
            'Endereço da comunidade copiado! Envie apenas $cUSD (Celo Dollar) para este contrato.',
        donate: 'Contribuir',
        donateWithValora: 'Doar com Valora',
        amountSymbol: 'Montante em {{symbol}}',
        donateSymbol: 'Contribuir {{symbol}}',
        close: 'Fechar',
        youCanClaimXin: 'Poderá pegar {{symbol}}{{amount}} em',
        claimX: 'Pegar {{symbol}}{{amount}}',
        loading: 'A carregar...',
        youHaveClaimedXoutOfY: 'Já recebeu ${{claimed}} em ${{max}}',
        hour: 'hora',
        day: 'dia',
        week: 'semana',
        changePhoto: 'Alterar foto',
        scanningInvalidAddress: 'Esse endereço parece inválido!',
        select: 'Selecionar',
        errorGettingGPSLocation: 'Ocorreu um erro ao obter a localização GPS.',
        errorWhileLoadingRestart:
            'Ocorreu eu erro ao iniciar. Por favor reinicie.',
        beneficiaryWasRemoved: '{{beneficiary}} foi removido com sucesso!',
        errorRemovingBeneficiary:
            'Ocorreu um erro enquanto removia o beneficiário.',
        addedNewBeneficiary: 'Um novo beneficiário foi adicionado com sucesso!',
        addingInvalidAddress: 'Está a tentar adicionar um endereço inválido!',
        errorAddingBeneficiary: 'Ocorreu um erro ao adicionar o beneficiário.',
        oneTimeWelcomeMessage1:
            'impactMarket é um sistema de rendimento mínimo incondicional, que permite que qualquer comunidade crie o seu próprio sistema de distribuição de rendimento entre os seus beneficiários, de forma independente e decentralizada',
        oneTimeWelcomeMessage2:
            'Pode apoiar esses beneficiários doando diretamente para as suas comunidades.',
        exploreCommunities: 'Explorar Comunidades',
        noFunds:
            'Não existem fundos disponiveis de momento. Tente novamente mais tarde.',
        notFundsToAddBeneficiary:
            'A comunidade não tem fundos suficientes! $0.05 serão enviados ao beneficiário quando adicionado.',
        claimExplained1:
            'Cada comunidade possui um grupo de beneficiários, adicionados pelos gestores da comunidade, que podem aceder um rendimento mínimo, de acordo com um conjunto de regras. Por exemplo, cada beneficiário pode pegar $1/dia até $500.',
        claimExplained2:
            'Existe um tempo minimo que terá de esperar antes de poder pegar novamente, mas não tem tempo máximo. Deverá pegar apenas quando precisa. Quanto mais pegar, mais tempo terá de esperar antes de poder pegar novamente.',
        claimAmountHelp:
            'Este é o montante UBI, em $cUSD (dólar americano), que cada beneficiário poderá reivindicar/pedir/pegar de cada vez deste contrato comunitário. Por exemplo, cada beneficiário pode reivindicar $2 do contrato regularmente, enquanto tiver fundos disponíveis.',
        totalClaimPerBeneficiaryHelp:
            'Este montante é o limite que cada beneficiário pode obter no total após várias pedidos. Por exemplo, cada beneficiário pode pegar $2 por dia até atingir um total de $1000, o que significa que cada beneficiário terá acesso a um rendimento mínimo de $2/dia durante pelo menos 16 meses. Este tempo pode aumentar se a opção de incremento de tempo dessa comunidade for superior a zero.',
        frequencyHelp:
            'Cada beneficiário terá acesso a uma renda básica de forma regular, que pode ser diária ou semanal. Por exemplo, se for diário, cada beneficiário terá que esperar pelo menos 1 dia (24h) antes de poder pegar novamente (mais $2).',
        timeIncrementAfterClaimHelp:
            'É possível adicionar um incremento de tempo cada vez que um beneficiário reclama. Por exemplo, numa comunidade onde cada beneficiário pode pegar $2/dia, 20 minutos podem ser adicionados ao tempo que esse beneficiário terá que esperar antes de poder pegar novamente (neste caso, 24h20m após pegar pela 2ª vez, 24h40m após a 3ª vez, e assim por diante). Isto beneficia quem pede menos e incentiva uma transição para auto-sustentabilidade.',
        visibilityHelp:
            'Uma comunidade pode ser publica (necessita da aprovação da equipada impactMarket) ou privada que não necessita de aprovação nem aparecerá na lista de comunidades.',
        currencyHelp: 'Escolha aqui a moeda usada entre os seus beneficiários.',
        coverImageRequired: 'Imagem de capa é obrigatório!',
        communityNameRequired: 'Nome da comunidade é obrigatório!',
        communityDescriptionRequired: 'Descrição da comunidade é obrigatório!',
        cityRequired: 'Cidade é obrigatório!',
        countryRequired: 'País é obrigatório!',
        enablingGPSRequired: 'Ativar o GPS é obrigatório!',
        emailRequired: 'Endereço de e-mail é obrigatório!',
        claimAmountRequired: 'Quantidade a pegar é obrigatório!',
        maxClaimAmountRequired: 'Quantidade máxima a pegar é obrigatório!',
        incrementalIntervalRequired: 'Intervalo de incremento é obrigatório!',
        turnOn: 'Ativar',
        turnOnLocationHint:
            'Ative a sua localização para uma melhor experiência.',
        tryAgain: 'Tentar Novamente',
        payConfirmMessage:
            "Ao selecionar 'Enviar', irá enviar {{symbol}}{{amount}} (${{amountInDollars}} cUSD) para {{to}}",
        donateConfirmMessage:
            "Ao selecionar 'Contribuir', irá enviar {{symbol}}{{amount}} (${{amountInDollars}} cUSD) para {{to}}",
        yourDonationWillBackFor:
            'Apoiará {{backNBeneficiaries}} beneficiários por {{backForDays}}+ dias.',
        eachBeneficiaryCanClaimXUpToY:
            'Cada beneficiário pode aceder a ~{{communityCurrency}}{{claimXCCurrency}} (${{claimX}} cUSD) por dia, até acumular ${{upToY}} cUSD. A cada pedido, {{minIncrement}} minutos são adicionados ao tempo de espera.',
        nextTimeWillWaitClaim:
            'Na próxima terá de esperar pelo menos {{nextWait}}.',
        knowHowClaimWorks: 'Como funciona?',
        copyContractAddress: 'Copiar Endereço do Contrato',
        donationBiggerThanBalance:
            'Não tem saldo suficiente para contribuir com este montante. Aumente o seu saldo na Valora.',
        errorClaiming:
            'O erro ocorreu ao tentar pegar. Tente novamente mais tarde.',
        consentAnonymousAnalytics:
            'Aceitar enviar dados anonimos para análises',
        youCreatedPrivateCommunity:
            'Você criou uma comunidade privada. Seja bem vindo.',
        youAreNotConnected:
            'Você não está conectado á sua Valora. Conecte-se para submeter diretamente.',
        errorConnectToValora:
            'Ocorreu um erro enquanto se conectava á Valora. Por favor, tente novamente.',
        addingYourOwnAddress:
            'Você está a tentar adicionar o seu endereço. Tem certeza?',
        alreadyInCommunity:
            'Você está a tentar adicionar um endereço que já está nesta comunidade!',
        requestingPermission: 'Perdido de permissão',
        requestCameraPermission:
            'impactMarket necessita ter acesso á camera para poder realizar scan do código QR.',
        claimedSince: 'Recebeu {{symbol}}{{amount}} desde {{date}}',
        language: 'Idioma',
        update: 'Atualizar',
        skip: 'Mais Tarde',
        newVersionAvailable: 'Nova versão disponível',
        newVersionAvailableMessage: 'Para obter as melhorias e recursos mais recentes, precisamos que você atualize para a versão mais recente.'
    },
};
// Set the locale once at the beginning of your app.
// i18n.locale = Localization.locale;
// moment.locale(Localization.locale);
// When a value is missing from a language it'll fallback to another language with the key present.
i18n.fallbacks = true;

export default i18n;

export const supportedLanguages = ['en', 'pt'];
