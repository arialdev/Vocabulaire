import {Component, OnInit} from '@angular/core';
import {AbstractStorageService} from './services/storage/abstract-storage-service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public appPages = [
    {title: 'Inbox', url: '/folder/Inbox', icon: 'mail'},
    {title: 'Outbox', url: '/folder/Outbox', icon: 'paper-plane'},
    {title: 'Favorites', url: '/folder/Favorites', icon: 'heart'},
    {title: 'Archived', url: '/folder/Archived', icon: 'archive'},
    {title: 'Trash', url: '/folder/Trash', icon: 'trash'},
    {title: 'Spam', url: '/folder/Spam', icon: 'warning'},
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  constructor(private storageService: AbstractStorageService, private translateService: TranslateService) {
  }

  async ngOnInit(): Promise<void> {
    this.translateService.setDefaultLang('es');
    await this.loadTheme();
  }

  private async loadTheme() {
    const settings = await this.storageService.get('settings');
    if (settings.darkMode) {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.setAttribute('data-theme', 'light');
    }
  }
}
