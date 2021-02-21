import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { off } from 'process';
import { CalendarService } from '../utils/calendar.service';

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.css']
})
export class CalendarViewComponent implements OnInit, AfterViewInit {

  previousCell: { prevRow: number, prevCol: number };
  daysOfWeek: string[];
  timesOfDay: string[];
  currentWeekDates: Date[];
  currentDate: Date;
  shouldDisplayCell: any;

  constructor(private calendarService: CalendarService) { }

  ngOnInit(): void {
    this.daysOfWeek = this.calendarService.getDaysOfWeek();
    this.timesOfDay = this.calendarService.getTimesOfDay();
    this.currentDate = this.calendarService.getCurrentDate();
    this.currentWeekDates = this.calendarService.getWeekDates();

    if (this.isMobileView())
      this.shouldDisplayCell = this.calendarService.generateCellDisplayMatrix(this.timesOfDay.length, 1);
    else
      this.shouldDisplayCell = this.calendarService.generateCellDisplayMatrix(this.timesOfDay.length, this.daysOfWeek.length);
  }

  ngAfterViewInit(): void {
    var elmnt = document.getElementById(`rowNumber-${this.getCurrentTimeScroll()}`);
    elmnt.scrollIntoView();
  }

  onCellClick(row: number, col: number) {
    this.shouldDisplayCell[row][col] = true;
    if (this.previousCell != null) {
      if (this.previousCell != null && (row != this.previousCell.prevRow || col != this.previousCell.prevCol))
        this.shouldDisplayCell[this.previousCell.prevRow][this.previousCell.prevCol] = false;
    }
    this.previousCell = { prevRow: row, prevCol: col };
    // TODO : disable setting previous when on the same cell
  }

  getDivHeight(timeDuration?: number): string {
    if (timeDuration != null && timeDuration < 0) // TODO : allow extending to multiple days
      throw new Error('time duration must be a positive number! ex. 10, 60, 100 for 10 minutes, 60 minutes, 100 minutes, etc.');
    else if (timeDuration == null)
      timeDuration = 60; // setddefault time duration here
    let divHeight = `${Math.round(timeDuration / this.calendarService.getSubdivisionCount()) * 100}%`;
    return divHeight;
  }

  getCurrentTimeScroll(offset?: number): number {
    if (offset == null)
      offset = 0;

    const maxRowNumber = 60 / this.calendarService.getSubdivisionCount() * 24;
    const rowNumber = Math.round(maxRowNumber / 24 * (this.currentDate.getHours() + (this.currentDate.getMinutes() / 60)));
    return (rowNumber + offset > maxRowNumber || rowNumber + offset < 0 ? rowNumber : rowNumber + offset);
  }

  isMobileView(): boolean {
    return true;
  }
}
