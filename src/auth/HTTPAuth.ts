import fetch from 'node-fetch';
import axios, { AxiosRequestConfig, AxiosPromise } from 'axios';
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

	async authenticate(username: string, password: string) {
		const result = await fetch(this.url, {
			method: 'post',
			body: JSON.stringify({
				username,
				password,
			}),
			headers: { 
				'Content-Type': 'application/json',
				'Access-Control-Allow-Credentials': 'true',
				'Credentials': 'same-origin',
			},
		});

		if (result.status === 200) {
			return true;
		} else if (result.status === 204) {
			return true;
		}

		this.logger.log(`HTTP authentication failed, response code: ${result.status}`);

		return false;
	}
}
