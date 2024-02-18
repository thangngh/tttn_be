import { IAddress } from "src/auth/interface/auth.interface";

export interface ICreateShop {

	name: string;
	description: string;
	phone: string;
	address: IAddress
}