import { Injectable } from '@angular/core';

import { AngularLogPublishersService } from "./angular-log-publishers.service";
import { AngularLogPublisher } from "./angular-log-publishers";

// ****************************************************
// Log Level Enumeration
// ****************************************************
export enum LogLevel {
  All = 0,
  Debug = 1,
  Info = 2,
  Warn = 3,
  Error = 4,
  Fatal = 5,
  Off = 6
}

// ****************************************************
// Log Entry Class
// ****************************************************
export class AngularLogEntry {
  // Public Properties
  entryDate: Date = new Date();
  message: string = "";
  level: LogLevel = LogLevel.Debug;
  extraInfo: any[] = [];
  logWithDate: boolean = true;

  // **************
  // Public Methods
  // **************
  buildLogString(): string {
    let value: string = "";

    if (this.logWithDate) {
      value = new Date() + " - ";
    }
    value += "Type: " + LogLevel[this.level];
    value += " - Message: " + this.message;
    if (this.extraInfo.length) {
      value += " - Extra Info: "
        + this.formatParams(this.extraInfo);
    }

    return value;
  }

  // ***************
  // Private Methods
  // ***************
  private formatParams(params: any[]): string {
    let ret: string = params.join(",");

    // Is there at least one object in the array?
    if (params.some(p => typeof p == "object")) {
      ret = "";
      // Build comma-delimited string
      for (let item of params) {
        ret += JSON.stringify(item) + ",";
      }
    }

    return ret;
  }
}

// ****************************************************
// Log Service Class
// ****************************************************
@Injectable()
export class AngularLogService {
  constructor(private publishersService: AngularLogPublishersService) {
    // Set publishers
    this.publishers = this.publishersService.publishers;
  }

  // Public Properties
  publishers: AngularLogPublisher[];
  level: LogLevel = LogLevel.All;
  logWithDate: boolean = true;

  // *************************
  // Public methods
  // *************************
  debug(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Debug, optionalParams);
  }

  info(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Info, optionalParams);
  }

  warn(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Warn, optionalParams);
  }

  error(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Error, optionalParams);
  }

  fatal(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Fatal, optionalParams);
  }

  log(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.All, optionalParams);
  }

  clear(): void {
    for (let logger of this.publishers) {
      logger.clear()
        .subscribe(response => {(response)});
    }
  }

  // *************************
  // Private methods
  // *************************
  private shouldLog(level: LogLevel): boolean {
    let ret: boolean = false;

    if ((level >= this.level &&
      level !== LogLevel.Off) ||
      this.level === LogLevel.All) {
      ret = true;
    }

    return ret;
  }

  private writeToLog(msg: string, level: LogLevel, params: any[]) {
    if (this.shouldLog(level)) {
      // Declare variables
      let entry: AngularLogEntry = new AngularLogEntry();

      // Build Log Entry
      entry.message = msg;
      entry.level = level;
      entry.extraInfo = params;
      entry.logWithDate = this.logWithDate;

      for (let logger of this.publishers) {
        logger.log(entry)
          .subscribe(response => {response});
      }
    }
  }
}