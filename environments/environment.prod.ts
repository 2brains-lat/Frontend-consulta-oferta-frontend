// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// export const environment = {
//   production: false,
//   acc_config: {
//     production: true,
//     authority:
//       'https://login.microsoftonline.com/3055fa7f-a944-4927-801e-a62b63119e43/',
//     redirectUri: 'http://localhost:8080/v1/oauth/login',
//     clientId: '4549da26-a82c-4efc-9304-9091ae85bee0',
//   },
//   id_groups: {
//     ventas: '5354636b-e586-49a9-90e4-6a4fdac74a1d',
//     marketing: '453ef61d-e311-4523-9766-23b872096014',
//     admin: '42ef474a-2835-47a1-8440-c60ce98e0cb1',
//     superAdmin: '99135842-23b9-4d2d-a1b1-731e4b532f1c',
//     backOffice: '264a787c-8a0e-4e40-b289-fd9f93ddc6e0'
//   },
//   graph_endpoint: 'https://graph.microsoft.com/v1.0/me',
//   apigateway_url:
//     // 'http://k8s-appconsultadevext-6c88653ad9-1203189217.eu-west-1.elb.amazonaws.com',
//   //   'http://k8s-appconsultadevext-6c88653ad9-1203189217.eu-west-1.elb.amazonaws.com',
//   // 'https://41y3chm6c9.execute-api.eu-west-1.amazonaws.com/v1',
//   // 'https://vcddi56377.execute-api.eu-west-1.amazonaws.com/v2',
//   'https://g1qmxrc47e.execute-api.eu-west-1.amazonaws.com/v1',  // prod
//   // 'http://localhost:8081',

//   form: {
//     prospecto_rp: '{"verisureId": "RP", "requiredStatus": false }',
//     prospecto_re: '{"verisureId":"RE", "requiredStatus":true}',
//     rango_rut: 50000000,
//     id_segmento_residencia: 'Residencial',
//   },
//   reporteria_url:
//     'https://app.powerbi.com/reportEmbed?reportId=266af76d-3f7e-4cad-b821-0c4c32f776e0&autoAuth=true&ctid=3055fa7f-a944-4927-801e-a62b63119e43',
//   app_version: '1.1.0',
// };

export const environment = {
  production: true,
  acc_config: {
    production: true,
    authority: 'https://login.microsoftonline.com/' + 'AWS_VAR_TENANT_ID' + '/',
    redirectUri: 'AWS_VAR_BASE_FRONT_URL' + '/v1/oauth/login',
    clientId: 'AWS_VAR_CLIENT_ID',
  },
  graph_endpoint: 'AWS_VAR_GRAPH_ENDPOINT',
  apigateway_url: 'AWS_VAR_APIGATEWAY_URL',
  id_groups: {
    ventas: 'AWS_VAR_ID_GROUPS_VENTAS',
    marketing: 'AWS_VAR_ID_GROUPS_MARKETING',
    admin: 'AWS_VAR_ID_GROUPS_ADMIN',
    superAdmin: 'AWS_VAR_ID_GROUPS_SUPERADMIN',
    backOffice: 'AWS_VAR_ID_GROUPS_BACKOFFICE'
  },
  form: {
    prospecto_rp:
      '{"verisureId": "PROSP_RP_ID", "requiredStatus": PROSP_RP_STATUS }',
    prospecto_re:
      '{"verisureId":"PROSP_RE_ID", "requiredStatus":PROSP_RE_STATUS}',
    rango_rut: 'RANGO_RUT',
    id_segmento_residencia: 'SEG_RESIDENCIA',
  },

  reporteria_url: 'REPORTERIA_URL',
  app_version: '1.2.0',
};
// export const environment = {
//   production: false,
//   acc_config: {
//     production: false,
//     authority:
//       'https://login.microsoftonline.com/3055fa7f-a944-4927-801e-a62b63119e43/',
//     redirectUri: 'http://localhost:8080/v1/oauth/login',
//     clientId: '4549da26-a82c-4efc-9304-9091ae85bee0',
//   },
//   id_groups: {
//     ventas: '5354636b-e586-49a9-90e4-6a4fdac74a1d',
//     marketing: '453ef61d-e311-4523-9766-23b872096014',
//     admin: '42ef474a-2835-47a1-8440-c60ce98e0cb1',
//     superAdmin: '99135842-23b9-4d2d-a1b1-731e4b532f1c',
//     backOffice: '264a787c-8a0e-4e40-b289-fd9f93ddc6e0',
//   },
//   graph_endpoint: 'https://graph.microsoft.com/v1.0/me',
//   apigateway_url: 'https://vcddi56377.execute-api.eu-west-1.amazonaws.com/v2',
//   form: {
//     prospecto_rp: '{"verisureId": "RP", "requiredStatus": false }',
//     prospecto_re: '{"verisureId":"RE", "requiredStatus":true}',
//     rango_rut: 50000000,
//     id_segmento_residencia: 'Residencial',
//   },
//   reporteria_url:
//     'https://app.powerbi.com/reportEmbed?reportId=266af76d-3f7e-4cad-b821-0c4c32f776e0&autoAuth=true&ctid=3055fa7f-a944-4927-801e-a62b63119e43',
//   app_version: '0.4.test',
// };

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
