import ApiRouteCommunity from './routes/community';
import ApiRouteGlobal from './routes/global';
import ApiRouteStory from './routes/story';
import ApiRouteSystem from './routes/system';
import ApiRouteUser from './routes/user';

const Api = {
    global: new ApiRouteGlobal(),
    community: new ApiRouteCommunity(),
    user: new ApiRouteUser(),
    system: new ApiRouteSystem(),
    story: new ApiRouteStory(),
};

export default Api;
