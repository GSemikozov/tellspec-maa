import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiInstance } from '@api/network';

import type { IGroup, IGetGroupsRequest } from './groups.types';

export const fetchGroup = createAsyncThunk(
    'groups/fetch',
    async (data: IGetGroupsRequest): Promise<IGroup> => {
        try {
            return apiInstance.groups.fetchGroup(data);
        } catch (error) {
            console.error(error);
            throw new Error("Can't fetch donors list. Try again later");
        }
    },
);
