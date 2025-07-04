import type { ServiceResult } from "../service-result";
import { axiosInstance } from "../axios-instance";

export const registerEventService = async (eventId: number | string, token: string): Promise<ServiceResult> => {
    try {
        await axiosInstance.post(`/api/events/${eventId}/register`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return {
            isSuccess: true,
            data: undefined
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (ex: any) {
        return {
            isSuccess: false,
            error: ex.response.data.errorKey
        }
    }
}