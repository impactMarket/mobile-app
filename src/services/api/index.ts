import axios from 'axios';

import config from '../../../config';
import ApiRouteCommunity from './routes/community';
import ApiRouteStory from './routes/story';
import ApiRouteSystem from './routes/system';
import ApiRouteUser from './routes/user';

axios.defaults.baseURL = config.baseApiUrl;

class Api {
    public static community = ApiRouteCommunity;
    public static user = ApiRouteUser;
    public static system = ApiRouteSystem;
    public static story = ApiRouteStory;
}

export default Api;
