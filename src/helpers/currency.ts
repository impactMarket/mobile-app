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
    const decimals = new BigNumber(10).pow(config.cUSDDecimals);
    const value = new BigNumber(inputNumber).div(decimals);
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
