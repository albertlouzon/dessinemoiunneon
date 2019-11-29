import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NeonFormComponent } from './neon-form/neon-form.component';
import { ArchwizardModule } from 'angular-archwizard';
import { FormHeaderComponent } from './form-header/form-header.component';


@NgModule({
  declarations: [
    AppComponent,
    NeonFormComponent,
    FormHeaderComponent
  ],
  imports: [
    BrowserModule,
    ArchwizardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})  
export class AppModule { }
