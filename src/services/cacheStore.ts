import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserAttributes } from 'helpers/types/models';

const CACHE_STORE_USER = '@CacheStore:user';
const CACHE_STORE_BENEFICIARY_CLAIM = '@CacheStore:beneficiaryClaim';
const CACHE_STORE_LOCKED_CLAIM_UNTIL = '@CacheStore:lockedClaimUntil';
const CACHE_STORE_LAST_LOCKED_CLAIM_AT = '@CacheStore:lastLockedClaimAt';
const CACHE_STORE_FAILED_CLAIM_TRIES = '@CacheStore:failedClaimTries';
const CACHE_STORE_LAST_FAILED_CLAIM_TRY = '@CacheStore:lastFailedClaimTry';
const CACHE_STORE_COMMUNITY_HAD_NO_FUNDS = '@CacheStore:communityHadNoFunds';
const CACHE_STORE_BENEFICIARY_COMMUNITY_RULES_ACCEPTED =
    '@CacheStore:communityRulesAcceptedByBeneficiary';
const CACHE_STORE_MANAGER_COMMUNITY_RULES_ACCEPTED =
    '@CacheStore:communityRulesAcceptedByManager';
//
const CACHE_STORE_EXCHANGE_RATES = '@CacheStore:exchangeRates';
const CACHE_STORE_LAST_EXCHANGE_RATES = '@CacheStore:lastExchangeRates';
const CACHE_STORE_LAST_VERSION = '@CacheStore:lastVersion';
const CACHE_STORE_LAST_LAST_VERSION = '@CacheStore:lastLastVersion';
const CACHE_STORE_APP_NEEDS_UPDATE = '@CacheStore:appNeedsUpdate';

interface IBeneficiaryClaim {
    communityId: string;
    claimed: string;
    cooldown: number;
    lastInterval: number;
}

export default class CacheStore {
    // user cache

    static async cacheUser(user: UserAttributes) {
        await AsyncStorage.setItem(CACHE_STORE_USER, JSON.stringify(user));
    }

    static async getUser(): Promise<UserAttributes | null> {
        const user = await AsyncStorage.getItem(CACHE_STORE_USER);
        if (user === null) {
            return null;
        }
        return JSON.parse(user);
    }

    static async cacheBeneficiaryClaim(beneficiaryClaim: IBeneficiaryClaim) {
        await AsyncStorage.setItem(
            CACHE_STORE_BENEFICIARY_CLAIM,
            JSON.stringify(beneficiaryClaim)
        );
    }

    static async getBeneficiaryClaim(): Promise<IBeneficiaryClaim | null> {
        const beneficiaryClaim = await AsyncStorage.getItem(
            CACHE_STORE_BENEFICIARY_CLAIM
        );
        if (beneficiaryClaim === null) {
            return null;
        }
        return JSON.parse(beneficiaryClaim);
    }

    static async cacheCommunityHadNoFunds() {
        await AsyncStorage.setItem(CACHE_STORE_COMMUNITY_HAD_NO_FUNDS, 'true');
    }

    static async getCommunityHadNoFunds(): Promise<boolean | null> {
        const communityHadNoFunds = await AsyncStorage.getItem(
            CACHE_STORE_COMMUNITY_HAD_NO_FUNDS
        );
        if (communityHadNoFunds === null) {
            return null;
        }
        return communityHadNoFunds === 'true';
    }

    static async removeCommunityHadNoFunds() {
        await AsyncStorage.removeItem(CACHE_STORE_COMMUNITY_HAD_NO_FUNDS);
    }

    static async cacheBeneficiaryAcceptCommunityRules() {
        await AsyncStorage.setItem(
            CACHE_STORE_BENEFICIARY_COMMUNITY_RULES_ACCEPTED,
            'true'
        );
    }

    static async cacheManagerAcceptCommunityRules() {
        await AsyncStorage.setItem(
            CACHE_STORE_MANAGER_COMMUNITY_RULES_ACCEPTED,
            'true'
        );
    }

    static async getBeneficiaryAcceptCommunityRules() {
        const beneficiaryAcceptCommunityRules = await AsyncStorage.getItem(
            CACHE_STORE_BENEFICIARY_COMMUNITY_RULES_ACCEPTED
        );
        if (beneficiaryAcceptCommunityRules === null) {
            return null;
        }
        return beneficiaryAcceptCommunityRules === 'true';
    }

    static async getManagerAcceptCommunityRules() {
        const managerAcceptCommunityRules = await AsyncStorage.getItem(
            CACHE_STORE_MANAGER_COMMUNITY_RULES_ACCEPTED
        );
        if (managerAcceptCommunityRules === null) {
            return null;
        }
        return managerAcceptCommunityRules === 'true';
    }

    /**
     * Always cache claim failures. If the user tries to claim 3 times in a row, is locked for
     * 20 minutes at first and then 40 minutes. If waits for than an hour, it's 20 minutes again.
     * If fails 3 times in a row, but gives intervals bigger than 10 minutes between each try
     * does not increment counter to lock.
     */
    static async cacheFailedClaim() {
        const failedClaims = await AsyncStorage.getItem(
            CACHE_STORE_FAILED_CLAIM_TRIES
        );
        const lastFailedClaimTry = await AsyncStorage.getItem(
            CACHE_STORE_LAST_FAILED_CLAIM_TRY
        );
        let newTotalFailedClaims = 1;
        // if it has already registered a failure, less than 10 minutes ago
        if (
            failedClaims !== null &&
            lastFailedClaimTry !== null &&
            new Date(parseInt(lastFailedClaimTry, 10)).getTime() <
                10 * 60 * 1000
        ) {
            newTotalFailedClaims = parseInt(failedClaims, 10) + 1;
        }
        // if has failed more than 2 times
        if (newTotalFailedClaims > 2) {
            const lastLocked = await AsyncStorage.getItem(
                CACHE_STORE_LAST_LOCKED_CLAIM_AT
            );
            let minutes = 20;
            // verify if has been locked within the last hour
            if (
                lastLocked !== null &&
                new Date().getTime() -
                    new Date(parseInt(lastLocked, 10)).getTime() <
                    86400000
            ) {
                minutes = 40;
            }

            await AsyncStorage.setItem(
                CACHE_STORE_LOCKED_CLAIM_UNTIL,
                (new Date().getTime() + minutes * 60 * 1000).toString()
            );
            await AsyncStorage.setItem(
                CACHE_STORE_LAST_LOCKED_CLAIM_AT,
                new Date().getTime().toString()
            );
        }
        await AsyncStorage.setItem(
            CACHE_STORE_FAILED_CLAIM_TRIES,
            newTotalFailedClaims.toString()
        );
        await AsyncStorage.setItem(
            CACHE_STORE_LAST_FAILED_CLAIM_TRY,
            new Date().getTime().toString()
        );
    }

    static async getLockClaimUntil(): Promise<number | null> {
        const lockedUntil = await AsyncStorage.getItem(
            CACHE_STORE_LOCKED_CLAIM_UNTIL
        );
        if (lockedUntil === null) {
            return null;
        }
        return parseInt(lockedUntil, 10);
    }

    /**
     * Reset whn a claim is successfull.
     */
    static async resetClaimFails(): Promise<void> {
        await AsyncStorage.multiRemove([
            CACHE_STORE_LOCKED_CLAIM_UNTIL,
            CACHE_STORE_LAST_LOCKED_CLAIM_AT,
            CACHE_STORE_FAILED_CLAIM_TRIES,
        ]);
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
}
