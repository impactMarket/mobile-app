export function setUserAddress(account: string) {
    return {
        type: 'SET_USER_ADDRESS',
        payload: account,
    }
}