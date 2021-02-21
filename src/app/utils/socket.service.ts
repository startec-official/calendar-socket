import { Injectable } from '@angular/core';
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

  constructor(private calendarService: CalendarService) { }

  setupSocketConnection() {
    this.socket = io(environment.SOCKET_ENDPOINT);

    // initalize listeners
    this.socket.on('server-sched-update', (data: any) => {
      // check if the user already exists
      let matchedUser = this.connectedUsers.filter(user => user.id == data.id);
      // get row and column
      const newSchedDate = new Date(data.sched);
      const newRow = this.calendarService.getSchedRow(newSchedDate.getHours(), newSchedDate.getMinutes());
      const newCol = this.calendarService.getSchedCol(this.calendarService.resetTimeForDate(newSchedDate));
      if (matchedUser.length == 0) {
        const newUser = { id: data.id, row: newRow, col: newCol, prevRow: null, prevCol: null };
        this.connectedUsers.push(newUser);
        console.log(newUser);
      }
      else {
        matchedUser[0].prevRow = matchedUser[0].row;
        matchedUser[0].prevCol = matchedUser[0].col;
        matchedUser[0].row = newRow;
        matchedUser[0].col = newCol;
        console.log(matchedUser[0]);
      }
    });
  }

  sendSchedMessage(_id: string, _newSched: string) {
    this.socket.emit('client-sched-request', {
      id: _id,
      sched: _newSched
    });
  }
}
