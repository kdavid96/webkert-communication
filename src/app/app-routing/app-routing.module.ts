import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { RouterModule, Routes } from '@angular/router';

import { AppointmentComponent } from '../components/appointment/appointment.component';
import { CalendarComponent } from '../components/calendar/calendar.component';
import { ContactComponent } from '../components/contact/contact.component';
import { HistoryComponent } from '../components/history/history.component';
import { MessagesComponent } from '../components/messages/messages.component';
import { NgModule } from '@angular/core';
import { ProfileComponent } from '../components/profile/profile.component';
import { SignInComponent } from '../components/sign-in/sign-in.component';
import { SignUpComponent } from '../components/sign-up/sign-up.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['signin']);

const routes: Routes = [
  { path: '', redirectTo: '/signin', pathMatch: 'full' },
  { path: 'signin', component: SignInComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'profile', component: ProfileComponent,  canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }},
  { path: 'appointment', component: AppointmentComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'messages', component: MessagesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }