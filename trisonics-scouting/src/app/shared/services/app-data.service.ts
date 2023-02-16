/*
This is the main repository for data that has to be shared between components
in the application.

Services in Angular can be 'injected' into your components, or other code,
within their constructor.  Only one instance of this object will be created
within the entire appliation and then 'injected' into objects that need
access.  You should never try to manaully create an instance of this class
to access the data insted.  You will not be getting access to the shared
copies.

*/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ScoutResult } from 'src/app/shared/models/scout-result.model';
import { TBAEvent } from 'src/app/shared/models/tba-event.model';
import { TBATeam } from 'src/app/shared/models/tba-team.model';
import { OPRData } from 'src/app/shared/models/opr-data-model';
import { AppSettings } from 'src/app/shared/models/app-settings.model';
import * as _ from 'lodash';
import { PitResult } from '../models/pit-result.model';

@Injectable({
  providedIn: 'root',
})
export class AppDataService {
  /*
  Here we begin declaring some variables that can be used to store our general
  application status.

  We start with the data that we want to keep track of while scouting a
  match. We don't store this data in the actual component that displays and
  handles the button presses for scoring. If we did the application would
  lose state if the user navigated off it and had to come back. Storing it
  here allows us to keep in case that happens.

  We are also able to hook into changes to the data and force them to storage
  in the event that we need to reload the application entirely.
  */
  public autoCommunity = false;

  public match = '';

  public scoutingTeam = 0;

  public autoCubeHigh = 0;

  public autoCubeMedium = 0;

  public autoCubeLow = 0;

  public autoConeHigh = 0;

  public autoConeMedium = 0;

  public autoConeLow = 0;

  public teleopCubeHigh = 0;

  public teleopCubeMedium = 0;

  public teleopCubeLow = 0;

  public teleopConeHigh = 0;

  public teleopConeMedium = 0;

  public teleopConeLow = 0;

  public autoDocked = false;

  public autoEngaged = false;

  public endgameDock = false;

  public endgameEngaged = false;

  public endgameParked = false;

  public buddyBots = 0;

 
  public matchNotes = '';

  /*
  Here we create a list of drive trains that we will be able to select
  from later.
  */
  public driveTrainList: string[] = [
    'Tank (4 wheel)',
    'Tank (6 wheel)',
    'Tank (treads)',
    'Drop Center (6 wheel)',
    'Drop Center (8 wheel)',
    'Swerve',
    'H drive',
  ];

  /*
  TODO:
  This is a quick hack to avoid using TBA to load evey event and instead
  we just define ones the TriSonics are involved with.
  */
  public eventList: TBAEvent[] = [
    {
      eventKey: '2023mifor',
      eventName: 'Calvin (test)',
      eventDate: null,
    },
    {
      eventKey: '2023mista',
      eventName: 'Standish',
      eventDate: null,
    },
    {
      eventKey: '2023miwmi',
      eventName: 'GVSU',
      eventDate: null,
    },
    {
      eventKey: '2023micmp',
      eventName: 'States',
      eventDate: null,
    },
  ];

  /*
  This is a 'Dictionary' type object that maps an 'eventKey' property of
  the string type to a list of TBATeam objects. The list of teams doesn't
  change often per event so we just cache the data to prevent multiple
  lookups.
  */
  private _eventTeamsCache: { [eventKey: string]: TBATeam[] } = {};

  /*
  The _held variable are used to hold data that needs to tbe sent to the API
  for storage but hasn't yet.

  In the case that an event doesn't have data service on the match floor
  users can hold their data in this storage and a portion of the UI is
  dedicated to retying the upload of it.
  */
  private _heldScoutData: ScoutResult[] = [];

  private _heldPitData: PitResult[] = [];

  /*
  We use this to keep the name of the user
  */
  private _scouterName = '';

  /*
  Team Key is a secret key that is used to keep data to the collecting team.
  A bit of rework is needed in how this is handled and it's name through the
  code.
  */
  private _teamKey = '';

  /*
  A default event that is only set to this because it's a handy spot for testing
  */
  private _eventKey = '2023mifor';

  // Shorthand to prevent using the full name to the environment setting
  private baseUrl = environment.baseUrl;

  /*
  Now we create a series of getter and setter methods to access the private
  variables we declare above with the _ prefix. This lets the outside code
  work with them as if they were just public members but we can decide if an
  event is worth flushing to storage or not here, not at something in the UI
  layer.
  */
  public get scouterName(): string {
    return this._scouterName;
  }

  public set scouterName(v: string) {
    this._scouterName = v;
    // This is how we store data to storage in case we have to restart
    this.saveSettings();
  }

  public get teamKey(): string {
    return this._teamKey;
  }

  public set teamKey(v: string) {
    this._teamKey = v;
    this.saveSettings();
  }

  public get eventKey(): string {
    return this._eventKey;
  }

  public set eventKey(v: string) {
    this._eventKey = v;
    this.saveSettings();
  }

  public get eventName(): string {
    return (
      this.eventList.find((e) => e.eventKey === this._eventKey)?.eventName ?? ''
    );
  }

  constructor(private httpClient: HttpClient) {
    /*
    Only one instance of this object will ever be created, at startup, so
    this is where we load our data from disk as the app starts.
    */
    this.loadSettings();
  }

  /*
  There are a number of ways for an app to store data within a browser
  long term. We'll be using the simple key/value pair that 'LocalStorage'
  offers. To keep thing simple we'll store the data we're concerned with
  as JSON strings as the value of each key.

  JSON stands for JavaScript Object Notation and is a data transport/storage
  format that is a snippet of valid JavaScript code describes something.
  */
  private saveSettings(): void {
    const d: AppSettings = {
      scouterName: this.scouterName,
      secretKey: this.teamKey,
      eventKey: this.eventKey,
    };
    /*
    Yes the standard function is called 'stringify'. I didn't do anything
    weird to call it that.
    */
    localStorage.setItem('appSettings', JSON.stringify(d));
    localStorage.setItem(
      '_eventTeamsCache',
      JSON.stringify(this._eventTeamsCache),
    );
    localStorage.setItem('_heldScoutData', JSON.stringify(this._heldScoutData));
    localStorage.setItem('_heldPitData', JSON.stringify(this._heldPitData));
  }

  /*
  Here we load our JSON strings from LocalStorage for use but if nothing
  is found a default/blank value that the application will function with
  is passed back instead.
  */
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
    this._heldPitData = JSON.parse(pitDataJson).splice(0, 1);
  }

  /*
  Here we use the HTTP protocol to collect data from The Blue Aliance
  and cache the results for later use. If the results are already cached
  we use those and save the trouble of the HTTP call.

  The upper layer of the app can use a 'force' option to make it ignore the
  cache.
  */
  public getEventTeamList(
    eventKey: string,
    options?: { force?: boolean },
  ): Observable<TBATeam[]> {
    console.log('team list for', eventKey);
    const force = options?.force ?? false;
    if (
      !force &&
      this._eventTeamsCache[eventKey] &&
      this._eventTeamsCache[eventKey].length > 0
    ) {
      console.log('using cache');
      return of(this._eventTeamsCache[eventKey]);
    }
    console.log('using loookup');
    const url = `${this.baseUrl}/GetTeamsForEvent?event_key=${eventKey}`;
    return this.httpClient.get<TBATeam[]>(url).pipe(
      tap((teams) => {
        console.log('caching', teams);
        this._eventTeamsCache[eventKey] = teams;
        this.saveSettings();
      }),
    );
  }

  /*
  Inside the API there is a HelloWorld example and this show how we would
  call it from our service.
  */
  public getHelloWorld(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/HelloWorld`);
  }

  get heldScoutData(): ScoutResult[] {
    return this._heldScoutData;
  }

  get heldPitData(): PitResult[] {
    return this._heldPitData;
  }

  /*
  Here we store our match scouting results in a local memory cache (array)
  and then the app stores all settings/data again.
  */
  public cacheResults(payload: ScoutResult): void {
    this._heldScoutData.push(payload);
    this.saveSettings();
  }

  /*
  Here we remove a match (or multiple) from our local cache and then the app
  stores all settings/data again.
  */
  public unCacheResults(payload: ScoutResult): void {
    _.remove(this._heldScoutData, {
      event_key: payload.event_key,
      scouter_name: payload.scouter_name,
      scouting_team: payload.scouting_team,
    });
    this.saveSettings();
  }

  /*
  We repeat the same pattern here with the pit scouting data and the
  caching mechanism.
  */
  public cachePitResults(payload: PitResult): void {
    this._heldPitData.push(payload);
    this.saveSettings();
  }

  public unCachePitResults(payload: PitResult): void {
    _.remove(this._heldPitData, {
      event_key: payload.event_key,
      scouter_name: payload.scouter_name,
      scouting_team: payload.scouting_team,
    });
    this.saveSettings();
  }

  /*
  This method is used by the app to send the results of a scouting match
  to the API for storage in the cloud.
  */
  public postResults(payload: ScoutResult): Observable<ScoutResult> {
    /*
    The uncache and immediately recache was chosen because both methods
    existed and it works. If the event isn't alrady cached the uncache
    has no effect. If multiple entries were in there it removes them all.
    The cache operation is a simple pop onto an array.
    */
    this.unCacheResults(payload);
    this.cacheResults(payload);
    /*
    There's a lot to unpack on this one! We'll keep it high level though.
    We issue an HTTP to our API with this. When it returns our pipe() and
    tap() will trigger the running of the anonymous function we give it with
    an arrow (=>) definition. That function just calls the uncache method.

    The value of r in that function is the return of the HTTP call. We don't
    need to do anything with it here, but we could log it out to the console
    if we wanted.

    The result is also passed along via the Observable that we return from
    the httpClient as a general pattern.
    */
    return this.httpClient.post<ScoutResult>(`${this.baseUrl}/PostResults`, payload).pipe(
      tap((r) => {
        // console.log(r);
        this.unCacheResults(payload);
      }),
    );
  }

  public postPitResults(payload: any): Observable<any> {
    this.unCachePitResults(payload);
    this.cachePitResults(payload);
    return this.httpClient.post(`${this.baseUrl}/PostPitResults`, payload).pipe(
      tap((r) => {
        this.unCachePitResults(payload);
      }),
    );
  }

  public getResults(secretTeamKey: string): Observable<ScoutResult[]> {
    let url = `${this.baseUrl}/GetResults`;
    if (secretTeamKey) {
      url += `?secret_team_key=${secretTeamKey}`;
    }
    return this.httpClient.get<ScoutResult[]>(url);
  }

  public getPitResults(
    secretTeamKey: string,
    eventKey: string,
    teamKey: string,
  ): Observable<PitResult[]> {
    let url = `${this.baseUrl}/GetPitResults?param=none`;
    if (secretTeamKey) {
      url += `&secret_team_key=${secretTeamKey}`;
    }
    if (eventKey) {
      url += `&event_key=${eventKey}`;
    }
    if (teamKey) {
      url += `&team_key=${teamKey}`;
    }
    return this.httpClient.get<PitResult[]>(url);
  }

  public getOPRData(eventKey: string): Observable<OPRData[]> {
    const url = `${this.baseUrl}/GetOPRData?event_key=${eventKey}`;
    return this.httpClient.get<OPRData[]>(url);
  }
}

export default AppDataService;
