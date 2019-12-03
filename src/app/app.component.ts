import { Component, Injector } from '@angular/core';
import  {createCustomElement, NgElement, WithProperties} from '@angular/elements';
import { NeonFormComponent } from './neon-form/neon-form.component';
export let currentView =  {caca :'login', signUp: false}
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

  logout() {
    localStorage.removeItem('email');
    localStorage.removeItem('pw');
  }

  onClickView(target) {
    currentView.caca = target;
  }

  getView() {
    return currentView.caca;
  }
}