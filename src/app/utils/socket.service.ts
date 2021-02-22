import { EventEmitter, Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { CalendarService } from './calendar.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  socket: any;
  connectedUsers: {
    id: string,
    row: number,
    col: number,
    prevRow: number,
    prevCol: number
  }[] = []; // TODO: find more efficient way  to track user input

  prevUpdateViewId: string;

  updateViewEventEmitter: EventEmitter<any> = new EventEmitter();

  constructor(private calendarService: CalendarService) { }

  setupSocketConnection() {
    this.socket = io(environment.SOCKET_ENDPOINT);

    // initalize listeners
    this.socket.on('server-sched-update', (data: any) => {
      this.emitUpdateViewMessage(data);
    });
  }

  sendSchedMessage(_id: string, _newSched: string) {
    this.socket.emit('client-sched-request', {
      id: _id,
      sched: _newSched
    });
  }

  emitUpdateViewMessage(data: any): void {
    // check if the user already exists
    let matchedUser = this.connectedUsers.filter(user => user.id == data.id);
    // get row and column
    const newSchedDate = new Date(data.sched);
    const newRow = this.calendarService.getSchedRow(newSchedDate.getHours(), newSchedDate.getMinutes());
    const newCol = this.calendarService.getSchedCol(this.calendarService.resetTimeForDate(newSchedDate));

    let currentUser: { id: string, row: number, col: number, prevRow: number, prevCol: number };

    if (matchedUser.length == 0) {
      const newUser = { id: data.id, row: newRow, col: newCol, prevRow: null, prevCol: null };
      this.connectedUsers.push(newUser);
      currentUser = newUser;
    }
    else {
      matchedUser[0].prevRow = matchedUser[0].row;
      matchedUser[0].prevCol = matchedUser[0].col;
      matchedUser[0].row = newRow;
      matchedUser[0].col = newCol;
      currentUser = matchedUser[0];
    }

    if (this.prevUpdateViewId == null)
      this.prevUpdateViewId = currentUser.id;

      // TODO: restrict clicking on the same block
    // if (currentUser.id != this.prevUpdateViewId || currentUser.prevRow != currentUser.row || currentUser.prevCol != currentUser.prevRow) {
    //   this.updateViewEventEmitter.emit(currentUser);
    //   this.prevUpdateViewId = currentUser.id;
    // }

    this.updateViewEventEmitter.emit(currentUser);
    this.prevUpdateViewId = currentUser.id;
  }

}
