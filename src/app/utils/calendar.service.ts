import { Injectable, OnInit, resolveForwardRef } from '@angular/core';
import { ViewService } from './view.service';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  private daysOfWeek: string[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]
  private timesOfDay: string[];

  private currentDate: Date; // TODO: update after midnight
  private currentWeek: Date[]; // TODO: update after Saturday midnight

  public subdivisionCount: number;
  public is24HourFormat: boolean;

  private DEFAULT_IS24HOURFORMAT: boolean = false;
  private DEFAULT_SUBDIVISIONCOUNT: number = 30;

  constructor(private viewService: ViewService) { }

  public getDaysOfWeek(): string[] {
    return this.daysOfWeek;
  }

  public getTimesOfDay(is24HourFormat?: boolean, subdivisionCount?: number): string[] {
    if (this.timesOfDay == null)
      this.setTimesOfDay(is24HourFormat, subdivisionCount);
    return this.timesOfDay;
  }

  public getCurrentDate(): Date {
    if (this.currentDate == null)
      this.currentDate = new Date();
    return this.currentDate;
  }

  public getWeekDates(currentDate?: Date): Date[] {
    if (currentDate == null)
      currentDate = new Date(); // get current date

    let weekDates: Date[] = [];
    var first = currentDate.getDate() - currentDate.getDay()
    currentDate = this.resetTimeForDate(currentDate);
    for (let i = 0; i < 7; i++)
      weekDates.push(new Date(currentDate.setDate(first + i)));

    if (this.currentWeek == null)
      this.currentWeek = weekDates;
    return this.currentWeek;
  }

  private setTimesOfDay(is24HourFormat?: boolean, subdivisionCount?: number): void {
    this.is24HourFormat = is24HourFormat;
    this.subdivisionCount = subdivisionCount;
    this.timesOfDay = this.generateTimesOfDay(is24HourFormat, subdivisionCount);
  }

  private generateTimesOfDay(is24HourFormat?: boolean, subdvision?: number): string[] {
    if (subdvision != null && 60 % subdvision !== 0)
      throw new Error('Subdivision must be a factor of 60!! ex. 5, 10, 12 for every 5 minutes, every 10 minutes, every 12 minutes, etc.');
    else if (subdvision == null)
      subdvision = this.DEFAULT_SUBDIVISIONCOUNT;

    if (is24HourFormat == null)
      is24HourFormat = this.DEFAULT_IS24HOURFORMAT;

    let timesOfDay = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let min = 0; min < 60; min += subdvision) {
        timesOfDay.push(`${hour == 0 || hour == 12 ? '12' : (hour - 12 > 0 ? hour - 12 : hour)}:${`${min}`.padStart(2, '0')}${is24HourFormat ? '' : `${hour - 12 >= 0 ? ' PM' : ' AM'}`}`);
      }
    }
    return timesOfDay;
  }

  public generateCellDisplayMatrix(rowCount: number, colCount: number) {
    let displayMatrix = [];
    for (let i = 0; i < rowCount; i++) {
      let rowArray: boolean[] = [];
      for (let j = 0; j < colCount; j++) {
        rowArray.push(false);
      }
      displayMatrix.push(rowArray);
    }
    return displayMatrix;
  }

  public getIs24HourFormat(): boolean {
    if (this.is24HourFormat == null) {
      // console.warn(`'The is24HourFormat fieild is null. Set to default value ${this.DEFAULT_IS24HOURFORMAT}...'`);
      return this.DEFAULT_IS24HOURFORMAT;
    }
    return this.is24HourFormat;
  }

  public getSubdivisionCount(): number {
    if (this.subdivisionCount == null) {
      // console.warn(`The subdvisionCount field is null. Set to default value to ${this.DEFAULT_SUBDIVISIONCOUNT} (minutes)...`);
      return this.DEFAULT_SUBDIVISIONCOUNT;
    }
    return this.subdivisionCount;
  }

  getSchedRow(hour: number, minute: number): number {
    const maxRowNumber = this.getMaxrowNumber();
    const rowNumber = Math.round(maxRowNumber / 24 * (hour + minute / 60));
    return rowNumber;
  }

  getSchedCol(date: Date): number {
    if (this.viewService.getIsMobileView()) {
      if (this.getCurrentDate() == date)
        return 0;
      return -1;
    }
    
    for (let index = 0; index < this.currentWeek.length; index++) {
      const dayOfWeek = this.currentWeek[index];
      if (dayOfWeek.getTime() == date.getTime()) {
        return index;
      }
    }
    return -1;
  }

  getMaxrowNumber(): number {
    return 60 / this.getSubdivisionCount() * 24;
  }

  resetTimeForDate( inputDate : Date ) {
    inputDate.setHours(0);
    inputDate.setMinutes(0);
    inputDate.setSeconds(0);
    inputDate.setMilliseconds(0);
    return inputDate; // TODO: check if reassignment is necessary
  }
}
