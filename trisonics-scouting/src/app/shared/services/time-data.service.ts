import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, tap } from 'rxjs';
import * as _ from 'lodash';
import { TimeEntry } from 'src/app/shared/models/time-entry.model';

@Injectable({
  providedIn: 'root',
})
export class TimeDataService {
  private baseUrl = environment.baseUrl;

  public userTimeData: TimeEntry[] = [];

  private _heldTimeData: TimeEntry[] = [];

  constructor(
    private httpClient: HttpClient,
  ) {
    this.loadData();
  }

  private loadData(): void {
    const timeDataJson = localStorage.getItem('_heldTimeData') ?? '[]';
    this._heldTimeData = JSON.parse(timeDataJson);
  }

  public postTimeEntry(payload: any): Observable<any> {
    this.unCacheResults(payload);
    this.cacheResults(payload);
    return this.httpClient.post(`${this.baseUrl}/PostTimeEntry`, payload)
      .pipe(tap((r) => {
        this.unCacheResults(payload);
      }));
  }

  public getTimeEntries(accountName: string, secretTeamKey: string): Observable<TimeEntry[]> {
    return this.httpClient.get<TimeEntry[]>(
      `${this.baseUrl}/GetTimeEntries?account_name=${accountName}&secret_team_key=${secretTeamKey}`,
    );
  }

  public cacheResults(payload: TimeEntry): void {
    this._heldTimeData.push(payload);
    this.saveData();
  }

  public unCacheResults(payload: TimeEntry): void {
    _.remove(this._heldTimeData, { id: payload.id });
    this.saveData();
  }

  public saveData(): void {
    localStorage.setItem('_heldTimeData', JSON.stringify(this._heldTimeData));
  }

  get heldData(): TimeEntry[] {
    return this._heldTimeData;
  }
}

export default TimeDataService;
