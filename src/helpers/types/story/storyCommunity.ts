import { CommunityAttributes } from 'helpers/types/models';

import { StoryContent } from './storyContent';

export interface StoryCommunity {
    id: number;
    contentId: number;
    communityId: number;

    community?: CommunityAttributes;
    storyContent?: StoryContent;
}

export interface StoryCommunityCreation {
    contentId: number;
    communityId: number;
}
export interface StoryCommunityCreationEager {
    // contentId: number;
    communityId: number;
}
