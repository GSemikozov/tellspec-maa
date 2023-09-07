import { decrypt } from '@api/shared';
import { BaseEndpoint } from '@api/network';
import { getUserLocalData } from '@entities/user/user.utils';

import { IDonor, IDonorEncrypted } from './model/donors.types';

// TODO: refactor this
/**
 * Handle converting the recieved server data to Donor type
 * @param donorPayload
 * @return Donor
 */
const decodeDonorInformation = async (source: any): Promise<IDonor> => {
    const sensitiveData: string = source.sensitive_data.trim();
    const result: IDonor = {
        data: source.data,
        archived: source.archived,
        uuid: source.uuid,
        archived_at: source.archived_at,
        created_at: source.created_at,
        last_modified_at: source.last_modified_at,
        sensitive_data: source.sensitive_data,
    };

    if (!sensitiveData) {
        throw new Error('Invalid sensitive data');
    }

    const decodedData = await decrypt(sensitiveData);

    if (decodedData) {
        result.sensitive_data = JSON.parse(decodedData);
        return result;
    }

    throw new Error('Invalid sensitive data');
};

//
// /**
//  * Handle converting the Donor type to what the server needs
//  * @param donorPayload
//  * @return Donor
//  */
// const encodeDonorInformation = (source: IDonor): Promise<any> => {
//   return new Promise((resolve, reject) => {
//     if (!source.sensitive_data) {
//       reject('Invalid sensitive data')
//     } else {
//       const Temp: string = JSON.stringify(source.sensitive_data)
//
//       encrypt(Temp)
//       .then((result) => {
//         const EncodedData: any = {
//           uuid: source.uuid,
//           data: source.data,
//           archived: source.archived,
//           sensitive_data: result,
//           archived_at: source.archived_at,
//           created_at: source.created_at,
//           last_modified_at: source.last_modified_at
//         }
//         resolve(EncodedData)
//       })
//       .catch((error) => {
//         reject(error)
//       })
//     }
//   })
// }

export class DonorsApi extends BaseEndpoint {
    private DonorUrl = 'main/donors/';
    private AllDonorsUrl = 'main/donors-all/';

    // addDonor = async (donorData: IDonor): Promise<IDonorList> => {
    //   return new Promise<any>((resolver, reject) => {
    //     getUserLocalData()
    //     .then((userData) => {
    //       encodeDonorInformation(donorData)
    //       .then((result) => {
    //         this.http
    //         .post(
    //           `${this.DonorUrl}`,
    //           result,
    //           { preemie_group_id: userData.metadata.group_id },
    //           {},
    //           true
    //         )
    //         .then((result: { data: any; error: any }) => {
    //           const Data: IDonorList = result.data
    //           resolver(Data)
    //         })
    //         .catch((error) => {
    //           reject(error)
    //         })
    //       })
    //       .catch((error) => {
    //         reject(error)
    //       })
    //     })
    //     .catch((error) => {
    //       reject(error)
    //     })
    //   })
    // }

    // editDonor = async (donorData: IDonor): Promise<IDonorList> => {
    //   return new Promise<any>((resolve, reject) => {
    //     getUserLocalData()
    //     .then((userData) => {
    //       const Param = {
    //         preemie_group_id: userData.metadata.group_id,
    //         uuid: donorData.uuid
    //       }
    //       encodeDonorInformation(donorData)
    //       .then((result: IDonorEncrypted) => {
    //         if (result.data.donations) {
    //           result.data.donations = parseDonations(result.data.donations, userData, 'add')
    //         }
    //         this.http
    //         .patch(`${this.DonorUrl}`, result, Param, {}, true)
    //         .then((result: { data: any; error: any }) => {
    //           const Data: IDonorList = result.data
    //           resolve(Data)
    //         })
    //         .catch((error) => {
    //           reject(error)
    //         })
    //       })
    //       .catch((error) => {
    //         reject(error)
    //       })
    //     })
    //     .catch((error) => {
    //       reject(error)
    //     })
    //   })
    // }

    getDonor = async (donorId: string): Promise<IDonor | null> => {
        const userData = await getUserLocalData();

        if (!userData) {
            throw new Error("User isn't authenticated");
        }

        const Param = {
            preemie_group_id: userData.metadata.group_id,
            uuid: donorId,
        };

        const response = await this.http.get(`${this.DonorUrl}`, Param, {});
        const { data, detail } = response;

        if (!detail && data) {
            const decodedDonorInformation = await decodeDonorInformation(data);
            return decodedDonorInformation;
        }

        return null;
    };

    getAllDonors = async (complete_data: boolean, show_archived: boolean): Promise<IDonor[]> => {
        const userData = await getUserLocalData();

        if (!userData) {
            throw new Error("Can't get donors. User is not authenticated");
        }

        const Param = {
            preemie_group_id: userData.metadata.group_id,
            complete_data,
            show_archived,
        };

        const result: { data: IDonorEncrypted[] } = await this.http.get(
            `${this.AllDonorsUrl}`,
            Param,
            {},
        );

        if (complete_data) {
            const decryptedArray: IDonor[] = [];

            if (result.data) {
                for (const donor of result.data) {
                    const decryptResult = await decrypt(donor.sensitive_data as string);

                    if (decryptResult) {
                        donor.sensitive_data = JSON.parse(decryptResult);
                    }

                    decryptedArray.push(donor as IDonor);
                }
            }

            result.data = decryptedArray;
        }

        return result.data as IDonor[];
    };

    // deleteDonor = async (uuid: string, permanently?: boolean): Promise<IDonor[]> => {
    //   return new Promise<any>((resolve, reject) => {
    //     getUserLocalData()
    //     .then((userData) => {
    //       const Param = {
    //         preemie_group_id: userData.metadata.group_id,
    //         uuid: uuid,
    //         permanently
    //       }
    //
    //       this.http
    //       .delete(`${this.DonorUrl}`, Param, {}, true)
    //       .then((result: { data?: any; detail?: any }) => {
    //         if (!result.detail && result.data) {
    //           resolve(result.data)
    //         } else {
    //           reject(result.detail)
    //         }
    //       })
    //       .catch((error) => {
    //         reject(error)
    //       })
    //     })
    //     .catch((error) => {
    //       reject(error)
    //     })
    //   })
    // }
}
