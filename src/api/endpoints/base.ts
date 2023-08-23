import { API } from '../index'
import { Http } from '../http'

export class BaseEndpoint {
  http: Http;

  constructor(protected client: API) {
    this.http = new Http();
  }

  /**
   * Return the client.
   */
  getClient() {
    return this.client;
  }
}
