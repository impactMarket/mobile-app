export interface UbiCommunityDemographics {
    id: number;
    communityId: number;
    date: Date;
    male: number;
    female: number;
    undisclosed: number;
    totalGender: number;
    ageRange1: number;
    ageRange2: number;
    ageRange3: number;
    ageRange4: number;
    ageRange5: number;
    ageRange6: number;
}
export interface UbiCommunityDemographicsCreation {
    communityId: number;
    date: Date;
    male: number;
    female: number;
    undisclosed: number;
    totalGender: number;
    ageRange1: number;
    ageRange2: number;
    ageRange3: number;
    ageRange4: number;
    ageRange5: number;
    ageRange6: number;
}
