import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ClientsService } from '../providers/clients.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.page.html',
  styleUrls: ['./add-client.page.scss'],
})
export class AddClientPage implements OnInit {

  constructor(
    private clientsService: ClientsService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onAddClient(form: NgForm) {
    if (!form.valid) {
      return;
    }
    console.log(form);
    const client = {
      name: form.value.nombre,
      age: form.value.age,
      email: form.value.email,
      weight: form.value.weight,
      phone: form.value.phone
    };
    console.log('Will add next client', client);
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Añadiendo cliente' })
      .then(loadingEl => {
        loadingEl.present();
        this.clientsService.addNewClient(client).then(() => {
          loadingEl.dismiss();
          this.alertCtrl.create({
            header: 'Cliente añadido',
            message: 'Se ha añadido el nuevo cliente satisfactoriamente',
            buttons: ['OK']
          }).then((ca) => {
              ca.present();
              this.router.navigateByUrl('/list-clients');
          });
        }).catch((error) => {
          loadingEl.dismiss();
          this.alertCtrl.create({
            header: 'Error',
            message: 'No se pudo añadir al cliente, intente nuevamente',
            buttons: ['OK']
          }).then((ca) => {
              ca.present();
          });
    
        });
      });    
  }

}
