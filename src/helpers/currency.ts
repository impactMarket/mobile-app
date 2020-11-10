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
    switch (currency.toUpperCase()) {
        case 'EUR':
            return '€';
        case 'BRL':
            return 'R$';
        case 'GHS':
            return 'GH₵';
        case 'CVE':
            return '$';
        case 'NGN':
            return '₦';
        case 'VES':
            return 'BsS';
        default:
            return '$';
    }
}

export function humanifyCurrencyAmount(inputNumber: BigNumber | string): string {
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
    exchangeRates: any
): string {
    const exchangeRate = exchangeRates[currency].rate;
    const bgn = new BigNumber(amount).multipliedBy(exchangeRate);
    const hValue = humanifyCurrencyAmount(bgn);
    if (currency === 'CVE') {
        return hValue.replace('.', getCurrencySymbol(currency));
    }
    return getCurrencySymbol(currency) + hValue;
}

// cUSD has 18 zeros!
export function humanifyNumber(inputNumber: BigNumber | string): number {
    const decimals = new BigNumber(10).pow(config.cUSDDecimals);
    return parseFloat(
        new BigNumber(inputNumber).div(decimals).decimalPlaces(2, 1).toString()
    );
}