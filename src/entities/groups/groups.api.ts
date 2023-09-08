// import { v4 as uuidv4 } from 'uuid'
// import { encrypt } from '../utils/crypt'
import { BaseEndpoint } from '@api/network';
// import Users from './users'

import type { IGetGroupsRequest, IGroup } from './model/groups.types';

export class GroupsApi extends BaseEndpoint {
    // addGroup = async (args: any) => {
    //   return this.http
    //   .post('/main/preemie-groups/', args, {}, {}, true)
    //   .then((result) => {
    //     return result
    //   })
    //   .catch((e) => {
    //     return e
    //   })
    // }

    // createNewGroupAdmin = async (args: any) => {
    //   const user = new Users(this.getClient())
    //
    //   const uuid = uuidv4()
    //
    //   return encrypt(uuid, args.user.password1).then((key) => {
    //     const userdata = args.user
    //     userdata.metadata = { group_key: key }
    //
    //     this.addGroup(args.group).then((result) => {
    //       if (result.data.status === 200) {
    //         user.register(args.user).then(() => {
    //           this.addMembers({
    //             preemie_group_id: result.data.preemie_group_id,
    //             member_type: 'admin',
    //             data: [args.user.email]
    //           }).then((retMember) => {
    //             return retMember
    //           })
    //         })
    //       }
    //     })
    //   })
    // }

    // editGroup = async (args: IPreemieGroup) => {
    //   const body = args
    //   const query = {
    //     preemie_group_id: args.preemie_group_id
    //   }
    //   return this.http
    //   .patch('/main/preemie-groups/', body, query, {}, true)
    //   .then((result) => {
    //     return result
    //   })
    //   .catch((e) => {
    //     return e
    //   })
    // }

    // getMembers = (args: any): Promise<IGetMembers> => {
    //   return new Promise((resolve, reject) => {
    //     this.http
    //     .get('/main/preemie-group-members/', args, {}, true)
    //     .then((result) => {
    //       resolve(result)
    //     })
    //     .catch((e) => {
    //       reject(e)
    //     })
    //   })
    // }

    /**
     * Get one or more preemie Groups of the user
     * @param args
     */
    fetchGroup = async (args: IGetGroupsRequest): Promise<IGroup> => {
        try {
            const { data } = await this.http.get('/main/preemie-groups/', args, {});
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    // addMembers = (args: any) => {
    //   return new Promise((resolve, reject) => {
    //     const body = args.data
    //     const query = {
    //       member_type: args.member_type,
    //       preemie_group_id: args.preemie_group_id
    //     }
    //
    //     this.http
    //     .post('/main/preemie-group-members/', body, query, {}, true)
    //     .then((result) => {
    //       resolve(result)
    //     })
    //     .catch((e) => {
    //       reject(e)
    //     })
    //   })
    // }
}
