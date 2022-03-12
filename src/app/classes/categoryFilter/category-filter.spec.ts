import {CategoryFilter} from './category-filter';
import {Category} from '../category/category';
import {CategoryType} from '../categoryType/category-type';

describe('CategoryFilter', () => {
  let categoryFilter: CategoryFilter;
  let category: Category;

  beforeEach(() => {
    category = new Category('Body', undefined);
    categoryFilter = new CategoryFilter(category, true);
  });

  it('should create an instance', () => {
    expect(categoryFilter).toBeTruthy();
    expect(new CategoryFilter(category, false)).toBeTruthy();
  });

  it('should get category', () => {
    expect(categoryFilter.getCategory()).toEqual(category);
  });

  it('should setCategory', () => {
    spyOn(categoryFilter, 'updateUpdatedTime');
    const newCategory = new Category('people', new CategoryType('thematic'));
    categoryFilter.setCategory(newCategory);
    expect(categoryFilter.getCategory()).toEqual(newCategory);
    expect(categoryFilter.updateUpdatedTime).toHaveBeenCalled();
  });

  it('should get selected value', () => {
    expect(categoryFilter.isSelected()).toBeTrue();
  });

  it('should change selected value', () => {
    spyOn(categoryFilter, 'updateUpdatedTime');
    categoryFilter.select(false);
    expect(categoryFilter.isSelected()).toBeFalse();
    categoryFilter.select(true);
    expect(categoryFilter.isSelected()).toBeTrue();
    expect(categoryFilter.updateUpdatedTime).toHaveBeenCalledTimes(2);
  });
});