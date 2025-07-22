/* eslint-disable @typescript-eslint/no-empty-function */
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from 'environments/environment';
if (environment.production) {
  console.log('PRODUCTION MODE ON ');
  console.log = () => {};
  console.error = () => {};
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
