import 'zone.js';  // Required for Angular
import './polyfills';  // Import polyfills

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent)
  .catch(err => console.error(err));
