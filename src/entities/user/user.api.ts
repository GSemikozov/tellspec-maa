import { BaseEndpoint } from '@api/network';

import { ILoginData, IReturnLogin } from './model/user.types';

export class UserApi extends BaseEndpoint {
    /**
     * Login method.
     * @param loginData Object which contains credentials
     */
    login = async (loginData: ILoginData) => {
        const result = await this.http.post<IReturnLogin>('users/rest-auth/login/', loginData);

        if (result.data) {
            return {
                ...result.data.user,
                token: result.data.key,
            };
        }

        return null;
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
