

export interface UserRegisterParams {
    userName: string
    email: string
    userAccount: string
    userPassword: string
    checkPassword: string

}


export interface UserRegisterResponse {
    httpStatus: number
    ok?: boolean
    tokenName?: string
    tokenValue?: string
    message?: string
}
    