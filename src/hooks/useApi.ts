import { SERVER_BASE_URL } from 'src/lib/services/services-config'
import useSWR from 'swr'

const fetcher = async <T,>(url: string, accessToken: string | undefined = undefined): Promise<T> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const headers: any = {}

    if (accessToken)
        headers['Authorization'] = `Bearer ${accessToken}`

    const res = await fetch(SERVER_BASE_URL + url, {
        headers: headers
    })
    if (!res.ok) {
        const error = new Error('An error occurred while fetching the data.')
        throw error
    }
    return res.json()
}

export function useApi<T>(url: string | null, accessToken: string | undefined = undefined) {
    return useSWR<T>(url, (url: string) => fetcher(url, accessToken), {
        revalidateOnFocus: false,
        shouldRetryOnError: false
    })
}