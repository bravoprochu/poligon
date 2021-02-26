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
  appKey = environment.localStorageAppKey
    ? environment.localStorageAppKey
    : 'PoligonApp';
  storage = localStorage;
  storageData = {} as IStorageAppSettings;
  storageAppSettings = {} as IStorageAppSettings;

  constructor() {
    this.initStorage();
  }

  get(key: StorageAppSettingsKeys): StorageAppSettingsType {
    // if (this.storageData[key]) {
    //   return this.storageData[key]!;
    // }
    return this.storageData[key] ?? null;
  }

  set(
    itemKey: StorageAppSettingsKeys,
    itemValue: StorageAppSettingsType
  ): void {
    if (itemKey in this.storageData) {
      this.storageData[itemKey] = itemValue;
      this.saveStorage();
    }
  }

  remove(key: StorageAppSettingsKeys): void {
    if (key in this.storageData) {
      this.storageData[key] = null;
      this.saveStorage();
    }
  }

  clear(): void {
    this.storage.removeItem(this.appKey);
  }

  private initStorage(): void {
    const storageData = localStorage.getItem(this.appKey);
    if (storageData) {
      this.storageData = JSON.parse(storageData);
    }
  }

  private saveStorage(): void {
    localStorage.setItem(this.appKey, JSON.stringify(this.storageData));
  }
}
