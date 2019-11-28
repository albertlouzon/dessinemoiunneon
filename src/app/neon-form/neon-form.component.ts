import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-neon-form',
  templateUrl: './neon-form.component.html',
  styleUrls: ['./neon-form.component.scss']
})
export class NeonFormComponent implements OnInit {
  userChoices = {};
  constructor() { }

  ngOnInit() {
  }

  onCompleteStep(step: number, choice: string, data: any) {
    console.log('step ', step, ' completed. The user chose ', choice, '... data to save: ', data);
    if(choice) {
      this.userChoices[step] = choice;
    }
  }

}
