import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ViewService {

  private isMobileView: boolean;

  private DEFAULT_ISMOBILEVIEW = true;

  constructor() { }

  getIsMobileView(): boolean {
    if( this.isMobileView == null ) {
      this.isMobileView = this.DEFAULT_ISMOBILEVIEW;
    }
    return this.isMobileView;
  }
}
