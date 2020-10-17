import { IUser } from 'helpers/types';
import { AsyncStorage } from 'react-native';

const CACHE_STORE_USER = '@CacheStore:user';
const CACHE_STORE_EXCHANGE_RATES = '@CacheStore:exchangeRates';
const CACHE_STORE_LAST_EXCHANGE_RATES = '@CacheStore:lastExchangeRates';
const CACHE_STORE_LAST_VERSION = '@CacheStore:lastVersion';
const CACHE_STORE_LAST_LAST_VERSION = '@CacheStore:lastLastVersion';
const CACHE_STORE_APP_NEEDS_UPDATE = '@CacheStore:appNeedsUpdate';

export default class CacheStore {
    // user cache

    static async cacheUser(user: IUser) {
        await AsyncStorage.setItem(CACHE_STORE_USER, JSON.stringify(user));
    }

    static async getUser(): Promise<IUser | null> {
        const user = await AsyncStorage.getItem(CACHE_STORE_USER);
        if (user === null) {
            return null;
        }
        return JSON.parse(user);
    }

    // last version cache

    static async cacheLastVersion(version: string) {
        await AsyncStorage.setItem(CACHE_STORE_LAST_VERSION, version);
        await AsyncStorage.setItem(
            CACHE_STORE_LAST_LAST_VERSION,
            new Date().getTime().toString()
        );
    }

    static async getLastVersion(): Promise<string | null> {
        const version = await AsyncStorage.getItem(CACHE_STORE_LAST_VERSION);
        if (version === null) {
            return null;
        }
        return version;
    }

    static async getLastLastVersionUpdate(): Promise<number> {
        const updateDate = await AsyncStorage.getItem(
            CACHE_STORE_LAST_LAST_VERSION
        );
        if (updateDate === null) {
            return 0;
        }
        return parseInt(updateDate);
    }

    static async getAppNeedsUpdate(): Promise<boolean> {
        const appNeedsUpdate = await AsyncStorage.getItem(
            CACHE_STORE_APP_NEEDS_UPDATE
        );
        if (appNeedsUpdate === null) {
            return false;
        }
        return appNeedsUpdate === 'true';
    }

    // exchange rates cache

    static async cacheExchangeRates(exchangeRates: any) {
        await AsyncStorage.setItem(
            CACHE_STORE_EXCHANGE_RATES,
            JSON.stringify(exchangeRates)
        );
        await AsyncStorage.setItem(
            CACHE_STORE_LAST_EXCHANGE_RATES,
            new Date().getTime().toString()
        );
    }

    static async getExchangeRates(): Promise<any> {
        const exchangeRates = await AsyncStorage.getItem(
            CACHE_STORE_EXCHANGE_RATES
        );
        if (exchangeRates === null) {
            return null;
        }
        return JSON.parse(exchangeRates);
    }

    static async getLastExchangeRatesUpdate(): Promise<number> {
        const updateDate = await AsyncStorage.getItem(
            CACHE_STORE_LAST_EXCHANGE_RATES
        );
        if (updateDate === null) {
            return 0;
        }
        return parseInt(updateDate);
    }
}
