import { axiosInstance } from "../axios-instance";
import type { ServiceResult } from "../service-result";

export type SignInServiceInput = {
    email: string,
    password: string,
}

export const signInService = async (input: SignInServiceInput): Promise<ServiceResult<{ email: string, accessToken: string }>> => {
    const url = '/api/auth/login';
    const body = {
        email: input.email,
        password: input.password
    }

    try {
        const response = await axiosInstance.post(url, body, {});

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