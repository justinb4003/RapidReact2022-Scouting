import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { TimeEntry } from 'src/app/shared/models/time-entry.model';

@Injectable({
  providedIn: 'root'
})
export class TimeDataService {
  private baseUrl = environment.baseUrl;

  public userTimeData: TimeEntry[] = [];

  constructor(
    private httpClient: HttpClient
  ) { }
  
  public postTimeEntry(payload: any): Observable<any> {
    console.error(payload);
    return this.httpClient.post(`${this.baseUrl}/PostTimeEntry`, payload);
  }

  public getTimeEntries(accountName: string, secretTeamKey: string): Observable<TimeEntry[]> {
    return this.httpClient.get<TimeEntry[]>(
      `${this.baseUrl}/GetTimeEntries?account_name=${accountName}&secret_team_key=${secretTeamKey}`);
  } 
}
