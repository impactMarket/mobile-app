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
    },
};
// Set the locale once at the beginning of your app.
i18n.locale = Localization.locale;
// When a value is missing from a language it'll fallback to another language with the key present.
i18n.fallbacks = true;

export default i18n;