import currenciesJSON from 'assets/currencies.json';
import BigNumber from 'bignumber.js';

import config from '../../config';

export function formatInputAmountToTransfer(inputAmount: string) {
    if (inputAmount.indexOf(',') === 0 || inputAmount.indexOf('.') === 0) {
        inputAmount = `0${inputAmount}`;
    }
    inputAmount = inputAmount.replace(',', '.');
    return inputAmount;
}

export function getCurrencySymbol(currency: string) {
    return (
        currenciesJSON as {
            [key: string]: {
                symbol: string;
                name: string;
                symbol_native: string;
            };
        }
    )[currency.toUpperCase()].symbol;
}

export function humanifyCurrencyAmount(
    inputNumber: BigNumber | string
): string {
    let value: BigNumber = new BigNumber(0);
    if (
        inputNumber instanceof BigNumber &&
        inputNumber.toString().length > 15
    ) {
        const decimals = new BigNumber(10).pow(config.cUSDDecimals);
        value = inputNumber.div(decimals);
    } else if (!(inputNumber instanceof BigNumber) && inputNumber.length > 15) {
        const decimals = new BigNumber(10).pow(config.cUSDDecimals);
        value = new BigNumber(inputNumber).div(decimals);
    } else {
        value = new BigNumber(inputNumber);
    }
    if (value.gte('100000')) {
        return value
            .decimalPlaces(0)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return value
        .decimalPlaces(2, 1)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function amountToCurrency(
    amount: string,
    currency: string,
    exchangeRates: { [key: string]: number },
    showSymbol: boolean = true
): string {
    if (amount.length > 15) {
        const decimals = new BigNumber(10).pow(config.cUSDDecimals);
        amount = new BigNumber(amount).div(decimals).toString();
    }
    const exchangeRate = exchangeRates[currency];
    const hValue = Math.round(parseFloat(amount) * exchangeRate * 100) / 100;
    const currencySymbol = getCurrencySymbol(currency);
    // if (currency.includes('/.')) {
    //     return hValue.replace('.', currencySymbol);
    // }
    if (!showSymbol) {
        return hValue.toString();
    }
    return `${currencySymbol}${hValue}`;
}

export function amountToCurrencyBN(
    amount: BigNumber | string,
    currency: string,
    exchangeRates: { [key: string]: number },
    showSymbol: boolean = true
): string {
    const exchangeRate = exchangeRates[currency];
    const bgn = new BigNumber(amount).multipliedBy(exchangeRate);
    const hValue = humanifyCurrencyAmount(bgn);
    const currencySymbol = getCurrencySymbol(currency);
    // if (currency.includes('/.')) {
    //     return hValue.replace('.', currencySymbol);
    // }
    if (!showSymbol) {
        return hValue;
    }
    return currencySymbol + hValue;
}

// cUSD has 18 zeros!
export function humanifyNumber(inputNumber: BigNumber | string): number {
    const decimals = new BigNumber(10).pow(config.cUSDDecimals);
    return parseFloat(
        new BigNumber(inputNumber).div(decimals).decimalPlaces(2, 1).toString()
    );
}
