import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, NavController, ToastController} from '@ionic/angular';

import {NewTagPage} from './new-tag.page';
import {EmojisMap} from '../../services/emoji/emojisMap';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {MockNavController} from '../../../mocks';
import {AbstractStorageService} from '../../services/storage/abstract-storage-service';
import {MockStorageService} from '../../services/storage/mock-storage.service';
import {EmojiPickerModule} from '../../components/emoji-picker/emoji-picker.module';
import {EmojiPipeModule} from '../../pipes/emoji-pipe/emoji-pipe.module';
import {HomePage} from '../home/home.page';
import {Emoji} from '../../classes/emoji/emoji';
import {TagOptions} from '../../classes/tagOptions/tag-options';
import {CollectionService} from '../../services/collection/collection.service';
import {Collection} from '../../classes/collection/collection';
import {TagService} from '../../services/tag/tag.service';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';

describe('NewTagPage', () => {
  let component: NewTagPage;
  let fixture: ComponentFixture<NewTagPage>;
  let tagOptions: TagOptions;

  let routerSpy;
  let collectionServiceSpy;

  beforeEach(waitForAsync(() => {
    tagOptions = new TagOptions('búsqueda');
    const collection = new Collection('a', 'b', undefined);
    collection.setId(1);
    collectionServiceSpy = {getActiveCollection: jasmine.createSpy('getActiveCollection').and.returnValue(collection)};
    routerSpy = {getCurrentNavigation: jasmine.createSpy('getCurrentNavigation').and.returnValue({extras: {state: tagOptions}})};

    TestBed.configureTestingModule({
      declarations: [NewTagPage],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule.withRoutes([{path: '/', component: HomePage}]),
        EmojiPickerModule,
        EmojiPipeModule,
        ReactiveFormsModule
      ],
      providers: [
        {provide: EmojisMap},
        {provide: Router, useValue: routerSpy},
        {provide: NavController, useClass: MockNavController},
        {provide: AbstractStorageService, useClass: MockStorageService},
        {provide: CollectionService, useValue: collectionServiceSpy},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(NewTagPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select emoji', () => {
    const emoji = new Emoji('a', 'b');
    component.selectEmoji(emoji);
    expect(component.selectedEmoji).toEqual(emoji);
  });

  it('should NOT select emoji', () => {
    component.selectEmoji(undefined);
    expect(component.selectedEmoji).toBeTruthy();
  });

  it('should toggle modal', () => {
    const previousState = component.modalStatus;
    component.toggleModal();
    expect(component.modalStatus).not.toBe(previousState);
  });

  it('should submit new tag', async () => {
    component.tagForm.patchValue({name: 'new tag', icon: new Emoji('a', 'b')});

    const navController = TestBed.inject(NavController);
    const toastController = TestBed.inject(ToastController);
    const tagService = TestBed.inject(TagService);
    spyOn(navController, 'navigateBack');
    spyOn(toastController, 'create').and.callThrough();
    spyOn(tagService, 'addTag');

    await component.onSubmit();
    expect(tagService.addTag).toHaveBeenCalled();
    expect(navController.navigateBack).toHaveBeenCalledWith('/');
    expect(toastController.create).toHaveBeenCalled();
  });

  it('it should fail at creating tag', async () => {
    component.tagForm.patchValue({name: 'new tag', icon: new Emoji('a', 'b')});

    const navController = TestBed.inject(NavController);
    const toastController = TestBed.inject(ToastController);

    spyOn(navController, 'navigateBack');
    spyOn(toastController, 'create').and.callThrough();

    await component.onSubmit();
    await component.onSubmit();
    expect(toastController.create).toHaveBeenCalledWith({
      header: 'Error when creating tag',
      message: 'TypeError: this.collectionService.getCollections is not a function',
      color: 'danger',
      duration: 800
    });
    expect(navController.navigateBack).toHaveBeenCalledWith('/');
  });
});

describe('NewTagPage with no data provided', () => {
  let component: NewTagPage;
  let fixture: ComponentFixture<NewTagPage>;
  let navControllerSpy: NavController;

  let routerSpy;
  beforeEach(() => {
    routerSpy = {getCurrentNavigation: jasmine.createSpy('getCurrentNavigation')};
    TestBed.configureTestingModule({
      declarations: [NewTagPage],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule.withRoutes([{path: '/', component: HomePage}]),
        EmojiPickerModule,
        EmojiPipeModule,
        ReactiveFormsModule
      ],
      providers: [
        {provide: EmojisMap},
        {provide: Router, useValue: routerSpy},
        {provide: NavController, useClass: MockNavController},
        {provide: AbstractStorageService, useClass: MockStorageService},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
    navControllerSpy = TestBed.inject(NavController);
    spyOn(navControllerSpy, 'navigateBack');
    fixture = TestBed.createComponent(NewTagPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should navigate back', () => {
    expect(navControllerSpy.navigateBack).toHaveBeenCalled();
  });
});
