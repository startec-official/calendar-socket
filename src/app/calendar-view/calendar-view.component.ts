import { Component, OnInit } from '@angular/core';
import { CalendarService } from '../utils/calendar.service';

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.css']
})
export class CalendarViewComponent implements OnInit {

  previousCell: { prevRow: number, prevCol: number };
  daysOfWeek: string[];
  timesOfDay: string[];
  currentWeekDates: Date[];
  shouldDisplayCell: any;

  constructor(private calendarService: CalendarService) { }

  ngOnInit(): void {
    this.daysOfWeek = this.calendarService.getDaysOfWeek();
    this.timesOfDay = this.calendarService.getTimesOfDay();
    this.shouldDisplayCell = this.calendarService.generateCellDisplayMatrix(this.timesOfDay.length, this.daysOfWeek.length);
    this.currentWeekDates = this.calendarService.getWeekDates();
  }

  onCellClick(row: number, col: number) {
    this.shouldDisplayCell[row][col] = true;
    if (this.previousCell != null) {
      if (this.previousCell != null && (row != this.previousCell.prevRow || col != this.previousCell.prevCol))
        this.shouldDisplayCell[this.previousCell.prevRow][this.previousCell.prevCol] = false;
    }
    this.previousCell = { prevRow: row, prevCol: col };
    console.log(this.previousCell);
    // TODO : disable setting previous when on the same cell
  }

  getDivHeight( timeDuration? : number ) : string {
    if( timeDuration != null && timeDuration < 0 ) // TODO : allow extending to multiple days
      throw new Error('time duration must be a positive number! ex. 10, 60, 100 for 10 minutes, 60 minutes, 100 minutes, etc.');
    else if( timeDuration == null )
      timeDuration = 60; // setddefault time duration here
    let divHeight = `${(timeDuration/this.calendarService.getSubdivisionCount())*100}%`;
    return divHeight;
  }
}
