import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private http: HttpClient) { }
  isSignIn = true;
  loginFailed = false;
  email = '';
  password= '';
  loading = false;
  ngOnInit() {
  }

  onSwitchLoginType(){
    this.isSignIn = !this.isSignIn;
  }
  login() {
    return this.http.post('https://neon-server.herokuapp.com/login', {email: this.email, password: this.password});
  }

  goToSignUp(){
    this.isSignIn = false;
  }

  onLogin() {
    console.log('email = ', this.email, ' ... pass = ', this.password);
    this.loading = true;
    this.login().subscribe((res) => {
      console.log('success ', res);
     const  userData = res['userData']
      this.loading = false;
      this.loginFailed = false;
      alert('Wesh ' + userData['name']);

    }, err => {
      console.log('failed login ', err);
      this.loading = false;
      this.loginFailed = true;
    })
    
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
