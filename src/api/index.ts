import { UserApi } from '../entities/user/user.api'

export class API {
  public readonly users: UserApi

  constructor() {
    this.users = new UserApi(this)
  }
}
