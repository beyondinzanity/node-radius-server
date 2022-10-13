import fetch from 'node-fetch';
import { IAuthentication } from '../interfaces/Authentication.js';
import { IContextLogger, ILogger } from '../interfaces/Logger.js';

interface IHTTPAuthOptions {
	url: string;
}

export class HTTPAuth implements IAuthentication {
	private url: string;

	private logger: IContextLogger;

	constructor(config: IHTTPAuthOptions, logger: ILogger) {
		this.url = config.url;
		this.logger = logger.context('HTTPAuth');
	}

	async authenticate(email: string, password: string) {
		const result = await fetch(this.url, {
			method: 'post',
			body: JSON.stringify({
				email,
				password,
			}),
			headers: { 
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Access-Control-Allow-Credentials': 'true',
				'X-Requested-With': 'XMLHttpRequest',
			},
		});

		if (result.status === 200) {
			return true;
		}

		this.logger.log(`HTTP authentication failed, response code: ${result.status}`);

		return false;
	}
}
