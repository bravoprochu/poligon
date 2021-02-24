// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  coinApiIoUrl: 'https://rest-sandbox.coinapi.io/',
  coinApiIoWebsocketUrl: 'wss://ws-sandbox.coinapi.io/v1/',
  coinApiIoKey: 'CB32E10F-F1F4-44B8-889D-0EE0ABBF6959',
  isRealServerData: false,
  identTokenUrl: 'https://localhost:5001/token',
  identRegisterUserUrl: 'https://localhost:5001/account/register',
  bpApiDataUrl: 'https://localhost:5001/api',
  httpRequestRetry: 1,
  httpRequestRetryDelay: 2000,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
