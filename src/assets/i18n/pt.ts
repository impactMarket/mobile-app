export default {
    errors: {
        network: {
            connectionLost: 'A ligação à internet foi perdida.',
            rpc: 'Serviço RPC indisponivel. Tente novamente mais tarde.',
        },
        sync: {
            issues:
                'Parece que ocorreu um problema de sincronização. Por favor tente novamente.',
            possiblyValora:
                "Parece que a sua valora não está sincronizada com a rede. Por favor, abra a Valora e certifique-se que não tem nenhuma mensagem como 'Connecting...'",
            clock:
                'Parece que sua data ou hora está incorreta. Por favor corriga antes de tentar novamente.',
        },
        modals: {
            valora: {
                title: 'Request timeout',
                description:
                    'Sua solicitação de conexão foi perdida. Por favor, tente novamente ou visite nosso FAQ.',
            },
            clock: {
                title: 'Data/Hora incorreta',
                description:
                    'Detectámos que o seu dispositivo pode ter a data/hora ajustada incorrectamente. Por favor, abra as definições e corrija para {{serverTime}}. A sua hora é actualmente {{userTime}}. Após terminar, reinicie o aplicativo.',
            },
            title: 'Ooops!',
            description:
                'Algo de errado aconteceu. Por favor tente novamente mais tarde.',
        },
        unknown: 'Desconhecido.',
        notEnoughForTransaction:
            'Você não tem saldo suficiente para submeter o pedido. As transações na Celo são quase grátis, mas não totalmente grátis. Mantenha sempre alguns centavos na sua conta.',
        scanningAddress: 'Esse endereço parece inválido!',
        gettingGPS: 'Ocorreu um erro ao obter a localização GPS.',
        uploadingAvatar:
            'Ocorreu um erro enquanto atualizavámios sua foto de perfil. Por favor tente novamente.',
        generic: 'Ocorreu um erro, por favor, tente novamente.', // this will be deprecated
        loadingApp:
            'Infelizmente, ocorreu um erro inesperado ao carregar o aplicativo. Reinicie o aplicativo e tente novamente.',
        notAllowedToDeleteProfile:
            'Você não pode apagar a sua conta. Uma comunidade tem de ter pelo menos dois gestores ativos.',
    },
    permissions: {
        title: 'Perdido de permissão',
        cameraMessage: 'impactMarket necessita ter acesso á camera.',
        allowCamera: 'Permitir camera', // TODO: this should be replaced
    },
    generic: {
        testnetWarning:
            'Lembre-se que está a usar a testnet Alfajores - os balanços não são reais.',
        share: 'Partilhar',
        beneficiaries: 'Beneficiários',
        backers: 'Apoiante',
        backers_plural: 'Apoiantes',
        or: 'ou',
        ok: 'Ok',
        cancel: 'Fechar',
        confirm: 'Confirmar',
        raisedFrom: 'Angariado por {{backers}}',
        goal: 'Alvo',
        ubi: 'UBI',
        manage: 'Gerir',
        communities: 'Comunidades',
        name: 'Nome',
        currency: 'Moeda',
        cityCountry: 'Cidade, País',
        moreAboutYourCommunity: 'Sobre a minha comunidade',
        added: 'Adicionado',
        removed: 'Removido',
        remove: 'Remover',
        create: 'Criar',
        submit: 'Enviar',
        submitting: 'Enviando',
        yes: 'Sim',
        no: 'Não',
        failure: 'Falhou',
        success: 'Sucesso',
        email: 'Email',
        upload: 'Carregar',
        continue: 'Continuar',
        yourQRCode: 'Seu código QR',
        close: 'Fechar',
        faq: 'FAQ',
        oneTimeWelcomeMessage1:
            'impactMarket é um sistema de rendimento mínimo incondicional, que permite que qualquer comunidade crie o seu próprio sistema de distribuição de rendimento entre os seus beneficiários, de forma independente e decentralizada',
        exploreCommunities: 'Explorar Comunidades',
        day: 'dia',
        days: 'dia',
        days_plural: 'dias',
        week: 'semana',
        select: 'Selecionar',
        openHelpCenter: 'Abrir o Centro de Ajuda',
        knowMoreHelpCenter: 'Saiba mais em nosso Centro de Ajuda',
        turnOn: 'Ativar',
        turnOnLocationHint:
            'Ative a sua localização para uma melhor experiência.',
        tryAgain: 'Tentar Novamente',
        youAreNotConnected:
            'Você não está conectado á sua Valora. Conecte-se para submeter diretamente.',
        language: 'Idioma',
        update: 'Atualizar',
        skip: 'Mais Tarde',
        newVersionAvailable: 'Nova versão disponível',
        newVersionAvailableMessage:
            'Para obter as melhorias e recursos mais recentes, precisamos que você atualize para a versão mais recente.',
        offline: 'Você não está conectado à internet.',
        openClockSettings: 'Abrir definições data/hora',
        dismiss: 'Fechar',
        backWithSymbol: '< Voltar',
        order: 'Ordem',
        nearest: 'Mais próxima',
        bigger: 'Mais beneficiários',
        pleaseWait: 'Por favor aguarde...',
        thankYou: 'Obrigado!',
        search: 'Pesquisar',
        noResults: 'Nenhum resultado!',
        viewAll: 'Ver Todas',
        notInComunity: 'Não estás associado a nenhuma comunidade!',
        delete: 'Apagar',
        story: 'Story',
        descriptionCopiedClipboard:
            'Descrição copiada para a área de transferência!',
        welcome: 'Bem Vindo!',
        translatedFrom: 'Traduzido de {{from}}',
    },
    createCommunity: {
        recoverForm: {
            title: 'Continuar submissão',
            message:
                'Salvámos a sua candidatura anterior. Quer continuar a editá-lo?',
        },
        leave: {
            title: 'Deixar formulário',
            message:
                'Toda a informação que forneceu neste formulário estará disponível na próxima vez.',
        },
        alert:
            'Após o envio, entraremos em contacto com você dentro de poucas semanas.',
        pendingApprovalMessage:
            'Estamos revisando seu envio e entraremos em contato dentro de poucas semanas. Se você tiver outras perguntas, visite nossa Central de Ajuda para ler nosso F.A.Q.s ou enviar um tíquete.',
        applyCommunity: 'Criar Comunidade',
        editCommunity: 'Editar',
        communityDetails: 'Detalhes da Comunidade',
        communityDescriptionLabel:
            'Fale mais sobre sua comunidade e por que o acesso a uma renda básica pode ser importante para seus membros.',
        contractIncrementTitle: 'Incremento de tempo total após cada pedido',
        contractDescriptionLabel:
            'Esses valores devem ser uma renda básica mínima suficiente para atender às necessidades básicas de seus beneficiários. Eles poderão reclamar enquanto houver fundos disponíveis no contrato. Você terá a responsabilidade de promover sua comunidade e de arrecadar fundos para isso.\n\nSe houver outra pessoa ou organização em sua comunidade que você acredita ser mais adequada para conduzir esta iniciativa, informe-a sobre essa possibilidade e incentive-a a criar uma comunidade.',
        imageDimensionsNotFit: 'Selecione uma imagem com as dimensões corretas',
        changeCoverImage: 'Imagem de Capa',
        changeProfileImage: 'Sua Imagem de Perfil',
        minProfilePictureSize: 'Min. 300px por 300px',
        communityName: 'Nome da Comunidade',
        shortDescription: 'Descrição (Min 240 Caractéres)',
        contractDetails: 'Detalhes do Contrato',
        claimAmount: 'Montante por Pedido',
        aroundValue: 'Em média {{amount}}',
        totalClaimPerBeneficiary: 'Montante total por beneficiário',
        frequency: 'Frequência',
        incrementalFrequency: 'Tempo Incremental',
        daily: 'Diariamente',
        weekly: 'Semanalmente',
        minutes: 'Minutos',
        hours: 'Horas',
        days: 'Dias',
        time: 'Tempo',
        minCoverSize: 'Min. 784px por 784px',
        expectedUBIDuration:
            'Este programa de RBU deverá durar pelo menos {{years}} anos {{months}} meses {{days}} dias {{hours}} horas {{minutes}} minutos por beneficiário.',
        timeIncrementAfterClaim: 'Incremento de tempo após cada pedido',
        timeInMinutes: 'Tempo em minutos',
        visibility: 'Visibilidade',
        public: 'Publico',
        private: 'Privado',
        communityPicsImportance:
            'P.S: Comunidades com todos os detalhes preenchidos, incluindo as fotos dos gestores, têm maior probabilidade de serem financiadas.',
        communityRequestSending:
            'Aguarde enquanto as informações da comunidade estão sendo carregadas ...',
        communityRequestCancel:
            'Você tem certeza que pretende cancelar o pedido?',
        missingFieldError:
            'Todos os campos marcados como obrigatórios precisam ser informados. Verifique o que está faltando e tente novamente. ',
        communityRequestError:
            'Ocorreu um erro ao enviar as informações da comunidade.',
        communityRequestSuccess:
            'As informações da sua comunidade foram enviadas com sucesso.',
        claimBiggerThanMax:
            'O valor por pedido deve ser inferior ao valor total!',
        claimNotZero: 'Montante por Pedido deve ser superior a zero!',
        maxNotZero: 'Montante total por beneficiário deve ser superior a zero!',
        claimAmountHelp:
            'Este é o montante UBI, em $cUSD (dólar americano), que cada beneficiário poderá reivindicar/pedir/pegar de cada vez deste contrato comunitário. Por exemplo, cada beneficiário pode reivindicar $2 do contrato regularmente, enquanto tiver fundos disponíveis.',
        totalClaimPerBeneficiaryHelp:
            'Este montante é o limite que cada beneficiário pode obter no total após várias pedidos. Por exemplo, cada beneficiário pode pegar $2 por dia até atingir um total de $1000, o que significa que cada beneficiário terá acesso a um rendimento mínimo de $2/dia durante pelo menos 16 meses. Este tempo pode aumentar se a opção de incremento de tempo dessa comunidade for superior a zero.',
        frequencyHelp:
            'Cada beneficiário terá acesso a uma renda básica de forma regular, que pode ser diária ou semanal. Por exemplo, se for diário, cada beneficiário terá que esperar pelo menos 1 dia (24h) antes de poder pegar novamente (mais $2).',
        timeIncrementAfterClaimHelp:
            'É possível adicionar um incremento de tempo cada vez que um beneficiário recebe. Por exemplo, numa comunidade onde cada beneficiário pode pegar $2/dia, 20 minutos podem ser adicionados ao tempo que esse beneficiário terá que esperar antes de poder pegar novamente (neste caso, 24h20m após pegar pela 2ª vez, 24h40m após a 3ª vez, e assim por diante). Isto beneficia quem pede menos e incentiva uma transição para auto-sustentabilidade.',
        visibilityHelp:
            'Uma comunidade pode ser publica (necessita da aprovação da equipe da impactMarket) ou privada que não necessita de aprovação nem aparecerá na lista de comunidades.',
        coverImageRequired: 'Imagem de capa é obrigatório!',
        profileImageRequired: 'Sua Imagem de Perfil é obrigatória!',
        communityNameRequired: 'Nome da comunidade é obrigatório!',
        communityDescriptionRequired: 'Descrição da comunidade é obrigatório!',
        communityDescriptionTooShort: 'Esta descrição é muito curta!',
        cityCountryRequired: 'A localização é obrigatório!',
        emailRequired: 'Endereço de e-mail é obrigatório!',
        emailInvalidFormat: 'Endereço de e-mail inválido!',
        claimAmountRequired: 'Quantidade a pegar é obrigatório!',
        maxClaimAmountRequired: 'Quantidade máxima a pegar é obrigatório!',
        incrementalIntervalRequired: 'Intervalo de incremento é obrigatório!',
        incrementalIntervalUnitRequired:
            'Unidade de intervalo de incremento é obrigatório!',
        baseIntervalRequired: 'Frequência é obrigatório!',
    },
    manager: {
        rules: {
            title: 'Regras Importantes',
            btnText: 'Eu li e compreendo',
            first:
                'Como gestor, você terá a responsabilidade de selecionar quais beneficiários terão acesso à renda básica. Quanto mais pessoas tiverem acesso em sua comunidade, mais difícil será ter fundos disponíveis para todos o tempo todo, então tome cuidado ao escolher quem pode / deve se beneficiar e realmente precisa disso. ',
            second:
                'Este aplicativo usa tecnologia blockchain para identificar fraude em potencial e uso de fundos suspeitos, Para que tudo o que aconteça, incluindo todas as transações, seja público e transparente.',
            third:
                'O seu perfil pode ser bloqueado e os fundos podem ser impedidos de serem distribuídos aos beneficiários se atividades suspeitas forem encontradas ou relatadas. Isso pode resultar na remoção de sua comunidade e organização do sistema. ',
            fourth: 'Não adicione beneficiários que já foram removidos.',
            fifth: 'Não peça dinheiro aos beneficiários.',
            sixth: 'Não adicione mais de uma conta por pessoa e dispositivo.',
            seventh:
                'As informações do seu perfil devem ser completas e precisas.',
            warning:
                'Se você encontrar atividades suspeitas entre os beneficiários, avise-nos, pois isso será considerado uma ação de boa-fé que pode evitar que toda a comunidade seja afetada por causa de alguns maus atores.',
        },
        noFunds:
            'Não existem fundos disponiveis de momento. Tente novamente mais tarde.',
        notFundsToAddBeneficiary:
            'A comunidade não tem fundos suficientes! $0.05 serão enviados ao beneficiário quando adicionado.',
        addingInvalidAddress: 'Está a tentar adicionar um endereço inválido!',
        addingYourOwnAddress:
            'Você está a tentar adicionar o seu endereço. Tem certeza?',
        alreadyInCommunity:
            'Você está a tentar adicionar um endereço que já está nesta comunidade!',
        errorRemovingBeneficiary:
            'Ocorreu um erro enquanto removia o beneficiário.\n\nErro: {{error}}',
        userWasRemoved: '{{user}} foi removido com sucesso!',
        errorAddingBeneficiary:
            'Ocorreu um erro ao adicionar o beneficiário.\n\nErro: {{error}}',
        addedNewBeneficiary: 'Um novo beneficiário foi adicionado com sucesso!',
        errorAddingManager:
            'Ocorreu um erro ao adicionar o gestor.\n\nErro: {{error}}',
        addedNewManager: 'Um novo gestor foi adicionado com sucesso!',
        errorRemovingManager:
            'Ocorreu um erro enquanto removia o gestor.\n\nErro: {{error}}',
        claimedSince: 'Recebeu {{amount}} desde {{date}}',
        editCommunityDetails: 'Editar detalhes da comunidade',
        viewAsPublic: 'Ver página da comunidade',
        addBeneficiary: 'Adicionar Beneficiário',
        beneficiaryAddress: 'Conta do Beneficiario',
        managerAddress: 'Conta do Gestor',
        addManager: 'Adicionar Gestor',
        managers: 'Gestores',
        notAnUser:
            'O endereço que está a tentar adicionar não é um utilizador.',
        managerSince: 'Gestor desde {{date}}',
        ubiParamsUpdated:
            'Parâmetros UBI da sua comunidade foram atualizados com sucesso!',
        ubiParams: 'Parâmetros UBI',
        ubiParamsChanged:
            'Parâmetros UBI da sua comunidade vão ser alterados! Os novos parâmetros vão ser os seguintes:',
        acceptNewUbiParams: 'Aceitar novos parâmetros',
        userNotRegistered:
            'O utilizador que está a tentar adicionar, não está registado!',
        welcomeManagerTitle: 'Você agora é um gestor da {{ communityName }}',
    },
    stories: {
        stories: 'Stories',
        description: 'Mensagem da Story · Opcional',
        emptyStoriesTitle: 'Ainda não criou uma story?',
        emptyStoriesDescription:
            'Não perca tempo, e comece a criar agora mesmo!',
        storyCongrat: 'Parabéns, sua story foi submetida!',
        storyRules: 'Regras Importantes',
        storyRulesFirstParagraph:
            'Compartilhar suas histórias ajudará sua comunidade a arrecadar mais fundos. Não compartilhe nenhum conteúdo (texto ou imagem) que infrinja nossas regras, pois ele será excluído e você poderá ser removido de sua comunidade.',
        storySubTitle: 'As histórias não devem conter nenhum dos seguintes:',
        storyRulesSecondParagraph:
            'Violência, terrorismo / extremismo violento, exploração sexual infantil, abuso / assédio, conduta de ódio, suicídio ou automutilação, mídia sensível, bens ou serviços ilegais ou regulamentados, nudez, nudez não consensual, integridade cívica, falsificação de identidade, sintético e mídia manipulada e direitos autorais e marcas registradas.',
        newStory: 'Nova Story',
        reportInapropriateSuccess: 'Sua denuncia foi submetida com sucesso.',
        reportAsInapropriated: 'Denunciar como inapropriada',
        reportedAsInapropriated: 'Denunciada como inapropriada',
        deleteSuccess: 'Sua story foi apagada com sucesso.',
        reportInapropriateWarning:
            'Tem certeza que deseja denunciar esta story como inapropriada?',
        deleteWarning: 'Tens certeza que quer apagar esta story?',
        storyFailure: 'Erro ao submeter sua story!',
        emptyStoryFailure:
            'Por favor, assegure que a sua story possui texto ou imagem.',
        createStory: 'Criar Story',
        myStories: 'Minhas Stories',
    },
    beneficiary: {
        rules: {
            title: 'Regras importantes',
            btnText: 'Eu li e entendo',
            first:
                'Este dinheiro é só seu e incondicional para usar no que você precisar.',
            second:
                'Use apenas 1 conta por pessoa. Usar mais contas por pessoa / dispositivo irá bloqueá-lo e sua comunidade será identificada como um risco para os doadores enviarem fundos. ',
            third:
                'Recomendamos que você tenha seu perfil preenchido com informações verdadeiras.',
            fourth: 'Não compartilhe sua chave de conta Valora com ninguém.',
            fifth:
                'Todas as atividades e transações são públicas e transparentes, então é mais fácil para qualquer pessoa identificar e verificar possíveis fraudes. Uma vez que o sistema detecta uma atividade fraudulenta em potencial, os fundos podem ser cortados para toda a comunidade. ',
            sixth:
                'Os fundos são alocados e priorizados para as comunidades com base em seus níveis de risco e atividades suspeitas.',
            seventh:
                'Se seus gerentes lhe pedirem dinheiro para participar do programa, informe-nos. Mais uma vez, este é um dinheiro incondicional para você usar no que precisar. ',
            warning:
                'Se você encontrar alguma atividade suspeita, avise-nos, pois será considerada uma ação de boa fé que pode evitar que toda a comunidade seja afetada por causa de alguns atores mal-intencionados.',
        },
        claim: 'Pegar',
        claimExplained1:
            '<bold>Cada comunidade possui um grupo de beneficiários</bold>, adicionados pelos gestores da comunidade, que podem aceder um rendimento mínimo, de acordo com um conjunto de regras. Por exemplo, cada beneficiário pode pegar $1/dia até $500.',
        claimExplained2:
            '<bold>Existe um tempo minimo que terá de esperar antes de poder pegar novamente</bold>, mas não tem tempo máximo. Deverá pegar apenas quando precisa. Quanto mais pegar, mais tempo terá de esperar antes de poder pegar novamente.',
        claimExplained3:
            '<bold>Se a sua comunidade ficar sem fundos</bold>, você não poderá solicitar. A única maneira de começar a solicitar novamente é quando a comunidade recebe fundos adicionais por meio de doações.',
        claimLockedUntil:
            'Você ainda não pode pegar novamente. Ficará disponivel em {{date}}. Se habitualmente falha, certifique-se que tem a melhor ligação á internet possivel e que a sua Valora está sincronizada.',
        youCanClaimXin: 'Poderá pegar {{amount}} em',
        claimX: 'Pegar ', // {{amount}}
        youHaveClaimedXoutOfY: 'Já recebeu ${{claimed}} em ${{max}}',
        nextTimeWillWaitClaim:
            'Na próxima terá de esperar pelo menos {{nextWait}}. <a>Como funciona?</a>',
        howClaimWorks: 'Como funciona?',
        errorClaiming:
            'O erro ocorreu ao tentar pegar. Tente novamente mais tarde.\n\nErro: {{error}}',
        beneficiaryCommunityNoFunds:
            'Infelizmente, a sua comunidade não tem fundos de momento! Por favor, tente mais tarde.',
        blockedAccountTitle: 'Conta Bloqueada',
        blockedAccountDescription:
            'Sua conta foi bloqueada. Entre em contato com seu gerente se achar que foi um engano.',
        welcomeBeneficiayTitle:
            'Você agora é um beneficiário da {{ communityName }}',
        welcomeBeneficiaryDecription:
            'Todos os dias, você poderá reivindicar/pedir/pegar ~{{claimXCCurrency}}. Depois de reivindicar/pedir/pegar, você precisará aguardar por {{interval}} + {{minIncrement}} minutos.',
    },
    profile: {
        deleteAccountWarn: {
            msg1:
                'Todos os dados pessoais privados e públicos serão apagados permanentemente (excepto todos os dados públicos guardados na blockchain celo) e esta conta será encerrada.',
            msg2:
                'Este processo demorará 15 dias. Para abortar esse processo necessita apenas de ligar-se novamente com a mesma carteira durante este período.',
        },
        profile: 'Perfil',
        balance: 'Balanço',
        uploadProfilePicture: 'Atualizar foto de perfil',
        phoneNumber: 'Número de telemóvel',
        logout: 'Sair',
        stolenOrChangedPhone:
            'Leia as instruções a seguir caso seu telefone seja <blue>roubado/perdido</blue> ou você precise <blue>alterar seu número de telefone.</blue>',
        age: 'Idade',
        gender: 'Género',
        male: 'Masculino',
        female: 'Feminino',
        others: 'Outros',
        howManyChildren: 'Quantos filhos você tem?',
        deleteAccount: 'Apagar Conta',
    },
    community: {
        ssi: 'Índice de Autossustentabilidade',
        ssiDescription:
            'SSI mede a sustentabilidade financeira de uma comunidade.',
        seeMore: 'Ver Mais',
        seeOriginal: 'Ver Original',
        seeLess: 'Ver Menos',
        exploreCommunityContract: 'Ver Contrato da Comunidade',
        eachBeneficiaryCanClaimXUpToY:
            'Cada beneficiário pode aceder a ~{{claimXCCurrency}} ($<bold>{{claimX}}</bold> cUSD) por <bold>{{interval}}</bold>, até acumular $<bold>{{upToY}}</bold> cUSD. A cada pedido, <bold>{{minIncrement}}</bold> minutos são adicionados ao tempo de espera.',
        copyContractAddress: 'Copiar Endereço do Contrato',
        suspiciousActivityDetected: 'Atividade suspeita detectada',
        suspiciousDescription:
            'Os fundos comunitários podem ser suspensos se os beneficiários ou gerentes envolvidos não forem removidos desta comunidade.',
        noSuspiciousActivityDetected:
            'Nenhuma atividade suspeita detectada neste comunidade.',
        lowSuspiciousActivityDetected:
            'Um número muito pequeno de contas pode estar envolvido em atividades suspeitas.',
        significantSuspiciousActivityDetected:
            'Um número significativo de contas pode estar envolvido em atividades suspeitas.',
        largeSuspiciousActivityDetected:
            'Um grande número de contas pode estar envolvido em atividades suspeitas.',
        fundsRunOut: 'Os fundos da comunidade acabarão em {{days}}',
        shareTitle:
            'impactMarket | Protocolo Descentralizado de Redução da Pobreza',
    },
    report: {
        report: 'Relatório',
        title: 'Denunciar atividade ilegal',
        category: 'Categoria',
        general: 'General',
        selectCategory: 'Selectionar categoria',
        potencialFraud: 'Potencial fraude',
        message:
            'Se você acha que há algo suspeito em sua comunidade, distribuição de dinheiro ou comportamento, como possível fraude ou corrupção, informe-nos de forma anônima.',
        label: 'Descreva a potencial atividade ilegal',
        alertCongrat: 'Obrigado por denunciar potenciais atividades ilegais.',
        alertCongratLink: 'Saiba mais sobre denúncia anônima.',
        alertFailure: 'Erro ao submeter seu relatório!',
        categoryIsRequired: 'Categoria é obrigatório!',
        descriptionIsRequired: 'Descrição é obrigatório!',
    },
    communityFundsRunOut: {
        title: 'Comunidade sem fundos',
        description:
            'Entendemos o inconveniente e sabemos o quanto você precisa desse valor.',
        callToAction: 'Por que os fundos acabam?',
    },
    communityWentOutOfFunds:
        'Parece que a comunidade ficou sem fundos. Tente novamente mais tarde.',
    donate: {
        errorDonating: 'Um erro ocorreu durante o contributo!',
        addressCopiedClipboard:
            'Endereço da comunidade copiado! Envie apenas $cUSD (Celo Dollar) para este contrato.',
        donate: 'Contribuir',
        attach: 'Anexar',
        donateWithValora: 'Contribuir com Valora',
        donateSymbol: 'Contribuir ({{symbol}})',
        donateConfirmMessage:
            "Ao selecionar 'Contribuir', irá enviar <bold>{{symbol}}{{amount}} (${{amountInDollars}} cUSD)</bold> para {{to}}.",
        yourDonationWillBackFor:
            'Apoiará {{backNBeneficiaries}} beneficiários por {{backForDays}}+ dias.',
        donationBiggerThanBalance:
            'Não tem saldo suficiente para contribuir com este montante. Aumente o seu saldo na Valora.',
        amountShouldBe: 'Quantidade deve ser ${{claimAmount}}+ para calcular..',
        donationBeingProcessed: 'O seu contributo está a ser processado...',
        donateWithCelo: 'Celo Dollar ($cUSD)',
        donateWithESolidar: 'Cartão de Crédito / Paypal / BTC / ETH',
        poweredByESolidar: 'Distribuído por',
        contributeWith: 'Contribuir com',
    },
    sagas: {
        messages: {
            yourNetworkisOffline: 'Ouch! Parece que você está offline.',
            yourNetworkisOnline: 'Hurray! Sua rede está online novamente!',
            yourNetworkisWeak:
                'Hmmm! Parece que você está a ter problemas com a rede.',
            submitAddStoriesToStateSuccess:
                'Hurray! Veja as stories mais recentes.',
            submitAddStoriesToStateFailure:
                'Oops! Não conseguimos atualizar todas as stories desta vez. Por favor, tente mais tarde.',
        },
    },
    auth: {
        impactMarketDescription:
            'ImpactMarket opera na rede Celo, um sistema financeiro aberto focado em criar prosperidade para todos.',
        loginDescription:
            'Com a carteira Valora, pode enviar e receber dinheiro usando apenas um telemóvel.',
        step1: 'Step 1 de 2',
        step2: 'Step 2 de 2',
        whatIsValora: 'O que é Valora?',
        installAndCreateValoraAccount: 'Instalar Valora e criar conta',
        connectWithValora: 'Conectar com Valora',
        duplicatedTitle: 'Contas duplicadas',
        duplicatedMsg1:
            'O seu numero de telemovel {{phoneNumber}} está associado a outra conta no impactMarket.',
        duplicatedMsg2:
            'Pretende continuar com a autenticação, desabilitando todas as outras contas?',
        duplicatedMsg3: 'P.S: Os fundos serão mantidos nas outras contas.',
        welcomeBack: 'Bem-vindo novamente',
        recover: 'Recuperar',
        recoverMsg1:
            'Uma vez que iniciou este processo de eliminação de conta há menos de 15 dias, pode recuperar os seus dados privados e públicos.',
        inactiveMsg1:
            'Verificamos que a sua conta está inativa. Deseja ativar novamente?',
    },
    promoter: {
        createdIn: 'Criou comunidade em {{date}}',
        promoter: 'Promotor',
        promotedBy: 'Promovido por',
    },
};
