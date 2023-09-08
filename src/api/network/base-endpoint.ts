import { Http } from './http';

import type { API } from './index';

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
