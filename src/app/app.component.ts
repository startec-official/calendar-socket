import { Component, OnInit } from '@angular/core';
import { SocketService } from './utils/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'calendar-socket';

  constructor( private socketService : SocketService ) {}

  ngOnInit(): void {
    this.socketService.setupSocketConnection();
  }
}
