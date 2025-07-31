//import { Routes } from '@angular/router';

//export const routes: Routes = [];



import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestPredictionForm } from './test-prediction-form/test-prediction-form';

const routes: Routes = [
  { path: '', component: TestPredictionForm }, // Default route
  // { path: 'view-predictions', component: ViewPredictionsComponent }, // If you add more pages
  { path: '**', redirectTo: '' } // Redirect to home for any unknown routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
