import { useNavigation } from '@react-navigation/native';
import BackSvg from 'components/svg/header/BackSvg';
import { IRootState } from 'helpers/types/state';
import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { List, Text } from 'react-native-paper';
import { useSelector } from 'react-redux';

const enFAQ = [
    {
        title: 'What is impactMarket?',
        message:
            'impactMarket is an open and free platform that allows the creation and distribution of unconditional basic income between communities and their beneficiaries, according to their needs.',
    },
    {
        title: 'What is Universal Basic Income)?',
        message:
            'This form of income presupposes that a group of people, whether from the same country, city or even local community, has access, unconditionally, to sufficient recurring income to escape extreme poverty.',
    },
    {
        title: 'Why impactMarket uses Blockchain tech?',
        message:
            'Blockchain technology allows for a set of new benefits and allows anyone to send money to another person, in a non-objectionable, transparent way, without intermediaries, instantly and almost free of charge, regardless of the country. All you need is an internet connection and a smartphone to be able to have an account, send and receive money.',
    },
    {
        title: 'What can I do in impactMarket?',
        message:
            'You can create a UBI community and add your beneficiaries who will have access to the funds that are deposited in that community, equally for everyone. To support the communities you like best, you can send $ cUSD directly to your contract. In the future we plan to include impact-driven microjobs, instant access to microcredit, donate earning interest, and collective saving mechanisms.',
    },
    {
        title: 'What is needed to start using?',
        message:
            'You should install the Valora app and register if you want to create a community or access basic income. Valora allows the sending and receiving of money, as well as the interaction with impactMarket. If you just want to contribute, installing Valora is not mandatory.',
    },
    {
        title: 'How communities work?',
        message:
            'The communities are usually led by local social institutions that have direct access to the end beneficiaries and that make their selection, in order to reach those who need it most quickly first.',
    },
    {
        title: 'How to create a community?',
        message:
            'To create a community, you can fill out the form, in the upper right corner of the list of communities. You should add additional information about the community, its beneficiaries and define the rules for accessing funds by the beneficiaries (for example, each beneficiary can request $ 1 / day until they accumulate a maximum of $ 500. At the time of creation, and after validation , a contract is submitted on the blockchain with these rules.',
    },
    {
        title: 'How to back a community?',
        message:
            'You can send $ cUSD directly from your wallet or exchange, or, in the Valora app, you can buy $ cUSD directly with a credit / debit card and then send.',
    },
    {
        title: 'How can I have access to a basic income?',
        message:
            'Contact a local social institution that you know and trust and ask to create a community or get in touch with us.',
    },
    {
        title: 'is it safe to donate through impactMarket?',
        message:
            'Yes. The fact that we use blockchain means that no one can corrupt or censor any transaction.',
    },
    {
        title: 'What is the currency used? What is cUSD?',
        message:
            'The currency used as the basis for all transactions is the US dollar, represented by cUSD. cUSD is a cryptocurrency, which operates on the Celo network, and is worth $ 1. These currencies can be converted, at any time, into dollars.',
    },
    {
        title: 'Where can I transact/use cUSD? ',
        message:
            'You can transact cUSD with any partner or payment processor that accepts cUSD directly. Alternatively, Valora has an option to buy or sell CELO with cUSD. CELO is available on several exchanges.',
    },
    {
        title: 'How much is the transaction fee?',
        message:
            'Transaction fees on Celo network are quite low, near free, usually around $0.001 per transaction.',
    },
    {
        title: 'How to convert is to my local currency?',
        message:
            'At Valora you can buy CELO with a card and then sell that CELO for cUSD (Celo Dollar). There are also several exchanges like Coinbase where you can get CELO and send it to your Valora or sell CELO to US dollars. However, anyone can exchange cUSD with another person for the local currency. If you are a beneficiary, look for your community manager who can help you with this process.',
    },
    {
        title:
            'As a company, foundation, brand or celebrity, how to get involved?',
        message:
            'Contact us to learn more about how to involve your employees, customers or community in social initiatives, in a completely transparent and measurable way.',
    },
    {
        title: 'How to contact impactMarket?',
        message:
            'You can contact us on social networks, or via email to hello@impactmarket.com',
    },
];
const ptFAQ = [
    {
        title: 'O que é a impactMarket?',
        message:
            'impactMarket é uma plataforma aberta e gratuita que permite a criação e distribuição de rendimento básico incondicional entre comunidades e os seus beneficiários, de acordo com as suas necessidades.',
    },
    {
        title:
            'O que é o Rendimento Básico Incondicional (ou Universal Basic Income)?',
        message:
            'Esta forma de rendimento pressupõe que um conjunto de pessoas, seja do mesmo país, cidade ou mesmo comunidade local, tenha acesso, de forma incondicional, a um rendimento recorrente suficiente para sair da extrema pobreza.',
    },
    {
        title: 'Por que é que a impactMarket usa a tecnologia Blockchain?',
        message:
            'A tecnologia blockchain permite um conjunto de novos benefícios e permite que qualquer pessoa envie dinheiro para outra pessoa, de forma não censurável, transparente, sem intermediários, instantaneamente e quase gratuitamente, independentemente do país. Apenas é necessário uma ligação à internet e um smartphone para poder ter uma conta, enviar e receber dinheiro.',
    },
    {
        title: 'O que posso fazer na ImpactMarket?',
        message:
            'Pode criar uma comunidade UBI e adicionar os seus beneficiários que terão acesso aos fundos que forem depositados nessa comunidade, de forma igual para todos. Para apoiar as comunidades que mais gosta, pode enviar $cUSD diretamente para o seu contrato.',
    },
    {
        title: 'O que é necessário para poder começar a utilizar?',
        message:
            'Deverá instalar a app Valora e fazer o registo, caso queira criar uma comunidade ou aceder a um rendimento básico. A Valora permite o envio e receção de dinheiro, assim como a interação com a impactMarket. Caso deseje apenas contribuir, a instalação da Valora não é obrigatória.',
    },
    {
        title: 'Como funcionam as comunidades?',
        message:
            'As comunidades são normalmente lideradas por instituições sociais locais que tem um acesso direto aos beneficiários finais e que fazem a sua seleção, de forma a chegar mais rapidamente a quem mais precisa primeiro.',
    },
    {
        title: 'Como posso criar uma comunidade?',
        message:
            'Para criar uma comunidade, poderá preencher o formulário, no canto superior direito da listagem das comunidades. Deverá adicionar informação adicional sobre a comunidade, os seus beneficiários e definir as regras de acesso aos fundos por parte dos beneficiários (por exemplo, cada beneficiário poderá pedir $1/dia até acumular um máximo de $500. No momento da criação, e após uma validação, um contrato é submetido na blockchain com essas regras.',
    },
    {
        title: 'Como posso apoiar uma comunidade?',
        message:
            'Poderá enviar $cUSD diretamente da sua wallet ou exchange, ou, na app Valora, pode comprar $cUSD diretamente com um cartão de crédito/débito e depois enviar.',
    },
    {
        title:
            'Vivo em condições de vulnerabilidade. Como posso ter acesso a um rendimento básico? ',
        message:
            'Contacte uma instituição social local, que conheça e confie, e peça para criar uma comunidade ou entrar em contacto connosco.',
    },
    {
        title: 'É seguro doar na impactMarket?',
        message:
            'Sim. O facto de usarmos blockchain significa que ninguém pode corromper ou censurar qualquer transação.',
    },
    {
        title: 'Que moeda é usada? O que é cUSD? ',
        message:
            'A moeda usada como base de todas as transações é o dólar americano, representado por cUSD. cUSD é uma criptomoeda, que opera na rede da Celo, e que vale $1. Estas moedas são convertíveis, a qualquer momento, em doláres.',
    },
    {
        title: 'Onde posso transacionar cUSD? ',
        message:
            'Poderá transacionar cUSD em qualquer parceiros ou processador de pagamento que aceite cUSD diretamente. Em alternativa, a Valora tem uma opção para comprar ou vender CELO com cUSD. CELO está disponível em diversas exchanges.',
    },
    {
        title: 'Quanto é a taxa por cada transação?',
        message:
            'As taxas de transação na rede da Celo são bastante baixas, quase nulas, normalmente a rondar $0.001 por transação.',
    },
    {
        title: 'Como adquirir ou converter cUSD para a minha moeda?',
        message:
            'Na Valora poderá comprar CELO com cartão e depois vender esse CELO por cUSD (Celo Dollar). Existem também várias exchanges como Coinbase onde pode obter CELO e enviar para a sua Valora ou vender CELO para US doláres. No entanto, qualquer pessoa pode trocar cUSD com outra pessoa pela moeda local. Se for um beneficiário, procure o gestor da sua comunidade que lhe poderá ajudar nesse processo. ',
    },
    {
        title:
            'Sou uma empresa, fundação, marca ou celebridade. Como me posso envolver?',
        message:
            'Contacte-nos para saber mais como envolver os seus colaboradores, clientes ou comunidade em iniciativas sociais, de forma completamente transparente e mensurável',
    },
    {
        title: 'Como contactar a impactMarket?',
        message:
            'Pode contactar nas redes sociais, ou através de email para hello@impactmarket.com',
    },
];

function FAQScreen() {
    const language = useSelector(
        (state: IRootState) => state.user.metadata.language
    );
    const [expanded, setExpanded] = useState<string[]>([]);
    const [faq, setFaq] = useState<{ title: string; message: string }[]>([]);

    useEffect(() => {
        setFaq(language === 'en' ? enFAQ : ptFAQ);
    }, []);

    const handlePress = (tag: string) => {
        let newExpanded: string[];
        if (expanded.indexOf(tag) === -1) {
            newExpanded = [...expanded];
            newExpanded.push(tag);
        } else {
            newExpanded = expanded.filter((e) => e !== tag);
        }
        setExpanded(newExpanded);
    };
    return (
        <>
            <ScrollView style={styles.contentView}>
                {faq.map((faq) => (
                    <List.Accordion
                        title={faq.title}
                        titleNumberOfLines={4}
                        expanded={expanded.indexOf(faq.title) !== -1}
                        onPress={() => handlePress(faq.title)}
                    >
                        <View style={styles.descriptionView}>
                            <Text style={styles.descriptionText}>
                                {faq.message}
                            </Text>
                        </View>
                    </List.Accordion>
                ))}
            </ScrollView>
        </>
    );
}
FAQScreen.navigationOptions = () => {
    return {
        headerLeft: () => <BackSvg />,
    };
};

const styles = StyleSheet.create({
    contentView: {
        paddingHorizontal: 20,
    },
    descriptionView: {
        paddingHorizontal: 20,
    },
    descriptionText: {
        opacity: 0.84,
        fontFamily: 'Gelion-Regular',
        fontSize: 18,
        lineHeight: 25,
        letterSpacing: 0,
        color: '#1e3252',
    },
});

export default FAQScreen;
