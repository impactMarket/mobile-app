import ApiRouteCommunity from './routes/community';
import ApiRouteStory from './routes/story';
import ApiRouteSystem from './routes/system';
import ApiRouteUser from './routes/user';

const Api = {
    community: new ApiRouteCommunity(),
    user: new ApiRouteUser(),
    system: new ApiRouteSystem(),
    story: new ApiRouteStory(),
};

export default Api;
