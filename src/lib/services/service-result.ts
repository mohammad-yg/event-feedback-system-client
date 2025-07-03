export type ServiceResult<TData = undefined> = {
    isSuccess: false,
    error: string
} | {
    isSuccess: true,
    data: TData
}