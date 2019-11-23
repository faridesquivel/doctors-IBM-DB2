import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  private _dates = new BehaviorSubject<any>([]);

  get dates() {
      return this._dates.asObservable();
  }

  constructor(
    private storage: Storage,
    private router: Router,
    private http: HttpClient
  ) { }

  fetchDates() {
    return new Promise((resolve, reject) => {
      return this.http.get('http://localhost:3000/listDates', {}).subscribe((data: any) => {
        if (data.success === true) {
            console.log('data is: ', data);
            this._dates.next(data);
            resolve({ success: true })
        } else {
          if (data.message) {
            reject(data.message);
          } else {
            reject();
          }
        }
      });
    });
  }
}
