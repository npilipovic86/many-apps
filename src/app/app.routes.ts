import {Routes} from '@angular/router';
import {Homepage} from './features/homepage/homepage';
import {CalculatorComponent} from './features/calculator/calculator';
import {WeatherComponent} from './features/weather/weather';

export const routes: Routes = [
  {path: '', component: Homepage},
  {path: 'calculator', component: CalculatorComponent},
  {path: 'weather', component: WeatherComponent},
  {path: '**', redirectTo: ''}
];
