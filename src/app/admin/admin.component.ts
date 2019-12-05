import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  neonSelected = null;
  neonList = [];
  constructor(private http: HttpClient) { }
  loading = false;
  ngOnInit() {
       // this.axiosClient.get('http://localhost:5555').then(((res) => {alert(res)}))
this.fetchCommands();
  }

  fetchCommands(){
    this.loading = true;
    this.neonList = []
    this.getConfig().subscribe((res: Array<Object>) => {
      this.loading = false;
      if(res) {
        res.forEach((user) => {
          if(user['commands'].length > 0) {
           user['commands'].forEach((command) => {
             this.neonList.push({email: user['email'], type: user['type'], text: command ['text'], state: command['state'], price: command['price'], userId: user['id'], id: command['id'] })

           })
          }
        })
      }
      console.log('User data after fetch : ', this.neonList);
    })
  }

  importDT(event, command) {
    console.log('import DT. file :', event, ' command: ', command)
    const file = event.target.files[0];
    let formData: FormData = new FormData(); 
    formData.append('file', file);
    this.http.get('https://neon-server.herokuapp.com/users/' + command['userId']).subscribe((user) => {
      console.log('user:' , user)
      let updatedUser = user[0];
      updatedUser['dtFile'] = formData;
      updatedUser['changeCommand'] = {text: command.text, newState: 'DT disponible'};
      if(updatedUser['commands'].find(x => x.id === command['id'])) {
        updatedUser['commands'].find(x => x.id === command['id']).state = 'DT disponible';
        this.http.put('https://neon-server.herokuapp.com/users/' + command['userId'], updatedUser).subscribe((res) => {

        }, err => {
          if(err.status === 200) {
            this.fetchCommands();
          }
        });
      } else {
        console.log('cant find this command in user: ', updatedUser)
      }
    })
  }

  getConfig() {
    return this.http.get('https://neon-server.herokuapp.com/users'); 
  }


}
