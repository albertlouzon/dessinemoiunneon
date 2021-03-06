import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
  Component,
  Input,
  ViewEncapsulation,
  OnDestroy,
  TemplateRef,
  ChangeDetectionStrategy,
  OnInit,
  ChangeDetectorRef,
  KeyValueDiffer,
  KeyValueDiffers,
  Inject,
  AfterContentChecked, Directive, ElementRef, ViewChild, AfterViewChecked
} from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { MatDialog } from '@angular/material';
import { ModalRecapComponent } from '../modal-recap/modal-recap.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WizardComponent } from 'angular-archwizard';
import { GoogleAnalyticsService } from '../google-analytics-service.service';

export enum Direction {
  Next,
  Prev
}

export enum Animation {
  Fade = 'fade',
  Slide = 'slide'
}

export interface ActiveSlides {
  previous: number;
  current: number;
  next: number;
}

@Component({
  selector: 'app-neon-form',
  templateUrl: './neon-form.component.html',
  styleUrls: ['./neon-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NeonFormComponent implements OnInit, AfterViewChecked {
  get direction() {
    return this._direction;
  }
  set direction(direction: Direction) {
    this._direction = direction;
  }
  get activeSlides() {
    return this._activeSlides;
  }
  set activeSlides(activeSlides: ActiveSlides) {
    this._activeSlides = activeSlides;
  }
  constructor(private http: HttpClient, private cd: ChangeDetectorRef, private _snackBar: MatSnackBar, private googleAnalyticsService: GoogleAnalyticsService,
    private differs: KeyValueDiffers, @Inject(DOCUMENT) private document: Document, public dialog: MatDialog) { }
  formatSizes: Array<{ size: string, width: number, url: string }> = [{
    size: 'S', width: 20, url: '../.././assets/Fichier-S.png'
  },
  { size: 'M', width: 25, url: '../.././assets/Fichier-M.png' },
  { size: 'L', width: 30, url: '../.././assets/Fichier-L.png' },
  { size: 'XL', width: 40, url: '../.././assets/Fichier-XL.png' }];
  formatCache = [
    '../.././assets/Fichier-S.png',
    '../.././assets/Fichier-M.png',
    '../.././assets/Fichier-L.png',
    '../.././assets/Fichier-XL.png'
  ];
  formatUrl = [
    '../.././assets/S_selec.png',
    '../.././assets/M_selec.png',
    '../.././assets/L_selec.png',
    '../.././assets/XL_selec.png'
  ];
  selectedFormatSize = null;
  imageSupportSelected = null;
  projectType = null;
  userFirstChoice;
  lesserSign = '<';
  userChoices = {};
  userInfoPerso = {};
  trim = String.prototype.trim;
  dynamicLoginTitle = '  créant votre espace !';
  finalStep = false;
  signUp = true;
  styleSelected = null;
  signUpError = 'Il existe déjà un compte avec cet email...';
  loginFailed = false;
  textInput = '';
  neonFontSizeClass = 'fs-medium';
  neonColorCode = '';
  neonTypoClass = 'Lilly';
  neonColorClass = 'blanc';
  selectedColor;
  selectedTypo = 'Lilly';
  imageFile = '';
  loading = false;
  mainChoice = '';
  hideWizard = false;
  imageAdditionalInfo = '';
  selectedColorUI = null;
  allUsers = [];
  closeResult: string;
  colorTitle = 'Choisissez une couleur';
  slides = [
    {
      url: '../.././assets/Lilly.png',
      font: 'Lilly'
    },
    {
      url: '../.././assets/Dannie.png',
      font: 'Dannie'
    },
    {
      url: '../.././assets/Billy.png',
      font: 'Billy'
    },
    {
      url: '../.././assets/Polly.png',
      font: 'Polly'
    },
    {
      url: '../.././assets/Jimmy.png',
      font: 'Jimmy'
    },
    {
      url: '../.././assets/Cobby.png',
      font: 'Cobby'
    },
    {
      url: '../.././assets/Tommy.png',
      font: 'Tommy'
    },
    {
      url: '../.././assets/Freddy.png',
      font: 'Freddy'
    },
  ];

  cacheColorUrl = [
    '../.././assets/blanc.png',
    '../.././assets/blanchaud.png',
    '../.././assets/orange.png',
    '../.././assets/jaune.png',
    '../.././assets/rouge.png',
    '../.././assets/rose.png',
    '../.././assets/fuschia.png',
    '../.././assets/violet.png',
    '../.././assets/bleu.png',
    '../.././assets/vert.png',
    '../.././assets/turquoise.png'
  ];

  selectedColorUrl = [
    '../.././assets/Blanc_froid_selec.png',
    '../.././assets/Blanc_chaud_selec.png',
    '../.././assets/Orange_selec.png',
    '../.././assets/Jaune_selec.png',
    '../.././assets/Rouge_selec.png',
    '../.././assets/Rose_selec.png',
    '../.././assets/Fuschia_selec.png',
    '../.././assets/Violet_selec.png',
    '../.././assets/Bleu_selec.png',
    '../.././assets/Vert_selec.png',
    '../.././assets/Turquoise_selec.png'
  ];

  colorList = [
    { name: 'Blanc', color: '#ffffff', url: '../.././assets/blanc.png' },
    { name: 'Blanc chaud', color: '#ede3c5', url: '../.././assets/blanchaud.png' },
    { name: 'Orange', color: '#ffa42c', url: '../.././assets/orange.png' },
    { name: 'Jaune', color: '#ffe600', url: '../.././assets/jaune.png' },
    { name: 'Rouge', color: '#ff0000', url: '../.././assets/rouge.png' },
    { name: 'Rose', color: '#ff73ff', url: '../.././assets/rose.png' },
    { name: 'Fuschia', color: '#df29ff', url: '../.././assets/fuschia.png' },
    { name: 'Violet', color: '#9527ff', url: '../.././assets/violet.png' },
    { name: 'Bleu', color: '#337dff', url: '../.././assets/bleu.png' },
    { name: 'Vert', color: '#15e81f', url: '../.././assets/vert.png' },
    { name: 'Turquoise', color: '#17fff9', url: '../.././assets/turquoise.png' },
  ];
  @Input()
  isNavigationVisible = true;
  @Input()
  isThumbnailsVisible = true;
  @Input()
  animation: Animation = Animation.Fade;
  @Input()
  autoPlayDuration = 0;
  @Input()
  slideTemplateRef: TemplateRef<any>;
  @Input()
  thumbnailTemplateRef: TemplateRef<any>;
  currentInterval;
  differ: KeyValueDiffer<ActiveSlides, any>;
  @ViewChild('mainInput', { static: false }) mainInp: ElementRef;
  @ViewChild(WizardComponent, { static: false })
  public wizard: WizardComponent;
  isStepComplete = true;
  private _direction: Direction = Direction.Next;

  private _activeSlides: ActiveSlides;
  editName() {
    // this.mainInp.nativeElement.focus();
  }

  ngOnInit() {
    this.hideWizard = false;
    this.http.get('https://neon-server.herokuapp.com/users').subscribe((users: Array<any>) => {
      this.allUsers = users;
    });
    // this.neonColorClass = this.colorList.find(x => x.name === 'violet').name;
    if (this.slides) {
      this.activeSlides = this.getPreviousCurrentNextIndexes(0);
      this.differ = this.differs.find(this.activeSlides).create();
    }
  }

  ngAfterViewChecked() {
    // this.mainInp.nativeElement.focus();
  }

  resetColorsUrl() {
    this.colorList.forEach((color, i) => {
      color.url = this.cacheColorUrl[i];
    });
  }
  resetFormatsUrl() {
    this.formatSizes.forEach((f, i) => {
      f.url = this.formatCache[i];
    });
  }
  goToEC() {
    window.top.location.href = 'https://www.dessinemoiunneon.fr/espace-personnel';
  }

  goToAcceuil() {
    window.top.location.href = 'https://www.dessinemoiunneon.fr';
    this.googleAnalyticsService.eventEmitter("redirect", 'acceuil', '', 0);

  }
  signuptrue() {
    this.userInfoPerso['password'] = '';
    this.userInfoPerso['name'] = '';
    this.userInfoPerso['nickname'] = '';
    // localStorage.setItem('email', null);
    // localStorage.setItem('pw', null);
    if (this.signUp) {
      this.dynamicLoginTitle = ' vous connectant !';
    } else {
      this.dynamicLoginTitle = ' créant votre espace !';
    }
    this.signUp = !this.signUp;
    console.log('issignup:', this.signUp)
  }

  openRecap() {
    this.hideWizard = true;
    let width: any;
    width = this.imageAdditionalInfo;
    if (this.formatSizes[this.selectedFormatSize]) {
      width = this.formatSizes[this.selectedFormatSize].width + " cm";
    }
    const dialogRef = this.dialog.open(ModalRecapComponent, {
      data: {
        text: this.textInput,
        typo: this.selectedTypo,
        colors: this.selectedColor,
        size: width,
        support: this.imageSupportSelected
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.hideWizard = false;
      if (result) {
        this.onSubmitForm();
      }
    });
  }
  onSelectColor(color, index) {
    this.neonColorClass = color['name'];
    this.neonColorCode = color['color'];
    this.selectedColorUI = index;
    this.selectedColor = color['name'];
    this.resetColorsUrl();
    this.colorList.find(x => x.name === color.name).url = this.selectedColorUrl[index];
    this.colorTitle = 'Couleur selectionnée:  ';
  }

  onSelectFormatSize(format, index) {
    this.selectedFormatSize = index;
    this.resetFormatsUrl();
    this.formatSizes.find(x => x.size === format.size).url = this.formatUrl[index];

  }
  onChangeTextTitle(value: string) {
    this.textInput = value;
    if (value.length > 40) {
      this.neonFontSizeClass = 'fs-very-small';
    } else if (value.length > 25) {
      this.neonFontSizeClass = 'fs-small';

    } else {
      this.neonFontSizeClass = 'fs-medium';
    }
  }
  onSelectFile(event) {
    console.log('file selected', event);
    if (event.target.files) {
      console.log('file selected', event.target.files);
      this.textInput = event.target.files[0]['name'];
      this.imageFile = event.target.files[0];
    }
  }
  onChangeAdditionnalInfo(value: string) {
    if (value.trim() !== '') {
      this.imageAdditionalInfo = value;
    }
  }

  manageFinalStep() {
    this.finalStep = true;
    let elmt = document.getElementsByClassName('steps-indicator')[0];
    elmt.className = 'steps-indicator hidden'
    console.log('HELLO :', document.getElementsByClassName('steps-indicator'));
    this.loading = false;
  }

  exitForm() {

  }

  getTime() {
    let date_ob = new Date();

    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    // current hours
    let hours = date_ob.getHours();

    // current minutes
    let minutes = date_ob.getMinutes();

    // current seconds
    let seconds = date_ob.getSeconds();
    return year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
  }

  async onSubmitForm() {
    const payload: Array<{ title: string, data: {} }> = [];
    if (this.mainChoice === 'text') {
      payload.push({ title: this.mainChoice, data: { value: this.textInput, style: this.styleSelected } });
      payload.push({ title: 'format', data: { size: this.formatSizes[this.selectedFormatSize], imageSupport: this.imageSupportSelected } });
    } else {
      payload.push({ title: this.mainChoice, data: { file: this.imageFile, info: this.imageAdditionalInfo } });
      payload.push({ title: 'format', data: { size: this.formatSizes[this.selectedFormatSize], imageSupport: this.imageSupportSelected } });
    }
    const data = {};
    for (const field in this.userInfoPerso) {
      data[field] = this.userInfoPerso[field];
    }
    let width: any;
    width = this.imageAdditionalInfo;
    if (this.formatSizes[this.selectedFormatSize]) {
      width = this.formatSizes[this.selectedFormatSize].width;
    }
    payload.push({ title: this.projectType, data: { data } });
    const commandPayload = {
      text: this.textInput,
      typo: this.selectedTypo,
      colors: this.selectedColor,
      support: this.imageSupportSelected,
      imageAdditionalInfo: this.imageAdditionalInfo,
      height: width,
      // price: Math.floor(Math.random() * 2000) + 1 ,
      state: 'En cours de design',
      type: this.projectType,
      date: this.getTime(),
      check: false
    };

    if (localStorage.getItem('email') === null || !localStorage.getItem('email')) {
      if ((this.userInfoPerso['email'] || this.userInfoPerso['password']) && (this.userInfoPerso['email'].trim() !== '' || this.userInfoPerso['password'].trim() !== '')) {
        this.loginFailed = false;
        this.loading = true;
        this.getUser().subscribe(async (allUsers: Array<any>) => {
          console.log('all the users , ', allUsers);
          if (allUsers) {
            if (allUsers.find(x => x['email'] === this.userInfoPerso['email'])) {
              this.loginFailed = true;
              const userId = allUsers.find(x => x['email'] === this.userInfoPerso['email']).id;
              this.signUpError = 'Il existe déjà un compte avec cet email...';
              if (this.mainChoice === 'image') {
                if (this.imageFile) {
                  commandPayload['clientImageUrl'] = '';
                  const params = new HttpParams().set('userId', userId); // Create new HttpParams
                  const formData: FormData = new FormData();
                  formData.append('file', this.imageFile);
                  await this.http.post('https://neon-server.herokuapp.com/clientFileUpload', formData, { params: params }).toPromise().then((url: string) => {
                    console.log('sucess URL current:', url);
                    commandPayload['clientImageUrl'] = url;
                    // commandPayload.text = url;
                  });
                } else {
                  // alert('vous devez choisir une image');
                  this.openSnackbar('vous devez choisir une image');

                }
                this.sleep(1000);

              }
              console.log('upload file finished', commandPayload['clientImageUrl']);
              this.http.post(`https://neon-server.herokuapp.com/users/${userId}/command`, commandPayload).subscribe((newNeonList: any) => {
                console.log('updated list after post :', newNeonList);
                this.saveToStorage();
                this.manageFinalStep();
                console.log('debu 4');

              }, err => {
                if (err.status === 201 || err.status === 200) {
                  console.log('debu 5');

                  this.saveToStorage();
                  this.manageFinalStep();
                }
              });
            } else {
              this.loginFailed = false;
              this.signUpError = 'Vous devez fournir un email et un mot de passe...';
              console.log('debu 2');
              this.signUpObs().subscribe(() => {
                this.loading = false;
                this.http.get('https://neon-server.herokuapp.com/users').subscribe(async (users: Array<any>) => {
                  this.allUsers = users;
                  this.saveToStorage();
                  const userId = this.allUsers.find(x => x.email === this.userInfoPerso['email']).id;
                  if (this.mainChoice === 'image') {
                    if (this.imageFile) {
                      commandPayload['clientImageUrl'] = '';
                      console.log('sending image CaaaaaaC', userId);

                      const params = new HttpParams().set('userId', userId); // Create new HttpParams
                      const formData: FormData = new FormData();
                      formData.append('file', this.imageFile);
                      await this.http.post('https://neon-server.herokuapp.com/clientFileUpload', formData, { params: params }).toPromise().then((url: string) => {
                        console.log('sucess URL current:', url);
                        commandPayload['clientImageUrl'] = url;
                        // commandPayload.text = url;
                      });
                    } else {
                      // alert('vous devez choisir une image');
                      this.openSnackbar('vous devez choisir une image');

                    }
                    this.sleep(1000);

                  }
                  console.log('upload file finished', commandPayload['clientImageUrl']);
                  this.http.post(`https://neon-server.herokuapp.com/users/${userId}/command`, commandPayload).subscribe((newNeonList: any) => {
                    console.log('updated list after post :', newNeonList);


                    this.saveToStorage();
                    this.manageFinalStep();
                    console.log('debu 4');


                  }, err => {
                    if (err.status === 201 || err.status === 200) {


                      this.saveToStorage();
                      this.manageFinalStep();
                      console.log('debu 4');


                    }
                  });
                });

              }, err => {
                if (err.status === 201 || err.status === 200) {
                  console.log('debu 6');

                  this.loading = false;
                  this.http.get('https://neon-server.herokuapp.com/users').subscribe(async (users: Array<any>) => {
                    this.allUsers = users;
                    const userId = this.allUsers.find(x => x.email === this.userInfoPerso['email']).id;
                    if (this.mainChoice === 'image') {
                      if (this.imageFile) {
                        commandPayload['clientImageUrl'] = '';
                        console.log('sending image CaaaaaaC', userId);

                        const params = new HttpParams().set('userId', userId); // Create new HttpParams
                        const formData: FormData = new FormData();
                        formData.append('file', this.imageFile);
                        await this.http.post('https://neon-server.herokuapp.com/clientFileUpload', formData, { params: params }).toPromise().then((url: string) => {
                          console.log('sucess URL current:', url);
                          commandPayload['clientImageUrl'] = url;
                          // commandPayload.text = url;

                        });
                      } else {
                        // alert('vous devez choisir une image');
                        this.openSnackbar('vous devez choisir une image');

                      }
                      this.sleep(1000);

                    }

                    console.log('upload file finished AFTER RES URL ???', commandPayload['clientImageUrl']);
                    this.http.post(`https://neon-server.herokuapp.com/users/${userId}/command`, commandPayload).subscribe((newNeonList: any) => {
                      console.log('updated list after post :', newNeonList);

                      this.manageFinalStep();



                    }, err => {
                      if (err.status === 201 || err.status === 200) {
                        console.log('debu 7');


                        this.saveToStorage();
                        this.manageFinalStep();

                      }
                    });
                  });
                } else if (err.status === 403) {
                  this.openSnackbar('Veuillez entrer un email valide')
                  this.loading = false;
                } else if (err.status === 404) {
                  this.openSnackbar('Cet email semble introuvable')
                  this.loading = false;
                } else {
                  console.log('signup failed', err);
                  this.openSnackbar('La tentative de connection a échoué');
                  this.loading = false;
                }
              });
            }
          }
        });
      } else {
        // alert('Vous devez fournir un email et un mot de passe');
        this.openSnackbar('Vous devez fournir un email et un mot de passe');
      }
    } else {
      console.log('debu 8', localStorage.getItem('email'));
      if (!this.allUsers.find(x => x.email === localStorage.getItem('email')) && !this.signUp) {
        this.openSnackbar('Cet email ne semble pas dans notre base de donnée');
        localStorage.removeItem('email');
        localStorage.removeItem('pw');

        return;
      }
      const userId = this.allUsers.find(x => x.email === localStorage.getItem('email')).id;

      if (this.mainChoice === 'image') {
        if (this.imageFile) {
          commandPayload['clientImageUrl'] = '';
          console.log('sending image CaaaaaaC', userId);
          const params = new HttpParams().set('userId', userId); // Create new HttpParams
          const formData: FormData = new FormData();
          formData.append('file', this.imageFile);
          formData.append('commands', this.imageFile);

          await this.http.post('https://neon-server.herokuapp.com/clientFileUpload', formData, { params: params }).toPromise().then((url: string) => {
            console.log('sucess URL current:', url);
            commandPayload['clientImageUrl'] = url;
            // commandPayload.text = url;

          });
        } else {
          // alert('vous devez choisir une image');
          this.openSnackbar('Vous devez fournir une image');

        }
        this.sleep(1000);

      }
      console.log('upload file finished', commandPayload['clientImageUrl']);
      this.http.post(`https://neon-server.herokuapp.com/users/${userId}/command`, commandPayload).subscribe((newNeonList: any) => {
        console.log('updated list after post :', newNeonList);
        this.manageFinalStep();

      }, err => {
        if (err.status === 201 || err.status === 200) {
          console.log('debu 9   ');

          this.saveToStorage();
          this.manageFinalStep();
        }
      });
    }


  }

  sleep(milliseconds) {
    const start = new Date().getTime();
    for (let i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds) {
        break;
      }
    }
  }
  async onCompleteStep(step: number, choice: string, data: any) {
    this.isStepComplete = true;
    if (choice && step === 0) {
      if (choice !== this.mainChoice) {
        this.textInput = '';
      }
      if (choice === 'text') {
        setTimeout(() => {
          this.mainInp.nativeElement.focus();
        }, 200);

      }
      this.googleAnalyticsService.eventEmitter("form", "text/image", choice, 1);
      this.mainChoice = choice;
      this.userChoices[step] = choice;
    }

    if (step === 3) {
      if (choice === 'erase') {
        this.userChoices[step] = null;
        this.googleAnalyticsService.eventEmitter("form", "précédent", 'typo', 1);
      } else {
        this.userChoices[step] = choice;
        this.googleAnalyticsService.eventEmitter("form", "typo", choice, 3);
      }
    }
    if (step === 4) {
      if (choice === 'standard') {
        this.imageSupportSelected = 'standard';
      } else {
        this.userChoices[step] = choice;
        this.imageSupportSelected = 'détouré';

      }
      this.googleAnalyticsService.eventEmitter("form", 'format', choice, 1);


      if (localStorage.getItem('email')) {
        let width: any;
        width = this.imageAdditionalInfo;
        if (this.formatSizes[this.selectedFormatSize]) {
          width = this.formatSizes[this.selectedFormatSize].width;
        }

        const dialogRef = this.dialog.open(ModalRecapComponent, {
          data: {
            text: this.textInput,
            typo: this.selectedTypo,
            colors: this.selectedColor,
            size: width,
            support: this.imageSupportSelected
          }
        });
        this.hideWizard = true;

        dialogRef.afterClosed().subscribe(result => {
          this.hideWizard = false;
          console.log('The dialog was closed', result);
          if (result !== undefined) {
            this.loading = true;
            this.onSubmitForm();
          } else {
            this.wizard.goToStep(5);
          }
        });
      }

    }
    if (choice && step === 5) {
      this.userChoices[6] = choice;
      if (choice !== this.projectType) {
        this.userInfoPerso = {};
      }
      this.projectType = choice;
      this.googleAnalyticsService.eventEmitter("form", 'type', choice, 1);
    }
    console.log('step ', step, ' completed. The user chose ', choice, '... data to save: ', this.projectType);
  }

  onChangeUserInfo(target: string, value: string) {
    if (value.trim() !== '') {
      this.userInfoPerso[target] = value;
    }
    if (target === 'email') {
      this.signUp ? localStorage.removeItem('email') : localStorage.setItem('email', value);
    }
  }

  goToSignupStep() {
    this.isStepComplete = false;
  }

  onClickFirstStep(choice) {
    this.userFirstChoice = choice;
  }
  onPressPrevBtn(stepNumber) {
    this.googleAnalyticsService.eventEmitter("form", 'précédent', stepNumber, 0);
    this.isStepComplete = true;
  }

  onPressNextBtn(eventName, choice) {
    this.googleAnalyticsService.eventEmitter("form", eventName, choice, 4);
  }

  signUpObs() {
    const headers = new HttpHeaders({ 'content-type': 'application/json', 'Accept': 'application/json' });
    const password = this.projectType === 'consumer' ? this.userInfoPerso['password'] : this.userInfoPerso['société'];
    const payload = {
      email: this.userInfoPerso['email'],
      password: password,
      name: this.userInfoPerso['name'],
      nickname: this.userInfoPerso['nickname'],
      type: this.projectType
    };
    return this.http.post('https://neon-server.herokuapp.com/users', payload, { headers: headers });
  }

  openSnackbar(msg) {
    this._snackBar.open(msg, 'Ok', {
      duration: 2000,
    });
  }

  getUser() {
    return this.http.get('https://neon-server.herokuapp.com/users');

  }


  saveToStorage() {
    if (this.projectType === 'business') {
      return;
    }
    if (this.userInfoPerso['email'] && this.userInfoPerso['email'].trim() !== '') {
      localStorage.setItem('email', this.userInfoPerso['email']);

    }
    if (this.userInfoPerso['password'] && this.userInfoPerso['password'].trim() !== '') {
      localStorage.setItem('pw', this.userInfoPerso['password']);
    }
  }

  select(index: number): void {
    this.activeSlides = this.getPreviousCurrentNextIndexes(index);
    this.direction = this.getDirection(this.activeSlides.current, index);
    this.neonTypoClass = this.slides[index]['font'];
    this.selectedTypo = this.slides[index]['font'];
    if (this.differ.diff(this.activeSlides)) {
      this.cd.detectChanges();
    }
  }

  getDirection(oldIndex: number, newIndex: number): Direction {
    const images = this.slides;

    if (oldIndex === images.length - 1 && newIndex === 0) {
      return Direction.Next;
    } else if (oldIndex === 0 && newIndex === images.length - 1) {
      return Direction.Prev;
    }

    return oldIndex < newIndex ? Direction.Next : Direction.Prev;
  }

  getPreviousCurrentNextIndexes(index: number): ActiveSlides {
    const images = this.slides;

    return {
      previous: (index === 0 ? images.length - 1 : index - 1) % images.length,
      current: index % images.length,
      next: (index === images.length - 1 ? 0 : index + 1) % images.length
    };
  }

  getAnimationSlideState(index: number) {
    return index === this.activeSlides.current ? 'current' : index === this.activeSlides.next ? 'next' : index === this.activeSlides.previous ? 'previous' : '';
  }

  startTimer(): void {
    this.resetTimer();

    if (this.autoPlayDuration > 0) {
      this.currentInterval = setInterval(() => this.select(this.activeSlides.next), this.autoPlayDuration);
    }
  }

  resetTimer(): void {
    if (this.currentInterval) {
      clearInterval(this.currentInterval);
    }
  }



}
