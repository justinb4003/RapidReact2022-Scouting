import { DATE_PIPE_DEFAULT_TIMEZONE } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, take, interval, Observable, firstValueFrom } from 'rxjs';
import { TimeEntry } from 'src/app/shared/models/time-entry.model';
import { AppDataService } from 'src/app/shared/services/app-data.service';
import { TimeDataService } from 'src/app/shared/services/time-data.service';
import { v4 as uuidv4 } from 'uuid';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { ScoutDetailComponent } from '../dialogs/scout-detail/scout-detail.component';
import { TimeDetailsComponent } from '../dialogs/time-details/time-details.component';
import { GeolocationService } from '@ng-web-apis/geolocation';

@Component({
  selector: 'app-time-keeper',
  templateUrl: './time-keeper.component.html',
  styleUrls: ['./time-keeper.component.scss']
})
export class TimeKeeperComponent implements OnInit, OnDestroy {

  public dataLoaded: boolean = false;

  public statusIn: boolean = false;

  public timeEntries: TimeEntry[] = [];
  
  public currentUUID: string = '';

  public timeElapsed: string = '';
  
  private displaySubscription!: Subscription;

  constructor(
    public appData: AppDataService,
    public timeData: TimeDataService,
    public dialog: MatDialog,
    public geolocation: GeolocationService,
  ) { }

  ngOnInit(): void {
    this.displaySubscription = interval(2500).subscribe((x) => {
      this.setTimeElapsed();
    });
    this.timeData.getTimeEntries(this.appData.scouterName, this.appData.teamKey).subscribe((tel) => {
      this.timeEntries = tel;
      // JJB: Bad hack here for fixing Date handing in JSON
      this.timeEntries.forEach((te) => {
        if (typeof te.in_datetime === 'string') {
          te.in_datetime = new Date(te.in_datetime);
        }
        if (typeof te.out_datetime === 'string') {
          te.out_datetime = new Date(te.out_datetime);
        }
      });
      // console.log(this.timeEntries);
      this.dataLoaded = true;
      // find most recent, and if it is current enough
      const newestFirst = _.orderBy(this.timeEntries, ['in_datetime'], ['desc']);
      if (newestFirst.length > 0 && newestFirst[0].out_datetime == null && this.recentEnough(newestFirst[0].in_datetime)) {
        // set itid to the active currentUUID value.
        this.currentUUID = newestFirst[0].id;
        this.statusIn = true;
      }
    });
  }

  ngOnDestroy(): void {
    this.displaySubscription.unsubscribe();
  }

  public recentEnough(ts: Date): boolean {

    return true;
  }

  public async processToggle(): Promise<void> {
    this.geolocation.pipe(take(1)).subscribe(async (pos) => {
      if (this.statusIn) {
        this.currentUUID = uuidv4();
        const te: TimeEntry = {
          id: this.currentUUID,
          in_datetime: new Date(),
          in_lat: pos.coords.latitude,
          in_lng: pos.coords.longitude,
          out_datetime: null,
          out_lat: null,
          out_lng: null,
          account_name: this.appData.scouterName,
          secret_team_key: this.appData.teamKey,
          notes: null,
          subteams: null,
        };
        this.timeEntries.push(te);
        await firstValueFrom(this.timeData.postTimeEntry(te));
      } else {
        var te = this.timeEntries.find((te) => te.id === this.currentUUID);
        if (te) {
          te.out_datetime = new Date();
          te.out_lat = pos.coords.latitude;
          te.out_lng = pos.coords.longitude;
          await firstValueFrom(this.timeData.postTimeEntry(te));
          const dref = this.dialog.open(TimeDetailsComponent, {
            height: '75vh',
            width: '100%',
            data: te,
          });
          dref.afterClosed().subscribe(async () => {
            await firstValueFrom(this.timeData.postTimeEntry(te));
          });
        }
      }
    });
  }

  get statusText(): string {
    return this.statusIn ? 'In' : 'Out';
  }

  get timeEntriesReversed(): TimeEntry[] {
    return _.orderBy(this.timeEntries, ['in_datetime'], ['desc']);
  }

  get currentTimeEntry(): TimeEntry | null {
    var te = this.timeEntries.find((te) => te.id === this.currentUUID);
    if (!te) {
      return null;
    }
    return te;
  }

  public formatDuration(te: TimeEntry): string {
    if (te.out_datetime == null) {
      return '';
    }
    const elapsed = (te.out_datetime.getTime() - te.in_datetime.getTime()) / 1000;
    const hours = Math.floor(elapsed / 3600);
    const minutes = Math.floor( (elapsed-(hours*3600)) / 60 );
    return String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0');
  }

  public setTimeElapsed(): void {
    if (this.statusIn === false || this.currentTimeEntry == null) {
      this.timeElapsed = '';
      return;
    }
    // TODO: Improve date to string handling
    const now = new Date().getTime();
    const inms = this.currentTimeEntry.in_datetime.getTime();
    const elapsed = (now - inms) / 1000;
    const hours = Math.floor(elapsed / 3600);
    const minutes = Math.floor( (elapsed-(hours*3600)) / 60 );
    this.timeElapsed = String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0');
  }

  public formatIntime(in_datetime: Date): string {
    // console.log('formattingin time', in_datetime);
    // return in_datetime.toString();
    return in_datetime.toLocaleDateString('en-us',
      {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      })
  }
  
  public formatOuttime(out_datetime: Date | null): string {
    if (out_datetime == null) {
      return '';
    } else {
      // console.log(out_datetime, typeof out_datetime);
      return out_datetime.toLocaleTimeString('en-us',
        {
          hour: 'numeric',
          minute: 'numeric',
        });
    }
  }
}
