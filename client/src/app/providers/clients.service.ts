import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  private _clients = new BehaviorSubject<any>([]);

  constructor(
    private storage: Storage,
    private router: Router,
    private http: HttpClient
  ) { }

  get clients() {
    return this._clients.asObservable();
  }

  addNewClient(client) {
    return new Promise((resolve, reject) => {
      return this.http.post('http://localhost:3000/addClient', client, {}).subscribe((data: any) => {
        console.log('Response from list clients:', data);
        if (data.success === true) {
          this._clients.next(this._clients.getValue().concat(client));
          resolve();
        } else {
          reject();
        }
      });
    });
  }

  deleteClient(id) {
    return new Promise((resolve, reject) => {
      return this.http.post('http://localhost:3000/deleteClient', { id }, {}).subscribe((data: any) => {
        if(data.success === true) {
          let newClients = this._clients;
          this.clients.subscribe((cli) => {
            newClients = cli.filter((cli) => cli.CLIENTID !== id);
            console.log('New clients are: ', newClients);
          });
          this._clients.next(newClients);
          resolve();
        } else {
          reject();
        }
      });
    });
  }

  fetchClients() {
    return new Promise((resolve, reject) => {
      return this.http.get('http://localhost:3000/listClients', {}).subscribe((data: any) => {
        if (data.success === true) {
          console.log('Clients are:', data);
          this._clients.next(data.data);
          resolve();
        } else {
          reject();
        }
      });
    });
  }

  updateClient(client) {
    return new Promise((resolve, reject) => {
      return this.http.post('http://localhost:3000/updateClient', { client }, {}).subscribe((res: any) => {
        if (res.success === true) {
          resolve();
        } else {
          reject(res.error);
        }
      });
    });
  }
}
