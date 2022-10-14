import * as _ from 'lodash';
import { GeoIP } from './geo';
import { Authority } from './authority.model';

export class User {
	id: number;
	contactId: number;
	login: string;
	userName: string;
	password: string;
	firstName: string;
	lastName: string;
	presenceStatus: string;
	presenceImageUrl: string;
	currentRoom: string;
	enabled: string;
	email: string;
	ext: string;
	bio: string;
	image: string;
	isLoggedIn: string;
	apiKey: string;
	createdAt: string;
	updatedAt: string;
	loginAt: string;
	ipAddress: string;
	geoIP: GeoIP;

	constructor(user?: {
	id: number,
	contactId: number,
	login: string,
	userName: string,
	password: string,
	firstName: string,
	lastName: string,
	presenceStatus: string,
	presenceImageUrl: string,
	currentRoom: string,
	enabled: string,
	email: string,
	ext: string,
	bio: string,
	image: string,
	isLoggedIn: string,
	apiKey: string,
	createdAt: string,
	updatedAt: string,
	loginAt: string,
	ipAddress: string,
	geoIP: GeoIP
	}) {
		if (user) {
			_.assignIn(this, user);
			// this.authenticated = false;
		}
	}
}
