import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  neonSelected = 'none';
  neonList = [];
  cachedList = [];
  constructor(private http: HttpClient) { }
  loading = false;
  commandPrice = 0;
  currentFile;
  ngOnInit() {
       // this.axiosClient.get('http://localhost:5555').then(((res) => {alert(res)}))
this.fetchCommands();
  }
  goToDetail(command) {
    this.neonSelected = command;
    this.commandPrice = 0;
    console.log('command selected by admin : ', command)
  }

  filterCommand(type) {
    console.log(type)
    if(type === 'Created') {
      this.neonList = this.cachedList.filter(c => c.state === 'created')
    }
    if(type === 'DT disponible') {
      this.neonList = this.cachedList.filter(c => c.state === 'DT disponible')
    }
    if(type === 'Commandé') {
      this.neonList = this.cachedList.filter(c => c.state === 'commandé')
    }
    if(type === 'Payé') {
      this.neonList = this.cachedList.filter(c => c.state === 'payé')
    }
    if(type === 'all') {
      this.neonList = this.cachedList;
    }
  }


fromCreatedToDT(command){
  console.log('COMANNNANZAFJAEJOF ', this.currentFile, this.commandPrice)
  if(this.currentFile  !== '' && this.currentFile && this.commandPrice > 0) {
    const price = this.commandPrice.toString();
    let params = new HttpParams().set("userId",command['userId']).set("commandId", command['id']).set("price", price); //Create new HttpParams
    let formData: FormData = new FormData(); 
    formData.append('file', this.currentFile);
    this.loading = true;
    this.http.post('https://neon-server.herokuapp.com/fileUpload', formData, {params: params}).subscribe((user) => {
      this.loading = false;
      console.log('sucess:' , user);
      setTimeout(() => {
        this.fetchCommands();
      }, 500);
    //       this.http.get('https://neon-server.herokuapp.com/users/' + command['userId']).subscribe((user) => {
    //   console.log('user:' , user)
    //   let updatedUser = user[0];
    //   updatedUser['dtFile'] = formData;
    //   updatedUser['changeCommand'] = {text: command.text, newState: 'DT disponible'};
    //   if(updatedUser['commands'].find(x => x.id === command['id'])) {
    //     updatedUser['commands'].find(x => x.id === command['id']).state = 'DT disponible';
    //     this.http.put('https://neon-server.herokuapp.com/users/' + command['userId'], updatedUser).subscribe((res) => {
    //       alert('DT uploaded. Email sent')

    //     }, err => {
    //       if(err.status === 200) {

    //         this.fetchCommands();
    //       }
    //     });
    //   } else {
    //     console.log('cant find this command in user: ', updatedUser)
    //   }
    // })
 
    },err => console.log('err' , err))
  } else {
    alert('Pour importer le DT il faut importer le fichier et entrer le prix du néon')
  }
}
deleteCommand(command){
  const del = confirm("Confirmer vouloir effacer " + command.text);
  if(command['userFull']) {
    command['userFull']['commands'] =  command['userFull']['commands'].filter(c => c.id !== command.id);
    
    this.http.put('https://neon-server.herokuapp.com/users/' + command['userId'],  command['userFull']).subscribe((res) => {
      // this.fetchCommands();
      alert('Commande effacée');
      setTimeout(() => {
        this.fetchCommands();
      }, 500);

    }, err => {
      if (err.status === 200) {
        alert('Commande effacée');
        setTimeout(() => {
          this.fetchCommands();
        }, 500);
        // this.fetchCommands();
      }
    });
  } else {
    alert("cant delete")
  }
}

changePrice(price) {
  if( price > 0) {
    this.commandPrice = price;
  } else {
    alert('entre un prix valide petit coquin')
  }
}
  fetchCommands(){
    this.loading = true;
    this.neonList = []
    this.currentFile = null,
    this.commandPrice = 0;
    this.getConfig().subscribe((res: Array<Object>) => {
      this.loading = false;
      if(res) {
        res.forEach((user) => {
          if(user['commands'].length > 0) {
           user['commands'].forEach((command) => {
             this.neonList.push({email: user['email'], type: user['type'], text: command ['text'], state: command['state'], price: command['price'], userId: user['id'], id: command['id'],
             commandInfo: command['commandInfo'], filePath: command['filePath'], userFull: user , typo: command['typo'], colors: command['colors'], height: command['height']})

           })
          }
        })
      }
      console.log('User data after fetch : ', this.neonList);
      this.cachedList = this.neonList
    })
  }

  importDT(event, command) {
    console.log('import DT. file :', event, ' command: ', command)
    this.currentFile = event.target.files[0];
    
  }

  getConfig() {
    return this.http.get('https://neon-server.herokuapp.com/users'); 
  }


}
