
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { currentView } from './../app.component';

@Component({
  selector: 'app-neon-list',
  templateUrl: './neon-list.component.html',
  styleUrls: ['./neon-list.component.scss']
})
export class NeonListComponent implements OnInit {

  constructor(private http: HttpClient) { }
  neonSelected = null;
  neonList = [];
  commandMode = false;
  loading = false;
  ngOnInit() {

    // this.axiosClient.get('http://localhost:5555').then(((res) => {alert(res)}))
    this.neonList = []
    this.loading = true;
    this.getConfig().subscribe((res: Array<Object>) => {
      if(res) {
        this.loading = false;
        console.log('ok ', res, localStorage.getItem('email'))
        if(!res.find(x => x['email'] === localStorage.getItem('email')) || !localStorage.getItem('email')) {
          alert('you are not logged in. T as rien a faire la va t inscrire');
          currentView['caca'] = 'login'
        } else {
          console.log(localStorage.getItem('email'))
          var commands = res.find(x => x['email'] === localStorage.getItem('email'))['commands']
          console.log(commands)
  
          commands.forEach((command) => {
            this.neonList.push(command)
          })
        }
   
      } 
      console.log('User data after fetch : ', this.neonList);
    })
  }

  goToForm() {
    currentView.caca = 'form'
  }

  getConfig() {
    return this.http.get('https://neon-server.herokuapp.com/users');
  }

  goToNeonDetail(neonPayload) {
    console.log('the neon to see: ', neonPayload);
    if(neonPayload && neonPayload.state !== 'created') {
      this.neonSelected = neonPayload 
    } else {
      alert('le DT est en cours de préparation')
    }

  }

  openCommand(){
    this.commandMode = !this.commandMode;
  }

}
