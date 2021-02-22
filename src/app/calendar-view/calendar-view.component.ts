import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CalendarService } from '../utils/calendar.service';
import { SocketService } from '../utils/socket.service';
import { ViewService } from '../utils/view.service';

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
  isMobileView: boolean;

  constructor(private calendarService: CalendarService,
    private socketService: SocketService,
    private datePipe: DatePipe,
    private viewService: ViewService) { }

  ngOnInit(): void {
    this.isMobileView = this.viewService.getIsMobileView();
    this.daysOfWeek = this.calendarService.getDaysOfWeek();
    this.timesOfDay = this.calendarService.getTimesOfDay();
    this.currentDate = this.calendarService.getCurrentDate();
    this.currentWeekDates = this.calendarService.getWeekDates();

    if (this.viewService.getIsMobileView())
      this.shouldDisplayCell = this.calendarService.generateCellDisplayMatrix(this.timesOfDay.length, 1);
    else
      this.shouldDisplayCell = this.calendarService.generateCellDisplayMatrix(this.timesOfDay.length, this.daysOfWeek.length);

    this.socketService.updateViewEventEmitter.subscribe((updateViewData: { id: string, row: number, col: number, prevRow: number, prevCol: number }) => {
      this.updateView(updateViewData);
    });
  }

  ngAfterViewInit(): void {
    var elmnt = document.getElementById(`rowNumber-${this.getCurrentTimeRow()}`);
    elmnt.scrollIntoView();
  }

  onCellClick(row: number, col: number) {
    // this.shouldDisplayCell[row][col] = true;
    this.socketService.sendSchedMessage('abcd', (this.timesOfDay[row] + ',' + this.datePipe.transform(this.currentWeekDates[col], 'yyyy-MM-dd')));
    // if (this.previousCell != null) {
    //   if (this.previousCell != null && (row != this.previousCell.prevRow || col != this.previousCell.prevCol))
    //     this.shouldDisplayCell[this.previousCell.prevRow][this.previousCell.prevCol] = false;
    // }
    // this.previousCell = { prevRow: row, prevCol: col };
  }

  updateView({ id, row, col, prevRow, prevCol }): void {
    // TODO: allow for multiple users occupying the same slot
    // TODO: accomodate for removing one user from a slot occupied by mutliple users 

    if( row != -1 && col != -1 ) {
      this.shouldDisplayCell[row][col] = true;
      if( prevRow != null && prevCol != null )
        this.shouldDisplayCell[prevRow][prevCol] = false;
    }
  }

  getDivHeight(timeDuration?: number): string {
    if (timeDuration != null && timeDuration < 0) // TODO : allow extending to multiple days
      throw new Error('time duration must be a positive number! ex. 10, 60, 100 for 10 minutes, 60 minutes, 100 minutes, etc.');
    else if (timeDuration == null)
      timeDuration = 60; // setddefault time duration here
    let divHeight = `${Math.round(timeDuration / this.calendarService.getSubdivisionCount()) * 100}%`;
    return divHeight;
  }

  getCurrentTimeRow(offset?: number): number {
    if (offset == null)
      offset = 0;

    const maxRowNumber = this.calendarService.getMaxrowNumber();
    const rowNumber = this.calendarService.getSchedRow(this.currentDate.getHours(), this.currentDate.getMinutes());
    return (rowNumber + offset > maxRowNumber || rowNumber + offset < 0 ? rowNumber : rowNumber + offset);
  }
}
