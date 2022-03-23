import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {AlertController, IonicModule, NavController} from '@ionic/angular';

import {TermPage} from './term.page';
import {AbstractStorageService} from '../../services/storage/abstract-storage-service';
import {MockStorageService} from '../../services/storage/mock-storage.service';
import {Collection} from '../../classes/collection/collection';
import {Emoji} from '../../classes/emoji/emoji';
import {CollectionService} from '../../services/collection/collection.service';
import {RouterTestingModule} from '@angular/router/testing';
import {Category} from '../../classes/category/category';
import {ActivatedRoute} from '@angular/router';
import {TermService} from '../../services/term/term.service';
import {Term} from '../../classes/term/term';
import {MockAlertController, MockNavController} from '../../../mocks';
import {CategoryType} from '../../enums/enums';
import {HomePage} from '../home/home.page';

describe('TermPage for creating term', () => {
  let component: TermPage;
  let fixture: ComponentFixture<TermPage>;

  let collection: Collection;
  let collectionService: CollectionService;
  let termService: TermService;
  let newCG: Category;
  let newCT: Category;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TermPage],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([{path: '', component: HomePage}])],
      providers: [
        {provide: AbstractStorageService, useClass: MockStorageService},
      ]
    }).compileComponents();

    collectionService = TestBed.inject(CollectionService);
    termService = TestBed.inject(TermService);
  }));

  beforeEach(waitForAsync(() => {
    collection = new Collection('English', 'EN', new Emoji('flags', 'uk'));
    newCG = new Category('sampleG1', CategoryType.gramatical);
    newCT = new Category('sampleT1', CategoryType.thematic);
    collection.addGramaticalCategory(newCG);
    collection.addThematicCategory(newCT);
    initialize();
  }));

  const initialize = (): Promise<void> => new Promise(res => {
    collectionService.addCollection(collection).then((c) => {
      collectionService.setActiveCollection(c.getId()).then(cActive => {
        collection = cActive;
        fixture = TestBed.createComponent(TermPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
        res();
      });
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.editingID).toBeUndefined();
    expect(component.title).toEqual('New term');
  });

  it('should update category chips', () => {
    const value1 = [new Category('Body', undefined), new Category('Family', undefined)];
    const value2 = [new Category('Family', undefined), new Category('Body', undefined)];
    component.updateChips(new CustomEvent<any>('', {detail: {value: value1}}), 0);
    component.updateChips(new CustomEvent<any>('', {detail: {value: value2}}), 1);
    expect(component.selectedGramaticalCategories).toEqual(value1);
    expect(component.selectedThematicCategories).toEqual(value2);
  });

  it('should create term when submit', async () => {

    component.termForm.patchValue({
      originalTerm: 'sample',
      translatedTerm: 'sample',
      gramaticalCategories: [newCG],
      thematicCategories: [newCT],
      notes: 'sample'
    });
    await component.onSubmit();

    collection = await collectionService.getCollectionById(collection.getId());
    const term = collection.getTerms()[0];
    expect(term).not.toBeUndefined();
    collection = await collectionService.getCollectionById(collection.getId());
    expect(term.getOriginalTerm()).toEqual('sample');
    expect(term.getTranslatedTerm()).toEqual('sample');
    expect(term.getGramaticalCategories()).toEqual([newCG]);
    expect(term.getThematicCategories()).toEqual([newCT]);
    expect(term.getNotes()).toEqual('sample');
  });
});

describe('TermPage for updating term', () => {
  let component: TermPage;
  let fixture: ComponentFixture<TermPage>;

  let collection: Collection;
  let collectionService: CollectionService;
  let term: Term;
  let termService: TermService;

  let newCG: Category;
  let newCT1: Category;
  let newCT2: Category;

  beforeEach(waitForAsync(() => {
    const mockActivatedRoute = {snapshot: {paramMap: {get: () => 1}}};
    TestBed.configureTestingModule({
      declarations: [TermPage],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule
      ],
      providers: [
        {provide: AbstractStorageService, useClass: MockStorageService},
        {provide: ActivatedRoute, useValue: mockActivatedRoute},
        {provide: AlertController, useClass: MockAlertController},
        {provide: NavController, useClass: MockNavController},
        {provide: AlertController, useClass: MockAlertController},
      ]
    }).compileComponents();

    collectionService = TestBed.inject(CollectionService);
    termService = TestBed.inject(TermService);
  }));

  beforeEach(waitForAsync(() => {
    collection = new Collection('English', 'EN', new Emoji('flags', 'uk'));
    newCG = new Category('sampleG1', CategoryType.gramatical);
    newCT1 = new Category('sampleT1', CategoryType.thematic);
    newCT2 = new Category('sampleT2', CategoryType.thematic);
    collection.addGramaticalCategory(newCG);
    collection.addThematicCategory(newCT1);
    collection.addThematicCategory(newCT2);
    term = new Term('Hand', 'Mano', 'This is a hand');
    term.addGramaticalCategory(newCG);
    term.addThematicCategory(newCT1);
    initialize();
  }));

  const initialize = (): Promise<void> => new Promise(res => {
    collectionService.addCollection(collection).then((c) => {
      collectionService.setActiveCollection(c.getId()).then(cActive => {
        termService.addTerm(term, cActive.getId()).then(t => {
          collectionService.getActiveCollection().then(cA => {
            collection = cA;
            term = t;
            fixture = TestBed.createComponent(TermPage);
            component = fixture.componentInstance;
            fixture.detectChanges();
            res();
          });
        });
      });
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.editingID).toBe(1);
    expect(component.title).toEqual('Update term');
    expect(component.termForm.getRawValue()).toEqual({
      originalTerm: term.getOriginalTerm(),
      translatedTerm: term.getTranslatedTerm(),
      gramaticalCategories: term.getGramaticalCategories(),
      thematicCategories: term.getThematicCategories(),
      notes: term.getNotes()
    });
  });

  it('should update when submit', async () => {
    spyOn(termService, 'updateTerm');
    component.termForm.patchValue({
      originalTerm: term.getOriginalTerm() + '1',
      translatedTerm: term.getTranslatedTerm() + '1',
      gramaticalCategories: [],
      thematicCategories: [newCT2],
      notes: term.getNotes() + '1'
    });
    await component.onSubmit();
    expect(termService.updateTerm).toHaveBeenCalled();
  });

  it('should update category chips and replace older ones', () => {
    const value1 = [new Category('Body', undefined), new Category('Family', undefined)];
    const value2 = [new Category('Family', undefined), new Category('Body', undefined)];
    component.updateChips(new CustomEvent<any>('', {detail: {value: value1}}), 0);
    component.updateChips(new CustomEvent<any>('', {detail: {value: value2}}), 1);
    expect(component.selectedGramaticalCategories).toEqual(value1);
    expect(component.selectedThematicCategories).toEqual(value2);
  });

  it('should open modal for deletion', async () => {
    const alertController = fixture.debugElement.injector.get(AlertController);
    spyOn(alertController, 'create').and.callThrough();
    await component.openDeletionAlert();
    expect(alertController.create).toHaveBeenCalled();
  });
});