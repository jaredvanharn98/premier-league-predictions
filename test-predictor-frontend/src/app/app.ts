import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';







import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import FormsModule and ReactiveFormsModule
import { HttpClient, HttpClientModule, provideHttpClient } from '@angular/common/http'; // Import HttpClientModule

import { AppRoutingModule } from './app.routes';

//import { AppComponent } from './app.component';
import { TestPredictionForm } from './test-prediction-form/test-prediction-form';

@NgModule({
  declarations: [
    
    //AppComponent,
    TestPredictionForm
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, // Add FormsModule
    ReactiveFormsModule, // Add ReactiveFormsModule (good for more complex forms)
    HttpClientModule // Add HttpClientModule
  ],
  providers: [provideHttpClient()],
  bootstrap: [/*AppComponent*/]
})

//export class App { }

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  protected readonly title = signal('test-predictor-frontend');
}