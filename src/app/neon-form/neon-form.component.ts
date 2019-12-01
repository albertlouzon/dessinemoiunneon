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
  imageSupportSelected = 'standard';
  projectType = 'consumer'
  userChoices = {};
  userInfoPerso  =  {}
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
      payload.push({title: this.mainChoice, data: {value: this.textInput, style: this.styleSelected}});
      payload.push({title: 'format', data: {size: this.formatSizes[this.selectedFormatSize], imageSupport: this.imageSupportSelected}})

 
    } else {
      payload.push({title: this.mainChoice, data: {file: this.imageFile, info: this.imageAdditionalInfo}})
      payload.push({title: 'format', data: {size:this.formatSizes[this.selectedFormatSize], imageSupport: this.imageSupportSelected}})

    }

    const data = {}
    for(let field in this.userInfoPerso) {
      data[field] = this.userInfoPerso[field]
    }
    payload.push({title: this.projectType, data: {data}});
    console.log('payload : ', payload)
  }

  onCompleteStep(step: number, choice: string, data: any) {
    if(choice && step === 0) {  
      this.mainChoice = choice
      this.userChoices[step] = choice;
    }
    if(choice && step === 5) {  
      if(choice !== this.projectType) {
          this.userInfoPerso = {};
      }
      this.projectType = choice;

    }
    console.log('step ', step, ' completed. The user chose ', choice, '... data to save: ',  this.projectType);

  }

  onChangeUserInfo(target: string, value: string) {
    if(value.trim() !== '') {
      this.userInfoPerso[target] = value;
    }
  }

}
