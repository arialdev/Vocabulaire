import {Collection} from './collection';
import {Language} from '../language/language';
import {Term} from '../term/term';
import {Category} from '../category/category';
import {CategoryType} from '../categoryType/category-type';
import {Tag} from '../../interfaces/tag';

describe('Collection', () => {

  let collection: Collection;
  let language: Language;
  let term: Term;

  beforeEach(() => {
    language = new Language('Italian', 'it', 'it.png');
    collection = new Collection(language);
    term = new Term('sample', 'ejemplo');
  });

  it('should create an instance', () => {
    expect(collection).toBeTruthy();
    expect(new Collection('French', 'fr', 'fr.png')).toBeTruthy();
  });

  it('should get language', () => {
    expect(collection.getLanguage()).toEqual(language);
  });

  it('should set language', () => {
    const newLanguage = new Language('Spanish', 'es', 'es.png');
    spyOn(collection, 'updateUpdatedTime');
    collection.setLanguage(newLanguage);
    expect(collection.getLanguage()).toEqual(newLanguage);
    expect(collection.updateUpdatedTime).toHaveBeenCalled();
  });

  it('should get default terms', () => {
    expect(collection.getTerms()).toEqual([]);
  });

  it('should add single term', () => {
    spyOn(collection, 'updateUpdatedTime');
    collection.addTerm(term);
    const terms = collection.getTerms();
    expect(terms).toEqual([term]);
    expect(terms.every(t => t.getCollection() === collection)).toBeTrue();
    expect(collection.updateUpdatedTime).toHaveBeenCalled();
  });

  it('should add multiple terms', () => {
    spyOn(collection, 'updateUpdatedTime');
    const newTerms = [
      term,
      new Term('sample2', 'ejemplo2')
    ];
    collection.addTerms(newTerms);
    const terms = collection.getTerms();
    expect(terms).toEqual(newTerms);
    expect(terms.every(t => t.getCollection() === collection)).toBeTrue();
    expect(collection.updateUpdatedTime).toHaveBeenCalled();
  });

  it('should remove term', () => {
    spyOn(collection, 'updateUpdatedTime');
    term.setId(12);
    collection.addTerm(term);
    collection.removeTerm(12);
    expect(collection.getTerms()).toEqual([]);
    expect(collection.updateUpdatedTime).toHaveBeenCalled();
  });

  it('should get default gramatical categories', () => {
    expect(collection.getGramaticalCategories()).toEqual([]);
  });

  it('should add gramatical category', () => {
    spyOn(collection, 'updateUpdatedTime');
    const gramaticalCategory = new Category('noun', new CategoryType('gramatical'));
    collection.addGramaticalCategory(gramaticalCategory);
    expect(collection.getGramaticalCategories()).toEqual([gramaticalCategory]);
    expect(collection.updateUpdatedTime).toHaveBeenCalled();
  });

  it('should remove gramatical category', () => {
    spyOn(collection, 'updateUpdatedTime');
    const gramaticalCategory = new Category('noun', new CategoryType('gramatical'));
    gramaticalCategory.setId(12);
    collection.addGramaticalCategory(gramaticalCategory);
    collection.removeGramaticalCategory(12);
    expect(collection.getGramaticalCategories()).toEqual([]);
    expect(collection.updateUpdatedTime).toHaveBeenCalled();
  });

  it('should get default thematic categories', () => {
    expect(collection.getThematicCategories()).toEqual([]);
  });

  it('should add thematic category', () => {
    spyOn(collection, 'updateUpdatedTime');
    const gramaticalCategory = new Category('noun', new CategoryType('thematic'));
    collection.addThematicCategory(gramaticalCategory);
    expect(collection.getThematicCategories()).toEqual([gramaticalCategory]);
    expect(collection.updateUpdatedTime).toHaveBeenCalled();
  });

  it('should remove thematic category', () => {
    spyOn(collection, 'updateUpdatedTime');
    const thematicCategory = new Category('noun', new CategoryType('thematic'));
    thematicCategory.setId(12);
    collection.addThematicCategory(thematicCategory);
    collection.removeThematicCategory(12);
    expect(collection.getThematicCategories()).toEqual([]);
    expect(collection.updateUpdatedTime).toHaveBeenCalled();
  });

  it('should get default tags', () => {
    expect(collection.getTags()).toEqual([]);
  });

  it('should add tag', () => {
    spyOn(collection, 'updateUpdatedTime');
    const tag: Tag = {
      id: 1,
      icon: 'smile',
      name: 'expressions',
      options: undefined,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
      status: true
    };
    collection.addTag(tag);
    expect(collection.getTags()).toEqual([tag]);
    expect(collection.updateUpdatedTime).toHaveBeenCalled();
  });

  it('should remove tag', () => {
    spyOn(collection, 'updateUpdatedTime');
    const tag: Tag = {
      id: 1,
      icon: 'smile',
      name: 'expressions',
      options: undefined,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
      status: true
    };
    collection.addTag(tag);
    collection.removeTag(tag.id);
    expect(collection.getTags()).toEqual([]);
    expect(collection.updateUpdatedTime).toHaveBeenCalled();
  });
});
