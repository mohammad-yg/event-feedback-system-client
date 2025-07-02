import { ServiceResult } from "../service-result";
import { SERVER_BASE_URL } from "../services-config";
import https from 'https';
import axios from 'axios';

export type SignInServiceInput = {
    email: string,
    password: string,
}

export const signInService = async (input: SignInServiceInput): Promise<ServiceResult<{ email: string, accessToken: string }>> => {
    const url = SERVER_BASE_URL + '/api/auth/login';
    const body = {
        email: input.email,
        password: input.password
    }

    try {
        const response = await axios.post(url, body, {
            httpsAgent: new https.Agent({
                rejectUnauthorized: process.env.NODE_ENV !== 'development'
            })
        });

        if (response.status == 200) {
            const responseData = (await response.data);

            return {
                isSuccess: true,
                data: {
                    email: responseData.email,
                    accessToken: responseData.token,
                }
            }
        }

        return {
            isSuccess: true,
            data: await response.data()
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (err: any) {
        return {
            isSuccess: false,
            error: err?.response?.data?.errorKey
        }
    }
}