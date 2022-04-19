import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ScoutResult } from 'src/app/shared/models/scout-result.model';
import { TBAEvent } from 'src/app/shared/models/tba-event.model';
import { TBATeam } from 'src/app/shared/models/tba-team.model';
import { OPRData } from 'src/app/shared/models/opr-data-model';
import { AppSettings } from 'src/app/shared/models/app-settings.model';
import * as _ from 'lodash';
import { PitResult } from '../models/pit-result.model';

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
    'Tank (6 wheel)',
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
      eventKey: '2022micmp',
      eventName: 'States',
      eventDate: new Date(2022, 4, 13),
    },
    {
      eventKey: '2022micmp1',
      eventName: 'States - DTE',
      eventDate: new Date(2022, 4, 13),
    },
    {
      eventKey: '2022micmp2',
      eventName: 'States - Ford',
      eventDate: new Date(2022, 4, 13),
    },
    {
      eventKey: '2022micmp3',
      eventName: 'States - APTIV',
      eventDate: new Date(2022, 4, 13),
    },
    {
      eventKey: '2022micmp4',
      eventName: 'States - Consumers',
      eventDate: new Date(2022, 4, 13),
    },
  ];

  private _eventTeamsCache: { [eventKey: string]: TBATeam[] } = {};

  private _heldScoutData: ScoutResult[] = [];

  private _heldPitData: PitResult[] = [];

  private _scouterName: string = '';
  private _teamKey: string = '';
  private _eventKey: string = '2022miwmi';

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

  public get eventName(): string {
    return this.eventList.find(e => e.eventKey === this._eventKey)?.eventName ?? '';
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
    localStorage.setItem('_eventTeamsCache', JSON.stringify(this._eventTeamsCache));
    localStorage.setItem('_heldScoutData', JSON.stringify(this._heldScoutData));
    localStorage.setItem('_heldPitData', JSON.stringify(this._heldPitData));
  }

  private loadSettings(): void {
    const rawJson = localStorage.getItem('appSettings') ?? '{}';
    const d: AppSettings = JSON.parse(rawJson);
    this._scouterName = d.scouterName;
    this._eventKey = d.eventKey;
    this._teamKey = d.secretKey;
    const teamCacheJson = localStorage.getItem('_eventTeamsCache') ?? '[]';
    this._eventTeamsCache = JSON.parse(teamCacheJson);
    const scoutDataJson = localStorage.getItem('_heldScoutData') ?? '[]';
    this._heldScoutData = JSON.parse(scoutDataJson);
    const pitDataJson = localStorage.getItem('_heldPitData') ?? '[]';
    this._heldPitData = JSON.parse(pitDataJson);
  }

  public getEventTeamList(eventKey: string, options?: {force?: boolean}): Observable<TBATeam[]> {
    console.log('team list for', eventKey);
    const force = options?.force ?? false;
    if (!force && this._eventTeamsCache[eventKey] && this._eventTeamsCache[eventKey].length > 0) {
      console.log('using cache');
      return of(this._eventTeamsCache[eventKey]);
    }
    console.log('using loookup');
    let url = `${this.baseUrl}/GetTeamsForEvent?event_key=${eventKey}`;
    return this.httpClient.get<TBATeam[]>(url).pipe(tap((teams) => {
      console.log('caching', teams);
      this._eventTeamsCache[eventKey] = teams;
      this.saveSettings();
    }));
  }

  public getHelloWorld(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/HelloWorld`);
  }

  get heldScoutData(): ScoutResult[] {
    return this._heldScoutData;
  }

  get heldPitData(): PitResult[] {
    return this._heldPitData;
  }

  public cacheResults(payload: ScoutResult): void {
    this._heldScoutData.push(payload);
    this.saveSettings();
  }

  public unCacheResults(payload: ScoutResult): void {
    _.remove(this._heldScoutData,
      { event_key: payload.event_key,
        scouter_name: payload.scouter_name,
        scouting_team: payload.scouting_team,
      })
    this.saveSettings();
  }

  public cachePitResults(payload: PitResult): void {
    this._heldPitData.push(payload);
    this.saveSettings();
  }

  public unCachePitResults(payload: PitResult): void {
    _.remove(this._heldPitData,
      { event_key: payload.event_key,
        match_key: payload.match_key,
        scouter_name: payload.scouter_name,
        scouting_team: payload.scouting_team,
      })
    this.saveSettings();
  }

  public postResults(payload: any): Observable<any> {
    this.unCacheResults(payload);
    this.cacheResults(payload);
    return this.httpClient.post(`${this.baseUrl}/PostResults`, payload).pipe(tap((r) => {
      this.unCacheResults(payload);
    }));
  }

  public postPitResults(payload: any): Observable<any> {
    this.unCachePitResults(payload);
    this.cachePitResults(payload);
    return this.httpClient.post(`${this.baseUrl}/PostPitResults`, payload).pipe(tap((r) => {
      this.unCachePitResults(payload);
    }));
  }

  public getResults(secretTeamKey: string): Observable<ScoutResult[]> {
    let url = `${this.baseUrl}/GetResults`;
    if (secretTeamKey)  {
      url += `?secret_team_key=${secretTeamKey}`;
    }
    return this.httpClient.get<ScoutResult[]>(url);
  }

  public getPitResults(secretTeamKey: string, eventKey: string, teamKey: string): Observable<PitResult[]> {
    let url = `${this.baseUrl}/GetPitResults?param=none`;
    if (secretTeamKey)  {
      url += `&secret_team_key=${secretTeamKey}`;
    }
    if (eventKey)  {
      url += `&event_key=${eventKey}`;
    }
    if (teamKey)  {
      url += `&team_key=${teamKey}`;
    }
    return this.httpClient.get<PitResult[]>(url);
  }

  public getOPRData(eventKey: string): Observable<OPRData[]> {
    let url = `${this.baseUrl}/GetOPRData?event_key=${eventKey}`;
    return this.httpClient.get<OPRData[]>(url);
  }
}
