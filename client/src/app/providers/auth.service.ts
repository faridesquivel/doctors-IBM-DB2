import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isUserAuthenticated = false;

  get isUserAuthenticated() {
    return this.checkUserAuth;
  }

  get checkUserAuth() {
    return this.storage.get('currentUser').then(val => {
      if (val) {
        return JSON.parse(val);
      } else {
        return null;
      }
    });
  }

  constructor(
    private storage: Storage,
    private router: Router,
    private http: HttpClient
  ) { }

  login(email, password) {
    return new Promise((resolve, reject) => {
      return this.http.post('http://localhost:3000/login', { email, password }, {}).subscribe((data: any) => {
        if (data.success === true) {
          this.storage.set('currentUser', JSON.stringify(email)).then(() => resolve()).catch((error)=> reject(error));
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

  logout() {
    return this.storage.clear().then(() => {
      this.router.navigateByUrl('/login');
    });
  }
}
