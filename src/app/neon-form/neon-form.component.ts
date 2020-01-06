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
import {MatDialog} from '@angular/material';
import {ModalRecapComponent} from '../modal-recap/modal-recap.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {WizardComponent} from 'angular-archwizard';

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
  constructor(private http: HttpClient, private cd: ChangeDetectorRef, private _snackBar: MatSnackBar,
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
  lesserSign = '<';
  userChoices = {};
  userInfoPerso = {};
  trim = String.prototype.trim;
  suceMaBite = '  créant votre espace !';
  finalStep = false;
  signUp = true;
  styleSelected = null;
  signUpError = 'Il existe déjà un compte avec cet email...';
  loginFailed = false;
  textInput = '';
  neonFontSizeClass = 'fs-medium';
  neonColorCode = '';
  neonTypoClass = 'Lilly';
  neonColorClass = 'blancFroid';
  selectedColor;
  selectedTypo = 'Lilly';
  imageFile = '';
  loading = false;
  mainChoice = '';
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
    { name: 'blancFroid', color: '#ffffff', url: '../.././assets/blanc.png' },
    { name: 'blanchaud', color: '#ede3c5', url: '../.././assets/blanchaud.png' },
    { name: 'orange', color: '#ffa42c', url: '../.././assets/orange.png' },
    { name: 'jaune', color: '#ffe600', url: '../.././assets/jaune.png' },
    { name: 'rouge', color: '#ff0000', url: '../.././assets/rouge.png' },
    { name: 'rose', color: '#ff73ff', url: '../.././assets/rose.png' },
    { name: 'fuschia', color: '#df29ff', url: '../.././assets/fuschia.png' },
    { name: 'violet', color: '#9527ff', url: '../.././assets/violet.png' },
    { name: 'bleu', color: '#337dff', url: '../.././assets/bleu.png' },
    { name: 'vert', color: '#15e81f', url: '../.././assets/vert.png' },
    { name: 'turquoise', color: '#17fff9', url: '../.././assets/turquoise.png' },
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
  @ViewChild('mainInput',  {static: false}) mainInp: ElementRef;
  @ViewChild(WizardComponent,  {static: false})
  public wizard: WizardComponent;
  enculeunponey = true;
  private _direction: Direction = Direction.Next;

  private _activeSlides: ActiveSlides;
  editName() {
      // this.mainInp.nativeElement.focus();
  }

  ngOnInit() {
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
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  goToAcceuil() {
    window.top.location.href = 'https://www.dessinemoiunneon.fr';

  }
  signuptrue() {
    this.userInfoPerso['password'] = '';
    this.userInfoPerso['name'] = '';
    this.userInfoPerso['nickname'] = '';
    if (this.signUp) {
      this.suceMaBite = ' vous connectant !';

    } else {
      this.suceMaBite = ' créant votre espace !';

    }

    this.signUp = !this.signUp;
  }

  openRecap() {
    const dialogRef = this.dialog.open(ModalRecapComponent, {
      data: {
        text: this.textInput,
        typo: this.selectedTypo,
        colors: this.selectedColor,
        size: this.formatSizes[this.selectedFormatSize].width,
        support: this.imageSupportSelected
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
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
    console.log('HELLO :', document.getElementsByClassName('steps-indicator'))
    // if(this.projectType === null) {
    //   this.projectType === 'consumer'
    // }
    this.loading = false;
  }

  exitForm() {

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
    payload.push({ title: this.projectType, data: { data } });
    const commandPayload = {
      text: this.textInput,
      typo: this.selectedTypo,
      colors: this.selectedColor,
      support: this.imageSupportSelected,
      imageAdditionalInfo: this.imageAdditionalInfo,
      height: this.formatSizes[this.selectedFormatSize].width,
      // price: Math.floor(Math.random() * 2000) + 1 ,
      state: 'created',
      type: this.projectType
    };


    if (localStorage.getItem('email') === null) {
      if ((this.userInfoPerso['email'] || this.userInfoPerso['password']) && (this.userInfoPerso['email'].trim() !== '' || this.userInfoPerso['password'].trim() !== '')) {
        this.loginFailed = false;
        this.loading = true;
        this.getUser().subscribe((allUsers: Array<any>) => {
          console.log('all the users , ', allUsers);
          if (allUsers) {
            if (allUsers.find(x => x['email'] === this.userInfoPerso['email'])) {
              this.loginFailed = true;
              const userId = allUsers.find(x => x['email'] === this.userInfoPerso['email']).id;
              this.signUpError = 'Il existe déjà un compte avec cet email...';
              if (this.mainChoice === 'image') {
                if (this.imageFile) {
                  commandPayload['clientImageUrl'] = '';
                  console.log('sending image CaaaaaaC', userId);

                  const params = new HttpParams().set('userId', userId); // Create new HttpParams
                  const formData: FormData = new FormData();
                  formData.append('file', this.imageFile);
                  this.http.post('https://neon-server.herokuapp.com/clientFileUpload', formData, { params: params }).subscribe((url) => {
                    console.log('sucess URL:', url);
                    commandPayload['clientImageUrl'] = url;
                    return url;
                  }, err => {
                    if (err['status'] === 200) {

                    }
                  });
                } else {
                  // alert('vous devez choisir une image');
                  this.openSnackBar('vous devez choisir une image', 'OK');

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
                this.http.get('https://neon-server.herokuapp.com/users').subscribe((users: Array<any>) => {
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
                      this.http.post('https://neon-server.herokuapp.com/clientFileUpload', formData, { params: params }).subscribe((url) => {
                        console.log('sucess URL:', url);
                        commandPayload['clientImageUrl'] = url;
                        return url;
                      }, err => console.log('err', err));
                    } else {
                      // alert('vous devez choisir une image');
                      this.openSnackBar('vous devez choisir une image', 'OK');

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
                  this.saveToStorage();
                  this.http.get('https://neon-server.herokuapp.com/users').subscribe((users: Array<any>) => {
                    this.allUsers = users;
                    const userId = this.allUsers.find(x => x.email === this.userInfoPerso['email']).id;
                    if (this.mainChoice === 'image') {
                      if (this.imageFile) {
                        commandPayload['clientImageUrl'] = '';
                        console.log('sending image CaaaaaaC', userId);

                        const params = new HttpParams().set('userId', userId); // Create new HttpParams
                        const formData: FormData = new FormData();
                        formData.append('file', this.imageFile);
                        this.http.post('https://neon-server.herokuapp.com/clientFileUpload', formData, { params: params }).subscribe((url) => {
                          console.log('sucess URL:', url);
                          commandPayload['clientImageUrl'] = url;
                          return url;
                        }, err => console.log('err', err));
                      } else {
                        // alert('vous devez choisir une image');
                        this.openSnackBar('vous devez choisir une image', 'OK');

                      }
                      this.sleep(1000);

                    }
                    console.log('upload file finished', commandPayload['clientImageUrl']);
                    this.http.post(`https://neon-server.herokuapp.com/users/${userId}/command`, commandPayload).subscribe((newNeonList: any) => {
                      console.log('updated list after post :', newNeonList);

                      this.saveToStorage();
                      this.manageFinalStep();



                    }, err => {
                      if (err.status === 201 || err.status === 200) {
                        console.log('debu 7');


                        this.saveToStorage();
                        this.manageFinalStep();

                      }
                    });
                  });
                } else {
                   console.log('signup failed', err);
                   this.openSnackBar('La tentative de connection a échoué', 'OK');

                  this.loading = false;
                }
              });
            }
          }
        });
      } else {
        // alert('Vous devez fournir un email et un mot de passe');
        this.openSnackBar('Vous devez fournir un email et un mot de passe', 'OK');
      }
    } else {
      console.log('debu 8', localStorage.getItem('email'));

      const userId = this.allUsers.find(x => x.email === localStorage.getItem('email')).id;
      if (this.mainChoice === 'image') {
        if (this.imageFile) {
          commandPayload['clientImageUrl'] = '';
          console.log('sending image CaaaaaaC', userId);

          const params = new HttpParams().set('userId', userId); // Create new HttpParams
          const formData: FormData = new FormData();
          formData.append('file', this.imageFile);
          this.http.post('https://neon-server.herokuapp.com/clientFileUpload', formData, { params: params }).subscribe((url) => {
            console.log('sucess URL:', url);
            commandPayload['clientImageUrl'] = url;
            return url;
          }, err => console.log('err', err));
        } else {
          // alert('vous devez choisir une image');
          this.openSnackBar('Vous devez fournir une image', 'OK');

        }
        this.sleep(1000);

      }
      console.log('upload file finished', commandPayload['clientImageUrl']);
      this.http.post(`https://neon-server.herokuapp.com/users/${userId}/command`, commandPayload).subscribe((newNeonList: any) => {
        console.log('updated list after post :', newNeonList);

        this.saveToStorage();
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
    this.enculeunponey = true;
    if (choice && step === 0) {
      if (choice !== this.mainChoice) {
        this.textInput = '';
      }
      if (choice === 'text') {
        setTimeout(() => {
          this.mainInp.nativeElement.focus();

        }, 200);

      }
      this.mainChoice = choice;
      this.userChoices[step] = choice;
    }

    if (step === 3) {
      if (choice === 'erase') {
        this.userChoices[step] = null;
      } else {
        this.userChoices[step] = choice;

      }
    }
    if (step === 4) {
      if (choice === 'standard') {
        this.imageSupportSelected = 'standard';
      } else {
        this.userChoices[step] = choice;
        this.imageSupportSelected = 'détouré';

      }

      if (localStorage.getItem('email')) {


        const dialogRef = this.dialog.open(ModalRecapComponent, {
          data: {
            text: this.textInput,
            typo: this.selectedTypo,
            colors: this.selectedColor,
            size: this.formatSizes[this.selectedFormatSize].width,
            support: this.imageSupportSelected
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed', result);
          if (result) {
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
      this.enculeunponey = false;
      if (choice !== this.projectType) {
        this.userInfoPerso = {};
      }
      this.projectType = choice;


    }

    console.log('step ', step, ' completed. The user chose ', choice, '... data to save: ', this.projectType);

  }

  onChangeUserInfo(target: string, value: string) {
    if (value.trim() !== '') {
      this.userInfoPerso[target] = value;
    }
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

  getUser() {
    return this.http.get('https://neon-server.herokuapp.com/users');

  }


  saveToStorage() {
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
