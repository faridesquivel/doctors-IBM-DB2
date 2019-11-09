import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoadingController, NavController, AlertController } from '@ionic/angular';
import { AuthService } from '../providers/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  isLoading = false;

  constructor(
    private loadingCtrl: LoadingController,
    private nav: NavController,
    private alertCtrl: AlertController,
    private authService: AuthService
  ) { }

  ngOnInit() {

  }

  onSubmit(form: NgForm) {
    console.log(form);
    const email = form.value.email;
    const password = form.value.password;
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Iniciando sesión' })
      .then(loadingEl => {
        loadingEl.present();
        this.authService.login(email, password).then((user) => {
          loadingEl.dismiss();
          this.nav.navigateForward('/home');
          form.reset();
        }).catch(err => {
          loadingEl.dismiss();
          this.alertCtrl.create({
            header: 'Login Failed',
            message: 'Por favor, verifica tu usuario y contraseña e intenta nuevamente',
            buttons: ['OK']
          }).then((ca) => {
            ca.present();
          });
        });
      });
  }
}
