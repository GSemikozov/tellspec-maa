import { BaseEndpoint } from '@api/network';

import { ILoginData, IReturnLogin, IUserData } from './model/user.types';

export class UserApi extends BaseEndpoint {
    /**
     * Login method.
     * @param loginData Object which contains credentials
     */
    login = async (loginData: ILoginData): Promise<IUserData> => {
        const result: IReturnLogin = await this.http.post('users/rest-auth/login/', loginData);

        return {
            ...result.data.user,
            token: result.data.key,
        };
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
}
