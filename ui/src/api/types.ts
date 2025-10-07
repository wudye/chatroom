export interface UserLoginParams {
  userAccount?: string;
  userPassword?: string;
}

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
    

export interface UserInfo  {
    id: string,
    name: string,
    email: string,
    avatar: string,
    groupNum: number,
    friendNum: number,
  }