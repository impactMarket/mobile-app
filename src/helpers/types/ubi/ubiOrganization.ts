import { IMediaContent } from 'helpers/types/endpoints';

import { UbiOrganizationSocialMedia } from './ubiOrganizationSocialMedia';

export interface UbiOrganization {
    id: number;
    name: string;
    description: string;
    logoMediaId: number;

    logo?: IMediaContent;
    socialMedia?: UbiOrganizationSocialMedia[];
}

export interface UbiOrganizationCreation {
    name: string;
    description: string;
    logoMediaId: number;
}
