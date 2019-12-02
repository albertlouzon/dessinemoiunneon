import { Component, Injector } from '@angular/core';
import  {createCustomElement, NgElement, WithProperties} from '@angular/elements';
import { NeonFormComponent } from './neon-form/neon-form.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(injector: Injector) {
      // const FormElement = createCustomElement(NeonFormComponent,  {injector});
      // customElements.define('suce-mes-boules', FormElement);

      // const formEl: NgElement & WithProperties<NeonFormComponent> = document.createElement('suce-mes-boules') as any;

      // // Listen to the close event
      // // formEl.addEventListener('closed', () => document.body.removeChild(popupEl));
  
      // // Set the message
  
      // // Add to the DOM
      // console.log('appending formEl ', formEl)
      // document.body.appendChild(formEl);
  }
  title = 'concourseRepro';
  currentView = 'form'
}
