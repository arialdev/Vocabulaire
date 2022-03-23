import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CollectionService} from '../../services/collection/collection.service';
import {Collection} from '../../classes/collection/collection';
import {AlertController, IonSelect, NavController} from '@ionic/angular';
import {Category} from '../../classes/category/category';
import {Term} from '../../classes/term/term';
import {TermService} from '../../services/term/term.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-term',
  templateUrl: './term.page.html',
  styleUrls: ['./term.page.scss'],
})
export class TermPage implements OnInit {
  @ViewChild('gramaticalCategoriesDropdown') gramaticalCategoriesDropdown: IonSelect;
  @ViewChild('thematicCategoriesDropdown') thematicCategoriesDropdown: IonSelect;
  title: string;
  termForm: FormGroup;
  customAlertOptions: any;
  languageLabel: string;
  gramaticalCategoriesList: Category[];
  thematicCategoriesList: Category[];

  selectedGramaticalCategories: Category[];
  selectedThematicCategories: Category[];

  editingID: number;

  private activeCollection: Collection;

  constructor(
    private collectionService: CollectionService,
    private termService: TermService,
    private navController: NavController,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {
    this.termForm = new FormGroup({
      originalTerm: new FormControl('', Validators.required),
      translatedTerm: new FormControl('', Validators.required),
      gramaticalCategories: new FormControl(''),
      thematicCategories: new FormControl(''),
      notes: new FormControl(''),
    });
    this.customAlertOptions = {
      header: 'Gramatical categories',
      translucent: true,
    };
    this.selectedGramaticalCategories = [];
    this.selectedThematicCategories = [];
  }

  async ngOnInit() {
    this.activeCollection = await this.collectionService.getActiveCollection();
    this.languageLabel = this.activeCollection.getLanguage().getName();
    this.gramaticalCategoriesList = this.activeCollection.getGramaticalCategories();
    this.thematicCategoriesList = this.activeCollection.getThematicCategories();

    const id: string = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.editingID = +id;
    }
    if (this.editingID) {
      this.title = 'Update term';
      await this.editingMode();
    } else {
      this.title = 'New term';
    }
  }

  async onSubmit() {
    const {originalTerm, translatedTerm, gramaticalCategories, thematicCategories, notes} = this.termForm.getRawValue();
    const term = new Term(originalTerm, translatedTerm, notes);
    term.addGramaticalCategories(gramaticalCategories);
    term.addThematicCategories(thematicCategories);

    if (this.editingID) {
      await this.termService.updateTerm(this.editingID, term, this.activeCollection.getId());
    } else {
      await this.termService.addTerm(term, this.activeCollection.getId());
    }
    await this.navController.navigateBack('');
  }

  async openDeletionAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Confirm deletion',
      message: 'This action cannot be undone',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        }, {
          text: 'Delete',
          handler: async () => {
            await this.termService.deleteTerm(this.editingID, this.activeCollection.getId());
            await this.navController.navigateBack('');
          }
        }
      ]
    });

    await alert.present();
  }

  updateChips(event: CustomEvent, type: number) {
    switch (type) {
      case 0:
        this.selectedGramaticalCategories = event.detail.value;
        break;
      case 1:
        this.selectedThematicCategories = event.detail.value;
        break;
    }
  }

  private async editingMode() {
    const term = this.activeCollection.getTerms().find(t => t.getId() === this.editingID);
    this.termForm.patchValue({
      originalTerm: term.getOriginalTerm(),
      translatedTerm: term.getTranslatedTerm(),
      gramaticalCategories: term.getGramaticalCategories(),
      thematicCategories: term.getThematicCategories(),
      notes: term.getNotes()
    });
  }
}