import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestPrediction {
  private apiUrl = 'http://127.0.0.1:5000'; // Your Flask backend URL

  constructor(private http: HttpClient) { }

  submitPrediction(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/submit_prediction`, data);
  }
}
