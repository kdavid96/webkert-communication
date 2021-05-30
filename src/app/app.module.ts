import { CalendarModule, DateAdapter } from 'angular-calendar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { AppointmentComponent } from './components/appointment/appointment.component';
import { AuthService } from './models/services/auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ContactComponent } from './components/contact/contact.component';
import { DialogAddComponent } from './components/dialog-add/dialog-add.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HistoryComponent } from './components/history/history.component';
import { HomeComponent } from './components/home/home.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MessagesComponent } from './components/messages/messages.component';
import { Messaging } from './models/classes/messaging';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NgModule } from '@angular/core';
import { ProfileComponent } from './components/profile/profile.component';
import { RouterModule } from '@angular/router';
import { SidenavListComponent } from './components/sidenav-list/sidenav-list.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ToastrModule } from 'ngx-toastr';
import { UserService } from './models/services/user.service';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { environment } from './../environments/environment';
import { SendMessageComponent } from './components/send-message/send-message.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignInComponent,
    SignUpComponent,
    NavbarComponent,
    ProfileComponent,
    AppointmentComponent,
    HistoryComponent,
    ContactComponent,
    CalendarComponent,
    DialogAddComponent,
    MessagesComponent,
    SidenavListComponent,
    SendMessageComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    MatCheckboxModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatListModule,
    RouterModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ToastrModule.forRoot(),
    MatDialogModule,
    MatSidenavModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    LayoutModule,
    FlexLayoutModule
  ],
  providers: [AuthService, UserService, SignInComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
