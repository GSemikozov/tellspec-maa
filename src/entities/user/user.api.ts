import {
  ILoginData,
  IReturnLogin,
  IUserData
} from './model/user.types'
import { BaseEndpoint } from '../../api/endpoints/base'

export class UserApi extends BaseEndpoint {
  /**
   * Login method.
   * @param loginData Object which contains credentials
   */
  login = async (loginData: ILoginData): Promise<IUserData> => {
    try {
      const result: IReturnLogin = await this.http.post('users/rest-auth/login/', loginData);
      return {
        ...result.data.user,
        token: result.data.key,
      }
    } catch (e) {
      throw e;
    }
  }

  /**
   * Logout method.
   */
  logout = async () => {
    try {
      return await this.http
        .post('users/rest-auth/logout/');
    } catch (e) {
      throw e;
    }
  }

  /**
   * CheckToken
   * @summary Check if the current token is valid
   */
  checkToken = async () => {
    try {
      return await this.http
        .get('users/check-token/');
    } catch (e) {
      throw e;
    }
  }
}
