import { configureStore } from '@reduxjs/toolkit';

import { saveToStorage } from '@middlewares/storage';
import { userReducer } from '@entities/user';
import { donorsReducer } from '@entities/donors';
import { groupsReducer } from '@entities/groups';
import { addMilkFormReducer } from '@features/add-milk-form';
import { reportsReducer } from '@entities/reports';

import { appReducer } from './model/app.slice';

export const store = configureStore({
    reducer: {
        app: appReducer,
        user: userReducer,
        donors: donorsReducer,
        groups: groupsReducer,
        reports: reportsReducer,
        addMilkForm: addMilkFormReducer,
    },
    middleware: getDefaultMiddleware => {
        return getDefaultMiddleware().concat(saveToStorage);
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
