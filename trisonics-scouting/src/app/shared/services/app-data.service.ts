import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ScoutResult } from 'src/app/shared/models/scout-result.model';
import { OPRData } from 'src/app/shared/models/opr-data-model';

@Injectable({
  providedIn: 'root'
})
export class AppDataService {
  public autoTarmac: boolean = false;
  public scouterName: string = '';
  public teamKey: string = '';
  public eventKey: string = 'test';
  public match: string = '';
  public scoutingTeam: number = 0;
  public autoHighGoal: number = 0;
  public autoHighGoalmiss: number = 0;
  public autoLowGoal: number = 0;
  public autoLowGoalmiss: number = 0;
  public humanGoals: number = 0;

  public teleopHighGoal: number = 0;
  public teleopHighGoalmiss: number = 0;
  public teleopLowGoal: number = 0;
  public teleopLowGoalmiss: number = 0;
  public finalHangPos: number = 0;

  public matchNotes: string = '';

  private baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) { }

  public getHelloWorld(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/HelloWorld`);
  }

  public postResults(payload: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/PostResults`, payload);
  }

  public getResults(secretTeamKey: string): Observable<ScoutResult[]> {
    let url = `${this.baseUrl}/GetResults`;
    if (secretTeamKey)  {
      url += `?secret_team_key=${secretTeamKey}`;
    }
    return this.httpClient.get<ScoutResult[]>(url);
  }

  public getOPRData(eventKey: string): Observable<OPRData[]> {
    let url = `${this.baseUrl}/GetOPRData?event_key=${eventKey}`;
    return this.httpClient.get<OPRData[]>(url);
  }
}
