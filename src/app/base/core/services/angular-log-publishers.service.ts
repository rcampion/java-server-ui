import { Injectable } from '@angular/core';

import { AngularLogPublisher, AngularLogConsole } from "./angular-log-publishers";
import { AppLogsService } from './applogs.service';

// ****************************************************
// Logging Publishers Service Class
// ****************************************************
@Injectable()
export class AngularLogPublishersService {
  constructor(private repository: AppLogsService) {
    // Build publishers arrays
    this.buildPublishers();
  }

  // Public properties
  publishers: AngularLogPublisher[] = [];

  // *************************
  // Public methods
  // *************************
  // Build publishers array
  buildPublishers(): void {
    // Create instance of LogConsole Class
    this.publishers.push(new AngularLogConsole(this.repository));
  }
}