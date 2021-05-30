import { AccountType } from '../enum/account-type.enum';

export interface User {
    lastName: string,
    firstName: string,
    uid: string,
    email: string,
    password: string,
    accountType: AccountType;
}
