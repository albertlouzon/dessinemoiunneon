import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { currentView } from './../app.component';

@Component({
  selector: 'app-neon-form',
  templateUrl: './neon-form.component.html',
  styleUrls: ['./neon-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NeonFormComponent implements OnInit {
  formatSizes: Array<{size:string, width: number}> = [{size: 'S', width: 25},{size: 'M', width: 35}, {size: 'L', width: 45}, {size: 'XL', width: 50} ];
  selectedFormatSize = 0;
  imageSupportSelected = 'standard';
  projectType = 'consumer'
  userChoices = {};
  userInfoPerso  =  {};
  trim = String.prototype.trim;
  signUp = false;
  styleSelected = 1;
  signUpError = 'Il existe déjà un compte avec cet email...';
  loginFailed = false;
  textInput = '';
  imageFile = '';
  loading = false;
  mainChoice = '';
  imageAdditionalInfo = '';
  allUsers = [];
  closeResult: string;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get('https://neon-server.herokuapp.com/users').subscribe((users: Array<any>) => {
      this.allUsers = users;
    })
  }

  signuptrue() {
    this.signUp = true;
  }

  onChangeTextTitle(value: string) {
      this.textInput = value;
  }
  onSelectFile(event) {
    console.log('file selected' , event);
    if(event.target.files) {
      console.log('file selected' , event.target.files);
      this.textInput = event.target.files[0]['name'];
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

    const mapTypo = ['Typo marmelade', 'Arabica Bold', 'Jewish Juice']
    const payload2 = {
      text: this.textInput,
      typo: mapTypo[this.styleSelected],
      colors: 'Not implemented', 
      height: this.formatSizes[this.selectedFormatSize].width,
      price: Math.floor(Math.random() * 2000) + 1 ,
      state: 'created', 
      type: this.projectType
    }
    if(localStorage.getItem('email') === null) {
      if((this.userInfoPerso['email'] || this.userInfoPerso['password']) && (this.userInfoPerso['email'].trim() !== '' || this.userInfoPerso['password'].trim() !== '') ) {
        this.loginFailed = false;
        this.loading = true;
        this.getUser().subscribe((allUsers: Array<any>) => {
          console.log('all the users , ', allUsers)
          if(allUsers) {
            if(allUsers.find(x => x['email'] === this.userInfoPerso['email'])) {
              this.loginFailed = true;
              this.signUpError = 'Il existe déjà un compte avec cet email...'
            } else {
              this.loginFailed = false;
              this.signUpError = 'Vous devez fournir un email et un mot de passe...'
              this.signUpObs().subscribe(() => {
                alert('User sucessfully created !!! On va te faire visiter ton espace ma gueule');
                this.loading = false;
                this.saveToStorage();
                this.http.get('https://neon-server.herokuapp.com/users').subscribe((users: Array<any>) => {
                  this.allUsers = users;
                  const userId = this.allUsers.find(x => x.email === this.userInfoPerso['email']).id;
                  this.http.post(  `https://neon-server.herokuapp.com/users/${userId}/command`, payload2).subscribe((newNeonList: any) => {
                    console.log('updated list after post :', newNeonList);
                    currentView.caca = 'client';
                    this.saveToStorage();
                  }, err => {
                    if(err.status === 201 || err.status === 200 ) {
                      currentView.caca = 'client';
                      this.saveToStorage();
                    }
                  })
                })
           
  
  
              }, err => {
                if(err.status === 201 || err.status === 200 )  {
                  alert('User sucessfully created !!! On va te faire visiter ton espace ma gueule');
                  this.loading = false;
                  this.http.get('https://neon-server.herokuapp.com/users').subscribe((users: Array<any>) => {
                    this.allUsers = users;
                    const userId = this.allUsers.find(x => x.email === this.userInfoPerso['email']).id;
                    this.http.post(  `https://neon-server.herokuapp.com/users/${userId}/command`, payload2).subscribe((newNeonList: any) => {
                      console.log('updated list after post :', newNeonList);
                      currentView.caca = 'client';
                      this.saveToStorage();
                      console.log('success', currentView.caca)

                    }, err => {
                      if(err.status === 201 || err.status === 200 ) {
                        currentView.caca = 'client';
                        this.saveToStorage();
                        console.log('success', currentView.caca)
                      }
                    })
                  })
                } else {
                  alert('Signup failed'); console.log('signup failed', err);
                  this.loading = false;
                }
              })
            }
          }
        })
      } else {
        alert('Vous devez fournir un email et un mot de passe');
      }
    } else {
    const userId = this.allUsers.find(x => x.email === localStorage.getItem('email')).id;
    this.http.post(  `https://neon-server.herokuapp.com/users/${userId}/command`, payload2).subscribe((newNeonList: any) => {
      console.log('updated list after post :', newNeonList);
      this.saveToStorage();
      currentView.caca = 'client';
    }, err => {
      if(err.status === 201 || err.status === 200 ) {
        currentView.caca = 'client';
        this.saveToStorage();
        console.log('success', currentView.caca)
      }
    })
    }
 
    
  }

  onCompleteStep(step: number, choice: string, data: any) {
    if(choice && step === 0) {  
      if(choice !== this.mainChoice) {
        this.textInput = '';
      }
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

  signUpObs() {
    let headers = new HttpHeaders({ "content-type": "application/json", "Accept": "application/json" });

    const payload =   {
      email: this.userInfoPerso['email'],
      password: this.userInfoPerso['password'],
      name: this.userInfoPerso['name'],
      nickname: this.userInfoPerso['nickname'],
      type: this.projectType
     }
     console.log('payload', payload)
    return this.http.post('https://neon-server.herokuapp.com/users', payload, {headers: headers});
  }

  getUser() {
    return this.http.get('https://neon-server.herokuapp.com/users');

  }

  onSignUp(){
      this.loginFailed = false;
      this.loading = true;
      this.getUser().subscribe((allUsers: Array<any>) => {
        console.log('all the users , ', allUsers)
        if(allUsers) {
          if(allUsers.find(x => x['email'] === this.userInfoPerso['email'])) {
            this.loginFailed = true;
            this.signUpError = 'Il existe déjà un compte avec cet email...'
          } else {
            this.loginFailed = false;
            this.signUpError = 'Vous devez fournir un email et un mot de passe...'
            this.signUpObs().subscribe(() => {
              alert('User sucessfully created !!! On va te faire visiter ton espace ma gueule');
              this.saveToStorage();
              this.loading = false;
              currentView.caca = 'client'



            }, err => {
              if(err.status === 201 || err.status === 200)  {
                alert('User sucessfully created !!! On va te faire visiter ton espace ma gueule');
                this.loading = false;
              this.saveToStorage();
              currentView.caca = 'client'
              } else {
                alert('Signup failed'); console.log('signup failed', err);
                this.loading = false;
              }
            })
          }
        }
      })
  }

  saveToStorage(){
    localStorage.setItem('email', this.userInfoPerso['email']);
    localStorage.setItem('pw',this.userInfoPerso['password']);
  }




}
