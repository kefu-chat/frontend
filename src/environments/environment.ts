// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  SERVER_URL: `./`,
  // apiUrl: `http://localhost/`,
  apiUrl: `http://dev.fastsupport.cn/`,
  socketHost: `http://dev.fastsupport.cn:6001/`,
  production: false,
  useHash: false,
  hmr: false,
  notificationKey: 'BGW7v-IuLKu7Evhb9Fkgt3aoUH2wzuQ1iYEEWam4AddeZqiOYuRYc4zsrq4odBJXpkKr8Wu9u7OtA4poqjpH_3M',
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
