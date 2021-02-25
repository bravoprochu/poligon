import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  IStorageAppSettings,
  StorageAppSettingsKeys,
  StorageAppSettingsType as StorageAppSettingsType,
} from '../interfaces/i-storage-app-settings';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {
    this.initStorage();
  }

  appKey = environment.localStorageAppKey
    ? environment.localStorageAppKey
    : 'PoligonApp';
  storage = localStorage;
  storageData = {} as IStorageAppSettings;
  storageAppSettings = {} as IStorageAppSettings;

  private initStorage(): void {
    const storageData = localStorage.getItem(this.appKey);
    if (storageData) {
      this.storageData = JSON.parse(storageData);
    }
  }

  get(key: StorageAppSettingsKeys): StorageAppSettingsType {
    if (this.storageData[key]) {
      return this.storageData[key]!;
    }
    return null;
  }

  set(key: StorageAppSettingsKeys, value: StorageAppSettingsType) {
    this.storageData[key] = value!;
    this.saveStorage();
  }

  remove(key: StorageAppSettingsKeys): void {
    this.storageData[key] = null;
    this.saveStorage();
  }

  clear(): void {
    this.storage.removeItem(this.appKey);
  }

  private saveStorage(): void {
    localStorage.setItem(this.appKey, JSON.stringify(this.storageData));
  }
}
