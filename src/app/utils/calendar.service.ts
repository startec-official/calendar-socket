import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  private daysOfWeek : string[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ]

  private timesOfDay : string[];

  constructor() { }

  public getDaysOfWeek() : string[] {
    return this.daysOfWeek;
  }

  public getTimesOfDay() : string[] {
    if (this.timesOfDay == null)
      this.timesOfDay = this.generateTimesOfDay();
    return this.timesOfDay;
  }

  private generateTimesOfDay() : string[] {
    let timesOfDay = [];
    for (let hour = 0; hour < 24; hour++) {
      timesOfDay.push( `${hour}:00` );
      timesOfDay.push( `${hour}:30` );
    }
    console.log(timesOfDay);
    return timesOfDay;
  }
}
