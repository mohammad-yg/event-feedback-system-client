import axios from "axios";
import { ServiceResult } from "../service-result";
import { SERVER_BASE_URL } from "../services-config";

export const registerEventService = async (eventId: number, token: string): Promise<ServiceResult> => {
    try {
        const result = await axios.post(SERVER_BASE_URL + `/api/events/${eventId}/register`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })


        return {
            isSuccess: true,
            data: undefined
        }
    }
    catch {
        return {
            isSuccess: false,
            error: ''
        }
    }
}