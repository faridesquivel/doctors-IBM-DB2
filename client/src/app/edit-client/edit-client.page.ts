import { Component, OnInit } from '@angular/core';
import { ClientsService } from '../providers/clients.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.page.html',
  styleUrls: ['./edit-client.page.scss'],
})
export class EditClientPage implements OnInit {
  client: any;
  clientId: string;
  clientSub: Subscription;
  
  constructor(
    private clients: ClientsService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('clientId')) {
        this.navCtrl.navigateBack('/home');
        return;
      }
      this.clientId = paramMap.get('clientId');
      this.clientSub = this.clients.clients.subscribe((clients) => {
        const temp = clients.filter((cli) => cli.CLIENTID + '' === this.clientId);
        this.client = temp[0];
        console.log('Cliente a editar:', this.client);
      });
    });
  }
  editClient(form: NgForm) {
    const { nombre, age, email, phone, weight } = form.value;
    const client = {
      clientId: this.clientId,
      nombre,
      age,
      email,
      phone,
      weight
    };
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Iniciando sesión' })
      .then(loadingEl => {
        loadingEl.present();
        this.clients.updateClient(client).then(() => {
          loadingEl.dismiss();
          this.alertCtrl.create({
            header: 'Success',
            message: 'Client updated successfully',
            buttons: ['OK']
          }).then((ca) => {
            ca.present();
            this.navCtrl.navigateForward('/list-clients');
          });
        }).catch(() => {
          loadingEl.dismiss();
          this.alertCtrl.create({
            header: 'Failure',
            message: 'Error updating client',
            buttons: ['OK']
          }).then((ca) => {
            ca.present();
          });
        });
      })   
  }

}
