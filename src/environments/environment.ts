// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  SERVER_URL: `./`,
  apiUrl: `http://kefu.ssl.digital/`,
  socketHost: `http://kefu.ssl.digital:6001/`,
  widgetHost: `http://kefu.ssl.digital:5000/`,
  production: false,
  useHash: false,
  hmr: false,
  version: require('../../package.json').version,
  notificationKey: 'BABHGEaUywW5fuU4TyEE_0Qx9s4uHcpuwgbvJaXCe5EO6sP0jh_qT24cuRAr7Rmndz2mULSYuRb_lWMlElr1d_Y',
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
