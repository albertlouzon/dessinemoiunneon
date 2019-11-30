import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-neon-form',
  templateUrl: './neon-form.component.html',
  styleUrls: ['./neon-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NeonFormComponent implements OnInit {
  formatSizes: Array<{size:string, width: number}> = [{size: 'S', width: 25},{size: 'L', width: 35}, {size: 'L', width: 45}, {size: 'XL', width: 50} ];
  selectedFormatSize = 0;
  imageSupportSelected = 1;
  projectType = 'consumer'
  userChoices = {};
  styleSelected = 1;
  textInput = '';
  imageFile = '';
  mainChoice = '';
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
    const payload: Array<{title: string, data : {}}> = []
    if(this.mainChoice === 'text') {
      payload.push({title: 'textAndStyle', data: {value: this.textInput, style: this.styleSelected}});
      payload.push({title: 'format', data: {size: this.selectedFormatSize, imageSupport: this.imageSupportSelected}})

 
    } else {
      payload.push({title: 'imageFile', data: {file: this.imageFile, info: this.imageAdditionalInfo}})

    }
    console.log('payload : ', payload)
  }

  onCompleteStep(step: number, choice: string, data: any) {
    console.log('step ', step, ' completed. The user chose ', choice, '... data to save: ', data);
    if(choice && step === 0) {  
      this.mainChoice = choice
      this.userChoices[step] = choice;
    }
  }

}
