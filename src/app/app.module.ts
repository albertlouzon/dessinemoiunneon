import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NeonFormComponent } from './neon-form/neon-form.component';
import { ArchwizardModule } from 'angular-archwizard';
import { FormHeaderComponent } from './form-header/form-header.component';
import { NeonListComponent } from './neon-list/neon-list.component';
import { HttpClientModule } from '@angular/common/http';
import { AdminComponent } from './admin/admin.component';


@NgModule({
  declarations: [
    AppComponent,
    NeonFormComponent,
    FormHeaderComponent,
    NeonListComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ArchwizardModule,
  ],
  entryComponents: [NeonFormComponent],
  providers: [ArchwizardModule],
  bootstrap: [AppComponent]
})  
export class AppModule { }
