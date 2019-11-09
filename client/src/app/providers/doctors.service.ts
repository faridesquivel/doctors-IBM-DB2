import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorsService {
  private _doctors = new BehaviorSubject<any>([]);

  get doctors() {
      return this._doctors.asObservable();
  }

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }
  
  fetchDoctors() {
      return new Promise((resolve, reject) => {
        return this.http.get('http://localhost:3000/', {}).subscribe((data: any) => {
            if (data.success === true) {
                this._doctors.next(data.data);
                resolve(data);
            } else {
                reject(data.err);
            }
        });
      });
  }
}
