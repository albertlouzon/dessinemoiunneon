import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { currentView } from './../app.component';
import { MatSnackBar } from '@angular/material';
import { GoogleAnalyticsService } from '../google-analytics-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private http: HttpClient, private _snackBar: MatSnackBar, private googleAnalyticsService: GoogleAnalyticsService) { }
  isSignIn = false;
  loginFailed = false;
  email = '';
  password= '';
  projectType = 'consumer';
  name :'';
  nickname : '';
  snackbarClass = '';
  snackMsg = 'Oops'
  society: '';
  resetPass = false;
  resetEmail = '';
  loading = false;
  signUpError = 'Vous devez fournir un email et un mot de passe...';
  ngOnInit() {
    if(localStorage.getItem('email')) {
      console.log('ok')   
      this.email = localStorage.getItem('email');
      this.password = localStorage.getItem('pw');

      this.login().subscribe((res) => { currentView.caca = 'client'}, err => console.log('err', err))
    }
  }

  onSwitchLoginType(){
    this.isSignIn = !this.isSignIn;
    this.loginFailed = false;
    this.password = '';
    this.email = ''
    this.name = '';
    this.nickname = '';
    this.society = '';
  }
  login() {
    return this.http.post('https://neon-server.herokuapp.com/login', {email: this.email, password: this.password});
  }

   pressEnter(event) {
    //See notes about 'which' and 'key'
    if (event.charCode === 13 || event.key === 'Enter') {
      if(this.isSignIn) {
          this.onLogin()
      } else if(!this.isSignIn) {
        this.onSignUp();
      }
        return false;
    }
}

  getUser() {
    return this.http.get('https://neon-server.herokuapp.com/users');

  }

  onCheckPassword(type, value) {
    if(type === 'oldPassword') {
          
    } else if(type === 'newPassword') {

    }4
  }

  signUp() {
    let headers = new HttpHeaders({ "content-type": "application/json", "Accept": "application/json" });

    const payload =   {
      email: this.email,
      password: this.password,
      name: this.name,
      nickname: this.nickname,    
      type: this.projectType, 
     }
     console.log('payload', payload)
    return this.http.post('https://neon-server.herokuapp.com/users', payload, {headers: headers});
  }

  saveToStorage(){
    localStorage.setItem('email', this.email);
    localStorage.setItem('pw', this.password);
  }


  onSignUp(){
  
    if(this.email.trim() !== '' && this.password.trim() !== '') {
      this.googleAnalyticsService.eventEmitter("login", "signUp", this.resetEmail, 1);
      this.loginFailed = false;
      this.loading = true;
      this.getUser().subscribe((allUsers: Array<any>) => {
        console.log('all the users , ', allUsers)
        if(allUsers) {
          if(allUsers.find(x => x['email'] === this.email)) {
            this.loginFailed = true;
            this.signUpError = 'Il existe déjà un compte avec cet email...'
            this.loading = false;
          } else {
            this.loginFailed = false;
            this.signUpError = 'Vous devez fournir un email et un mot de passe...'
            this.signUp().subscribe(() => {
              this.openSnackbar('Votre espace personnel à été crée !!!')
              // alert('User sucessfully created !!! On va te faire visiter ton espace ma gueule');
              setTimeout(() => {
                this.saveToStorage();
                this.loading = false;
                currentView.caca = 'client'
              }, 2000);
            }, err => {
              if(err.status === 201)  {
                              this.openSnackbar('Votre utilisateur à été crée !!!')
                // alert('User sucessfully created !!! On va te faire visiter ton espace ma gueule');
                setTimeout(() => {
                  this.saveToStorage();
                this.loading = false;
                currentView.caca = 'client'
                }, 2000);
              } else if(err.status === 403) {
                this.openSnackbar('Veuillez entrer un email valide')
                this.loading = false;
              } else if(err.status === 404) {
                this.openSnackbar('Cet email semble introuvable')
                this.loading = false;
              }
              
              else {
                this.openSnackbar('Le mot de passe est incorrect')
                this.loading = false;
              }
            })
          }
        }
      })

    } else {
      this.loginFailed = true;
    }
  }
  onLogin() {
    if(!this.loading) {
      console.log('email = ', this.email);
      this.loading = true;
      this.login().subscribe((res) => {
        console.log('success ', res);
       const  userData = res['userData']
        this.loading = false;
        this.loginFailed = false;
        this.saveToStorage();
        const name = userData.find(x => x.email === this.email)['name']
        // this.openSnackbar('Rebonjour ' + name + ' !!!');
        if((this.email === 'thomas@dessinemoiunneon.fr') || this.email === 'gavin@dessinemoiunneon.fr') {
          currentView.caca = 'admin';
        }  else {
          currentView.caca = 'client';
        }

        
      }, err => {
        console.log('failed login ', err);
        this.loading = false;
        this.loginFailed = true;
      })
    }
    
  }
  openSnackbar(msg) {
    this._snackBar.open(msg, 'Ok', {
      duration: 2000,
    });
  }

  onChangeResetEmail(val) {
    this.resetEmail = val;
  }

  fromResetToSignin() {
    this.resetPass = false;
    this.isSignIn = true;
    this.resetEmail = '';
  }
  
  sendResetEmail() {
    if(this.resetEmail.trim() !== '') {
      this.loading = true;
      this.getUser().subscribe((allUsers: Array<any>) => {
        this.loading = false;
        this.googleAnalyticsService.eventEmitter("reset password", "", this.resetEmail, 1);

        if(allUsers.find(x => x.email === this.resetEmail)) {
          this.http.get('https://neon-server.herokuapp.com/resetPassword/' + allUsers.find(x => x.email === this.resetEmail)['id']).subscribe((res) => {
            console.log('res from reset password. Check box mail');

          })
        } else {
          this.openSnackbar('Cet email ne semble pas être dans notre base de donnée...');
          this.loading = false;
        }
      }, err => {          this.openSnackbar('Erreur du serveur... veuillez réessayer dans quelques instants') ;        this.loading = false;
    })
    } else {
      this.openSnackbar('Veuillez entrer un email')
    }
  }

  onChangeUserInfoSignUp(target, value) {
    this.loginFailed = false;
    if(value.trim() !== '') {
      if(target === 'email') {
        this.email = value;
      } 
      if(target === 'password') {
        this.password = value;
      }
      if(target === 'name') {
        this.name = value;
      }
      if(target === 'nickname') {
        this.nickname = value;
      }
      if(target === 'society') {
        this.society = value;
      }
    }
  }

  onChangeUserInfo(target, value) {
    this.loginFailed = false;
    if(value.trim() !== '') {
      if(target === 'email') {
        this.email = value;
      } 
      if(target === 'password') {
        this.password = value;
      }
    }
  }
}
