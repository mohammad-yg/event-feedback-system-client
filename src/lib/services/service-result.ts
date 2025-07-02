export type ServiceResult<TData = never> = {
    isSuccess: false,
    error: string
} | {
    isSuccess: true,
    data: TData
}