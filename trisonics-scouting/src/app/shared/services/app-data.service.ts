import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { getMatIconFailedToSanitizeUrlError } from '@angular/material/icon';

@Injectable({
  providedIn: 'root'
})
export class AppDataService {
  public humanGoals: number = 0;

  public autoTarmac: boolean = false;

  public autoHighGoal: number = 0;

  public autoLowGoal: number = 0;

  private baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) { }

  public getHelloWorld(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/HelloWorld`);
  }

  public postResults(payload: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/PostResults`, payload);
  }
}
