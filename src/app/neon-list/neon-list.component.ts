
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
  ngOnInit() {

    // this.axiosClient.get('http://localhost:5555').then(((res) => {alert(res)}))
    this.neonList = []
    this.getConfig().subscribe((res: Array<Object>) => {
      if(res) {
        res.forEach((command) => {
          this.neonList.push(command)
        })
      }
      console.log('User data after fetch : ', this.neonList);
    })
  }

  getConfig() {
    return this.http.get('http://localhost:5555');
  }

  goToNeonDetail(neonPayload) {
    console.log('the neon to see: ', neonPayload);
    if(neonPayload) {
      this.neonSelected = neonPayload
    }

  }

  openCommand(){
    this.commandMode = !this.commandMode;
  }

}
