export interface UbiOrganizationSocialMedia {
    id: number;
    organizationId: number;
    mediaType: string;
    url: string;
}

export interface UbiOrganizationSocialMediaCreation {
    organizationId: number;
    mediaType: string;
    url: string;
}
