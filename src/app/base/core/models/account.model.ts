import * as _ from 'lodash';
import { Authority } from './authority.model';

export class Account {
  id: number;
  login: string;
  profile: string;
  authorities: Array<Authority>;
  authoritiesStringArray: Array<string>;
  authenticated = false;
  constructor(account?: { id: number, login: string, profile: string, authorities: Array<string> }) {
    if (account) {
      _.assignIn(this, account);
      this.authenticated = false;
    }
  }
}
