export interface ILogin {
	username: string;
	password: string;
}

export enum ProviderType {
	USERNAME = "USERNAME",
	GOOGLE = "GOOGLE",
	// FACEBOOK = "FACEBOOK",
}

export interface IRegister {
	firstName: string;
	lastName: string;
	email: string;
	username: string;
	password?: string;
	providerType?: ProviderType;
	role?: enumRole;
	isActive?: boolean;
	avatar?: string;
	gender?: string;
}

export interface IFullName {
	firstName: string;
	lastName: string;
}

export interface IAddress {
	city: string;
	district: string;
	street: string;
	country: string;
}

export enum enumRole {
	USER = 1,
	ADMIN = 2,
	SHOPPER = 3,
}

export interface IKey {
	[key: string]: string
}