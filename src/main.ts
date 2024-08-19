import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import {MatToolbarModule} from '@angular/material/toolbar';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
