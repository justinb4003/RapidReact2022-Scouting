import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
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
}
