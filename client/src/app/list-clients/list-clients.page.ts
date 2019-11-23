import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ClientsService } from '../providers/clients.service';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-list-clients',
  templateUrl: './list-clients.page.html',
  styleUrls: ['./list-clients.page.scss'],
})
export class ListClientsPage implements OnInit {
  clients: any;
  clientsSub: Subscription;
  loading = false;
  today = new Date();
  constructor(
    private clientsService: ClientsService,
    private loadingCtrl: LoadingController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.fetchClients();
  }

  async deleteClient(id) {
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      message: 'This registry will be deleted forever',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Delete',
          handler: () => {
            this.deleteFunction(id);
          }
        }
      ]
    });

    await alert.present();
    console.log('Will delete', id);
  }

  async deleteFunction(id) {
    
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Eliminando cliente' })
      .then(loadingEl => {
        loadingEl.present();
        this.clientsService.deleteClient(id).then(() => {
          loadingEl.dismiss();
          this.alertController.create({
            header: 'Client deleted',
            message: 'El cliente ha sido eliminado',
            buttons: ['OK']
          }).then((ca) => {
            ca.present();
          });
        }).catch(() => {
          loadingEl.dismiss();
          this.alertController.create({
            header: 'Failed',
            message: 'El cliente NO ha sido eliminado',
            buttons: ['OK']
          }).then((ca) => {
            ca.present();
          });
        });
      });
  }

  fetchClients() {    
    this.loading = true;
    this.clientsService.fetchClients().then(() => {
      this.clientsSub = this.clientsService.clients.subscribe((clients) => {    
        console.log('Will subscribe to clients: ', clients);    
        this.clients = clients;
        this.loading = false;
      });
    });
  }

}
