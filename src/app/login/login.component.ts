import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { currentView } from './../app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private http: HttpClient) { }
  isSignIn = false;
  loginFailed = false;
  email = '';
  password= '';
  projectType = 'consumer';
  name :'';
  nickname : '';
  society: '';
  loading = false;
  signUpError = 'Vous devez fournir un email et un mot de passe...';
  ngOnInit() {
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

  

  getUser() {
    return this.http.get('https://neon-server.herokuapp.com/users');

  }

  signUp() {
    let headers = new HttpHeaders({ "content-type": "application/json", "Accept": "application/json" });

    const payload =   {
      email: this.email,
      password: this.password,
      name: this.name,
      nickname: this.nickname,
      type: this.projectType
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
      this.loginFailed = false;
      this.loading = true;
      this.getUser().subscribe((allUsers: Array<any>) => {
        console.log('all the users , ', allUsers)
        if(allUsers) {
          if(allUsers.find(x => x['email'] === this.email)) {
            this.loginFailed = true;
            this.signUpError = 'Il existe déjà un compte avec cet email...'
          } else {
            this.loginFailed = false;
            this.signUpError = 'Vous devez fournir un email et un mot de passe...'
            this.signUp().subscribe(() => {
              alert('User sucessfully created !!! On va te faire visiter ton espace ma gueule');
              this.saveToStorage();
              this.loading = false;
              currentView.caca = 'client'
            }, err => {
              if(err.status === 201)  {
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

    } else {
      this.loginFailed = true;
    }
  }
  onLogin() {
    if(!this.loading) {
      console.log('email = ', this.email, ' ... pass = ', this.password);
      this.loading = true;
      this.login().subscribe((res) => {
        console.log('success ', res);
       const  userData = res['userData']
        this.loading = false;
        this.loginFailed = false;
        this.saveToStorage();
        const name = userData.find(x => x.email === this.email)['name']
        alert('Wesh ' + name);
        currentView.caca = 'client';
        
      }, err => {
        console.log('failed login ', err);
        this.loading = false;
        this.loginFailed = true;
      })
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
