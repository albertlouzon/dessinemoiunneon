
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { currentView } from './../app.component';
import { saveAs } from 'file-saver';

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
  user = {};
  handler: any;
  commandInfos: { nom: string, prénom: string, société: string, adresse: string, ville: string, ['code-postal']: string, pays: string, téléphone: string }
    = { nom: '', prénom: '', société: '', adresse: '', ville: '', ['code-postal']: '', pays: '', téléphone: '' };;
  errorMessage = 'Des champs sont incomplets...'
  commandFailed = false;
  loading = false;
  payInfos = {};
  payMode = false;
  ngOnInit() {

    // this.axiosClient.get('http://localhost:5555').then(((res) => {alert(res)}))
    this.fetchCommands();
  }

  fetchCommands() {
    this.neonList = []
    this.loading = true;
    this.getConfig().subscribe((res: Array<Object>) => {
      if (res) {
        this.loading = false;
        console.log('ok ', res, localStorage.getItem('email'))
        if (!res.find(x => x['email'] === localStorage.getItem('email')) || !localStorage.getItem('email')) {
          alert('you are not logged in. T as rien a faire la va t inscrire');
          currentView['caca'] = 'login'
        } else {
          console.log(localStorage.getItem('email'))
          var commands = res.find(x => x['email'] === localStorage.getItem('email'))['commands']
          this.user = res.find(x => x['email'] === localStorage.getItem('email'));
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

  dlFile(url) {
    // window.location.href=url;
    this.http.get(url,
      { responseType: 'blob' }).subscribe(data => saveAs(data, `pdf report.pdf`));
  }

  goToNeonDetail(neonPayload) {
    console.log('the neon to see: ', neonPayload);
    if (neonPayload && neonPayload.state !== 'created') {
      this.neonSelected = neonPayload
    } else {
      alert('le DT est en cours de préparation')
    }

  }
  onChangeCommandInfo(field, value: string) {
    this.commandInfos[field] = value;
  }


  previous() {
    this.commandMode = false;
  }
  openCommand() {
    if (this.neonSelected.state === "commandé") {
      this.commandFailed = false;
      this.payInfos = { nom: '', prénom: '', société: '', adresse: '', ville: '', ['code-postal']: '', pays: '', téléphone: '' };
      this.commandMode = false;
      // this.payMode = true;
      // setTimeout(() => {
      //   this.loading = false;

      // }, 3000);
      this.loadStripe();
      this.handler = (<any>window).StripeCheckout.configure({
        key: 'pk_test_aeUUjYYcx4XNfKVW60pmHTtI',
        locale: 'auto',
        token:  (token: any) => {
          // You can access the token ID with `token.id`.
          // Get the token ID to your server-side code for use.
          console.log(token)
          alert('Token Created!!');
          this.loading = false;
          this.payMode = true;
          this.removeStripe();
        }
      });
   
      this.handler.open({
        name: 'Stripe payment for:  ' + this.neonSelected.text,
        // description: '2 widgets',
        amount: this.neonSelected.price * 100
      });
    } else {
      this.commandFailed = false;
      this.commandInfos = { nom: '', prénom: '', société: '', adresse: '', ville: '', ['code-postal']: '', pays: '', téléphone: '' };
      this.commandMode = !this.commandMode;

    }

  }

  command() {
    for (const field in this.commandInfos) {
      if (this.commandInfos[field].trim() === '') {
        this.commandFailed = true;
        this.errorMessage = 'Oops ! Le champ ' + field.toUpperCase() + ' est manquant...';
        return;
      }
    }
    console.log('the command is valid :', this.commandInfos);
    this.commandFailed = false;
    this.loading = true;
    this.user['commands'].find(c => c.id === this.neonSelected.id)['commandInfo'] = this.commandInfos;
    this.user['commands'].find(c => c.id === this.neonSelected.id)['state'] = 'commandé';
    this.http.put('https://neon-server.herokuapp.com/users/' + this.user['id'], this.user).subscribe((res) => {
      alert('Néon commandé. Email sent')
      this.fetchCommands();

    }, err => {
      if (err.status === 200) {
        alert('Néon commandé. Email sent')
        this.fetchCommands();
      }
    });

  }
  removeStripe() {
    // !window.document.getElementById('stripe-script')
    document.getElementById("stripe-script").outerHTML = "";

  }
  loadStripe() {

    if(!window.document.getElementById('stripe-script')) {
      var s = window.document.createElement("script");
      s.id = "stripe-script";
      s.type = "text/javascript";
      s.src = "https://checkout.stripe.com/checkout.js";
      
      // s.onload = () => { this.loading = false;
      //   this.handler = (<any>window).StripeCheckout.configure({
      //     key: 'pk_test_aeUUjYYcx4XNfKVW60pmHTtI',
      //     locale: 'auto',
      //     token: function (token: any) {
      //       // You can access the token ID with `token.id`.
      //       // Get the token ID to your server-side code for use.
      //       console.log(token)
      //       alert('Payment Success!!');
      //     }
      //   });
      // }
       
      window.document.body.appendChild(s);
    }
  }
} 
