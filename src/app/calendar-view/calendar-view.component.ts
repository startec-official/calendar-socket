import { Component, OnInit } from '@angular/core';
import { CalendarService } from '../utils/calendar.service';

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.css']
})
export class CalendarViewComponent implements OnInit {
  daysOfWeek : string[];
  timesOfDay : string[];

  constructor( private calendarService : CalendarService ) { }

  ngOnInit(): void {
    this.daysOfWeek = this.calendarService.getDaysOfWeek();
    this.timesOfDay = this.calendarService.getTimesOfDay();
  }

}