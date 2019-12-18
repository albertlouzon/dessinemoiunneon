import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NeonFormComponent } from './neon-form/neon-form.component';
import { ArchwizardModule } from 'angular-archwizard';
import { FormHeaderComponent } from './form-header/form-header.component';
import { NeonListComponent } from './neon-list/neon-list.component';
import { HttpClientModule } from '@angular/common/http';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import {FormsModule} from '@angular/forms';
import {AutosizeModule} from 'ngx-autosize';
import {ExcelService} from './services/excel.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule, MatDialogModule, MatFormFieldModule} from '@angular/material';
import { ModalComponent } from './modal/modal.component';


@NgModule({
  declarations: [
    AppComponent,
    NeonFormComponent,
    FormHeaderComponent,
    NeonListComponent,
    AdminComponent,
    LoginComponent,
    ModalComponent,

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ArchwizardModule,
    FormsModule,
    AutosizeModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule
  ],
  entryComponents: [NeonFormComponent, ModalComponent],
  providers: [ArchwizardModule, ExcelService],
  bootstrap: [AppComponent]
})
export class AppModule { }
