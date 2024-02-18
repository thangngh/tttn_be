export interface JwtPayload {
	id: number;
	username: string;
	sub: string;
	iat: number;
	exp: number;
}