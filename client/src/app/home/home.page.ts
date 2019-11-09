import { Component, OnInit } from '@angular/core';
import { AuthService } from '../providers/auth.service';
import { DoctorsService } from '../providers/doctors.service';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  loading = false;
  userName: string;
  doctors: any[];
  doctorsSub: Subscription;
  fecha = new Date;
  constructor(
    private auth: AuthService,
    private nav: NavController,
    private doctorsService: DoctorsService
  ) {}

  async ngOnInit() {
    this.loading = true;
    this.userName = await this.auth.checkUserAuth;
    console.log('Current user is: ', this.userName)
    if (this.userName === null) {
      this.nav.navigateRoot('/login');
    }
    this.doctorsService.fetchDoctors().then((doctors: any) => {
      this.doctorsSub = this.doctorsService.doctors.subscribe((docs) => {
        console.log('docs are:', docs);
        this.doctors = docs;
        this.loading = false;
      });
    });
  }

  logOut() {
    this.auth.logout();
  }
}
