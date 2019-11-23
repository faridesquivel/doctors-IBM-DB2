import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { 
    path: 'appointment', 
    children: [
      {
        path: ':docId',
        loadChildren: './appointment/appointment.module#AppointmentPageModule' 
      }
    ]
  },
  { path: 'add-client', loadChildren: './add-client/add-client.module#AddClientPageModule' },
  { path: 'schedule', loadChildren: './schedule/schedule.module#SchedulePageModule' },
  { path: 'list-clients', loadChildren: './list-clients/list-clients.module#ListClientsPageModule' },
  { path: 'add-date', loadChildren: './add-date/add-date.module#AddDatePageModule' },
  { path: 'edit-client/:clientId', loadChildren: './edit-client/edit-client.module#EditClientPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
