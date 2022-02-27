import {Injectable} from '@angular/core';
import {StorageService} from '../storage/storage.service';
import {Collection} from '../../interfaces/collection';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {

  private activeCollection: Collection;

  constructor(private storageService: StorageService) {
  }

  public async getActiveCollection(): Promise<Collection> {
    if (this.activeCollection) {
      return this.activeCollection;
    }

    const collections: Collection[] = await this.getCollections();
    const collection = collections.find((c: Collection) => c.active && c.status);
    if (!collection) {
      console.error('No active collection found!');
    } else {
      this.activeCollection = collection;
    }
    return this.activeCollection;
  }

  public async setActiveCollection(id: number): Promise<Collection> {
    const collections: Collection[] = await this.getCollections();
    let found;
    const filtered = collections.map((c) => {
      c.active = false;
      if (c.id === id && c.status) {
        c.active = true;
        found = c;
      }
      return c;
    });
    if (!found) {
      console.error('Could not find collection');
      return;
    }
    this.activeCollection = found;
    await this.storageService.set('collections', filtered);
    return this.activeCollection;
  }


  public async addCollection(collection: Collection): Promise<Collection> {
    const collections = await this.getCollections();
    collection.id = await this.getNextFreeID();
    collections.push(collection);
    await this.storageService.set('collections', collections);
    return collection;
  }

  public async removeCollection(id: number): Promise<void> {
    const collections = await this.getCollections();
    const updatedCollections = collections.map(c => {
      if (c.id === id) {
        if (c.active) {
          c.active = false;
          this.activeCollection = collections.find(x => x.status);
        }
        c.status = false;
      }
      return c;
    });
    await this.storageService.set('collections', updatedCollections);
  }

  public async getCollections(): Promise<Collection[]> {
    return this.storageService.get('collections');
  }

  public async getCollectionById(id: number) {
    const collections = await this.getCollections();
    return collections.find(c => c.id === id && c.status);
  }

  public async updateCollectionById(id: number, collection: Collection): Promise<void> {
    const collections = await this.getCollections();
    const editedCollections = collections.map(c => {
      if (c.id === id) {
        c.language.name = collection.language.name;
        c.language.prefix = collection.language.prefix;
        c.language.icon = collection.language.icon;
        c.updatedAt = new Date().getTime();
        c.status = true;
      }
      return c;
    });
    await this.storageService.set('collections', editedCollections);
  }

  private async getNextFreeID(): Promise<number> {
    return this.storageService.getNextFreeId('collections');
  }
}
