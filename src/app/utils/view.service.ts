import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ViewService {

  private isMobileView: boolean;

  constructor() { }

  getIsMobileView(): boolean {
    if( this.isMobileView == null ) {
      this.isMobileView = false;
    }
    return this.isMobileView;
  }
}
