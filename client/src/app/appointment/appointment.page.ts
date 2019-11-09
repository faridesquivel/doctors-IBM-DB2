import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DoctorsService } from '../providers/doctors.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.page.html',
  styleUrls: ['./appointment.page.scss'],
})
export class AppointmentPage implements OnInit {
  doctorSub: Subscription;
  doctor: any;
  docId: string;
  
  constructor(
    private doctorsService: DoctorsService,
    private route: ActivatedRoute,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(
      (paramMap) => {
        if (!paramMap.has('docId')) {
          this.navCtrl.navigateBack('/home');
          return;
        }
        this.docId = paramMap.get('docId');
        this.doctorSub = this.doctorsService.doctors.subscribe((docs) => {
          console.log('docs are:', docs);
          console.log('DocId is:', this.docId);
          const filteredDocs = docs.filter(doc => doc.DOCTORID == this.docId);
          this.doctor = filteredDocs[0];
          console.log('this doc is: ', this.doctor);
        });
    }, // completeHandler
      () => { console.log('Error'); },
      () => { console.log('Next'); }
    );
  }

}
