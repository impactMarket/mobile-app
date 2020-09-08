import { useNavigation } from '@react-navigation/native';
import Header from 'components/Header';
import React, { useState } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { List, Text } from 'react-native-paper';

const ptFAQ = [
    {
        title: 'O que é a impactMarket?',
        message:
            'impactMarket é uma plataforma desenhada para facilitar o acesso e distribuição de fundos junto de quem mais precisa, através das suas comunidades.',
    },
    {
        title:
            'O que é o Rendimento Básico Incondicional (ou Universal Basic Income)?',
        message:
            'Esta forma de rendimento pressupõe que um conjunto de pessoas, seja do mesmo país, cidade ou mesmo comunidade local, tem acesso, de forma incondicional, a um rendimento recorrente suficiente para sair da pobreza.',
    },
    {
        title: 'Por que é que a impactMarket usa a tecnologia Blockchain?',
        message:
            'A tecnologia blockchain permite um conjunto de novos benefícios que são especialmente interessantes para quem mais precisa. Esta tecnologia, permite que qualquer pessoa envie dinheiro para outra pessoa, de forma não censurável, transparente, sem intermediários, instantaneamente e quase gratuitamente, independentemente do país. Apenas é necessário uma ligação à internet e um smartphone para poder ter uma conta, enviar e receber dinheiro.',
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
    { title: 'Onde posso transacionar cUSD? ', message: '' },
    {
        title: 'Quanto é a taxa por cada transação?',
        message:
            'As taxas de transação na rede da Celo são bastante baixas, normalmente a rondar $0.01 por transação.',
    },
    {
        title: 'Como adquirir ou converter cUSD para a minha moeda?',
        message: '',
    },
    {
        title:
            'Sou uma empresa, fundação, marca ou celebridade. Como me posso envolver?',
        message: '',
    },
    { title: 'Como contactar a impactMarket?', message: '' },
];

function FAQScreen() {
    const navigation = useNavigation();
    const [expanded, setExpanded] = useState<string[]>([]);

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
            <Header title="FAQ" navigation={navigation} hasBack />
            <ScrollView style={styles.contentView}>
                {ptFAQ.map((faq) => (
                    <List.Accordion
                        title={faq.title}
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
        fontWeight: 'normal',
        fontStyle: 'normal',
        lineHeight: 25,
        letterSpacing: 0,
        color: '#1e3252',
    },
});

export default FAQScreen;
