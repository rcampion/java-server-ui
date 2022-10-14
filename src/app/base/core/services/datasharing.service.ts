import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IChatController } from 'ng-chat';

//import { File } from './../models/file.model';
import { AngularLogService } from '../../core/services/angular-log.service';
import { User } from '../models/user.model';
//import { ChatParticipantState } from '../models/chat-participant-state';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {
	
    public currentUser: BehaviorSubject<User> = new BehaviorSubject<User>(null);
	
    public ngChatInstance: BehaviorSubject<IChatController> = new BehaviorSubject<IChatController>(null);
    
    //public ngChatParticipantState = new BehaviorSubject<ChatParticipantState[]>([]);
    
    public isActiveContactsReady: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isUserContactsReady: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoginReady: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isUserAuthorized: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isPdfReady: BehaviorSubject<File> = new BehaviorSubject<File>(null);	
    public isPortal: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public peerId: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    public isJoinVideo: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isJoinReady: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private logger: AngularLogService) { }
}
