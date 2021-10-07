import { ApiRequests as api } from '../base';

class ApiRouteGlobal {
    async numbers() {
        return api.get<{
            claimed: string;
            countries: number;
            beneficiaries: number;
            backers: number;
            communities: number;
        }>('/global/numbers');
    }
}

export default ApiRouteGlobal;