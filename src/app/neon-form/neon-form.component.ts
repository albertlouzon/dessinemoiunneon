import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-neon-form',
  templateUrl: './neon-form.component.html',
  styleUrls: ['./neon-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NeonFormComponent implements OnInit {
  userChoices = {};
  styleSelected = 1;
  textInput = '';
  imageFile = '';
  imageAdditionalInfo = '';
  constructor() { }

  ngOnInit() {
  }
  onChangeTextTitle(value: string) {
    if(value.trim() !== '') {
      this.textInput = value;
    }
  }
  onSelectFile(event) {
    console.log('file selected' , event);
    if(event.target.files) {
      console.log('file selected' , event.target.files);
      this.imageFile =  event.target.files[0];
    }
  }
  onChangeAdditionnalInfo(value: string) {
    if(value.trim() !== '') {
      this.imageAdditionalInfo = value;
    }
  }
  onSubmitForm(){
    const payload: Array<{choice: string, data : {}}> = []
    if(this.userChoices[0] === 'text') {
      payload.push({choice: 'text', data: {value: this.textInput, style: this.styleSelected}})

    } else {
      payload.push({choice: 'image', data: {file: this.imageFile, info: this.imageAdditionalInfo}})

    }
    console.log('payload : ', payload)
  }

  onCompleteStep(step: number, choice: string, data: any) {
    console.log('step ', step, ' completed. The user chose ', choice, '... data to save: ', data);
    if(choice) {
      this.userChoices[step] = choice;
    }
  }

}
