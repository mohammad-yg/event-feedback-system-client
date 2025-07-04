import { axiosInstance } from "../axios-instance";
import { ServiceResult } from "../service-result";

export const feedbackService = async (eventId: number | string, rating: number, comment: string, accessToken: string): Promise<ServiceResult> => {
    try {
        const body = {
            eventId,
            rating,
            comment
        }
        await axiosInstance.post("/api/feedback",
            body,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        return {
            isSuccess: true,
            data: undefined
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (ex: any) {
        if (ex.response.data.errorKey = 'feedback already is exist')
            return {
                isSuccess: false,
                error: 'You have already submitted feedback for this event.'
            }

        if (ex.response.data.errorKey = 'EventIsNotFinished')
            return {
                isSuccess: false,
                error: ex.response.data.message
            }

        return {
            isSuccess: false,
            error: 'An unknown error has occurred'
        }
    }
}