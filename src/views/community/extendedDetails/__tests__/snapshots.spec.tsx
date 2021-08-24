import { act, render } from '@testing-library/react-native';
import { CommunityAttributes, ManagerAttributes } from 'helpers/types/models';
import React from 'react';
import * as reactRedux from 'react-redux';
import Api from 'services/api';

import CommunityExtendedDetailsScreen from '../';

const community: CommunityAttributes = {
    id: 1,
    publicId: '3f49b131-e097-4155-8f28-46c95590d42f',
    requestByAddress: '0xb10199414d158a264e25a5ec06b463c0cd8457bb',
    contractAddress: '0xd48466ffc8b6190d33fb6b27035a032658d392ee',
    name: 'Example Community',
    description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse quis interdum justo, nec sollicitudin lectus. Quisque malesuada metus lacinia facilisis pretium. Maecenas semper lacus id ante porttitor, non ultricies nunc suscipit. Vestibulum hendrerit eros vel mollis blandit. Nam tincidunt libero nunc, sed gravida tortor vulputate ut. Donec ullamcorper dui erat, vitae consectetur neque auctor sit amet. Aliquam a lacus congue, scelerisque orci vitae, accumsan tellus. Nunc ultrices convallis euismod.',
    city: 'Lauro de Freitas',
    country: 'BR',
    gps: { latitude: 1, longitude: 2 },
    email: 'eu@amigos.txt',
    visibility: 'public',
    status: 'valid',
    createdAt: new Date(),
    updatedAt: new Date(),
    currency: 'BRL',
    descriptionEn: null,
    language: 'pt',
    started: new Date(),
    coverMediaId: 260,
    contract: {
        claimAmount: '750000000000000000',
        maxClaim: '400000000000000000000',
        baseInterval: 86400,
        incrementInterval: 300,
        createdAt: new Date(),
        updatedAt: new Date(),
        communityId: 1,
    },
    state: {
        claimed: '61942500000000000000000',
        claims: 55405,
        beneficiaries: 656,
        raised: '62151145240504400207738',
        backers: 37,
        createdAt: new Date(),
        updatedAt: new Date(),
        removedBeneficiaries: 668,
        managers: 4,
        communityId: 1,
    },
};

describe('create community [snapshot]', () => {
    const useSelectorMock = reactRedux.useSelector as jest.Mock<any, any>;

    const communityListManagersMock = jest.spyOn(Api.community, 'listManagers');

    beforeAll(() => {
        useSelectorMock.mockImplementation((callback) => {
            return callback({
                app: {
                    exchangeRates: { USD: 1 },
                },
                user: {
                    metadata: {
                        currency: 'USD',
                        avatar: 'something.jpg',
                    },
                    wallet: {
                        address: '0xd7632B7588DF8532C0aBA55586167C2a315Fd768',
                    },
                },
                communities: {
                    community,
                },
            });
        });

        communityListManagersMock.mockImplementation(() =>
            Promise.resolve([
                {
                    address: '0xb10199414d158a264e25a5ec06b463c0cd8457bb',
                    active: true,
                    communityId: '3f49b131-e097-4155-8f28-46c95590d42f',
                    id: 1,
                    user: {
                        address: '0xb10199414d158a264e25a5ec06b463c0cd8457bb',
                        children: 2,
                        currency: 'CELO',
                        gender: 'u',
                        language: 'pt',
                        lastLogin: new Date(),
                        username: 'No Name',
                        pushNotificationToken: '',
                        year: 1990,
                        avatarMediaId: 0,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    address: '0xc10199414d158a264e25a5ec06b463c0cd8457bb',
                    active: true,
                    communityId: '3f49b131-e097-4155-8f28-46c95590d42f',
                    id: 2,
                    user: {
                        address: '0xc10199414d158a264e25a5ec06b463c0cd8457bb',
                        children: 2,
                        currency: 'CELO',
                        gender: 'u',
                        language: 'pt',
                        lastLogin: new Date(),
                        username: null,
                        pushNotificationToken: '',
                        year: 1990,
                        avatarMediaId: 0,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    address: '0xd10199414d158a264e25a5ec06b463c0cd8457bb',
                    active: true,
                    communityId: '3f49b131-e097-4155-8f28-46c95590d42f',
                    id: 2,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ] as ManagerAttributes[])
        );
    });

    it('renders correctly', async () => {
        const tree = render(<CommunityExtendedDetailsScreen />);
        const { queryAllByTestId } = tree;
        await act(async () => {});
        await act(async () => {
            queryAllByTestId('manager-box');
        });

        expect(tree.toJSON()).toMatchSnapshot();
    });
});
