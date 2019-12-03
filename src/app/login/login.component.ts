import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private http: HttpClient) { }
  isSignIn = true
  ngOnInit() {
    this.testApi().subscribe((res: Array<Object>) => {
      if(res) {
      console.log('res from server: ', res)
      }
    })  
  }

  onSwitchLoginType(){
    this.isSignIn = !this.isSignIn;
  }
  testApi() {
    return this.http.get('https://neon-server.herokuapp.com/users');
  }
}
