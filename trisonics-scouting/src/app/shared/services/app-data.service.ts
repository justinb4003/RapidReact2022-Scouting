import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ScoutResult } from 'src/app/shared/models/scout-result.model';
import { TBAEvent } from 'src/app/shared/models/tba-event.model';
import { TBATeam } from 'src/app/shared/models/tba-team.model';
import { OPRData } from 'src/app/shared/models/opr-data-model';
import { AppSettings } from 'src/app/shared/models/app-settings.model';
import * as _ from 'lodash';
import { PitResult } from '../models/pit-result.model copy';

@Injectable({
  providedIn: 'root'
})
export class AppDataService {
  public autoTarmac: boolean = false;
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

  public driveTrainList: string[] = [
    'Tank (4 wheel)',
    'Tank (treads)',
    'Drop Center (6 wheel)',
    'Drop Center (8 wheel)',
    'Swerve',
    'H drive',
  ];

  public eventList: TBAEvent[] = [
    {
      eventKey: '2022mifor',
      eventName: 'Calvin (test)',
      eventDate: null,
    },
    {
      eventKey: '2022misjo',
      eventName: 'St. Joe',
      eventDate: new Date(2022, 3, 9),
    },
    {
      eventKey: '2022miwmi',
      eventName: 'GVSU',
      eventDate: new Date(2022, 3, 25),
    },
    {
      eventKey: '2022mist', // TODO: Get the right code
      eventName: 'States',
      eventDate: new Date(2022, 4, 13),
    },
  ];

  private _scouterName: string = '';
  private _teamKey: string = '';
  private _eventKey: string = '2022misjo';

  private baseUrl = environment.baseUrl;

  public get scouterName(): string {
    return this._scouterName;
  }

  public get teamKey(): string {
    return this._teamKey;
  }

  public get eventKey(): string {
    return this._eventKey;
  }

  public set scouterName(v: string) {
    this._scouterName = v;
    this.saveSettings();
  }

  public set teamKey(v: string) {
    this._teamKey = v;
    this.saveSettings();
  }

  public set eventKey(v: string) {
    this._eventKey = v;
    this.saveSettings();
  }

  constructor(private httpClient: HttpClient) {
    this.loadSettings();
  }

  private saveSettings(): void {
    const d: AppSettings = {
      scouterName: this.scouterName,
      secretKey: this.teamKey,
      eventKey: this.eventKey,
    };
    localStorage.setItem('appSettings', JSON.stringify(d));
  }

  private loadSettings(): void {
    const rawJson = localStorage.getItem('appSettings') ?? '{}';
    const d: AppSettings = JSON.parse(rawJson);
    this.scouterName = d.scouterName;
    this.eventKey = d.eventKey;
    this.teamKey = d.secretKey;
  }

  public getEventTeamList(eventKey: string): Observable<TBATeam[]> {
    let url = `${this.baseUrl}/GetTeamsForEvent?event_key=${eventKey}`;
    return this.httpClient.get<TBATeam[]>(url);
  }

  public getHelloWorld(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/HelloWorld`);
  }

  public postResults(payload: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/PostResults`, payload);
  }

  public postPitResults(payload: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/PostPitResults`, payload);
  }

  public getResults(secretTeamKey: string): Observable<ScoutResult[]> {
    let url = `${this.baseUrl}/GetResults`;
    if (secretTeamKey)  {
      url += `?secret_team_key=${secretTeamKey}`;
    }
    return this.httpClient.get<ScoutResult[]>(url);
  }

  public getPitResults(secretTeamKey: string): Observable<PitResult[]> {
    let url = `${this.baseUrl}/GetPitResults`;
    if (secretTeamKey)  {
      url += `?secret_team_key=${secretTeamKey}`;
    }
    return this.httpClient.get<PitResult[]>(url);
  }

  public getOPRData(eventKey: string): Observable<OPRData[]> {
    let url = `${this.baseUrl}/GetOPRData?event_key=${eventKey}`;
    return this.httpClient.get<OPRData[]>(url);
  }

}
