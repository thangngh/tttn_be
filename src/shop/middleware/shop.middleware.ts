import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { PageVisitService } from "src/page-visit/page-visit.service";

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
	private logger = new Logger();
	constructor(
		private readonly pageVisitService: PageVisitService
	) { }
	async use(request: Request, response: Response, next: NextFunction): Promise<void> {
		const { ip, method, originalUrl } = request;
		response.on("finish", async () => {
			const msg = `-------> ip:  ${ip} ${method} ${originalUrl}`;
			if (originalUrl.indexOf('/api/shop/shop/') !== -1) {
				await this.pageVisitService.create({
					ip: ip,
					shopId: +(originalUrl.slice(originalUrl.lastIndexOf('/') + 1))
				})
			}
			// console.log(originalUrl.slice(originalUrl.lastIndexOf('/') + 1))
			// this.logger.warn(msg);
		});

		next();
	}
}