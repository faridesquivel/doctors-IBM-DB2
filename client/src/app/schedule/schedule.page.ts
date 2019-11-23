import { Component, OnInit } from '@angular/core';
import { DateService } from '../providers/date.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {

  constructor(
    private dateService: DateService
  ) { }

  ngOnInit() {
    this.dateService.fetchDates().then((data) => {
      
    });
  }

}
