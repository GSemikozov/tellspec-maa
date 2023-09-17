import { BaseEndpoint } from '@api/network';

import { ILoginData, IReturnLogin } from './model/user.types';

export class UserApi extends BaseEndpoint {
    /**
     * Login method.
     * @param loginData Object which contains credentials
     */
    login = async (loginData: ILoginData) => {
        const { data, error } = await this.http.post<IReturnLogin>(
            'users/rest-auth/login/',
            loginData,
        );

        if (data) {
            return {
                ...data.user,
                token: data.key,
            };
        } else {
            throw new Error(error?.message[0]);
        }
    };

    /**
     * Logout method.
     */
    logout = async () => {
        return this.http.post('users/rest-auth/logout/');
    };

    /**
     * CheckToken
     * @summary Check if the current token is valid
     */
    checkToken = async () => {
        return this.http.get('users/check-token/');
    };

    /**
     * ResetPassword
     * @summary Reset Password
     */
    resetPassword = async (email: string) => {
        const { data } = await this.http.post('/users/rest-auth/password/reset/', { email });
        return data?.detail;
    };
}
