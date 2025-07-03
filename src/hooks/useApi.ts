import useSWR from 'swr'

const fetcher = async <T,>(url: string): Promise<T> => {
    const res = await fetch(url)
    if (!res.ok) {
        const error = new Error('An error occurred while fetching the data.')
        throw error
    }
    return res.json()
}

export function useApi<T>(url: string | null) {
    return useSWR<T>(url, fetcher, {
        revalidateOnFocus: false,
        shouldRetryOnError: false
    })
}