import { DATE_PIPE_DEFAULT_TIMEZONE } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { TimeEntry } from 'src/app/shared/models/time-entry.model';
import { AppDataService } from 'src/app/shared/services/app-data.service';
import { TimeDataService } from 'src/app/shared/services/time-data.service';
import { v4 as uuidv4 } from 'uuid';
import * as _ from 'lodash';

@Component({
  selector: 'app-time-keeper',
  templateUrl: './time-keeper.component.html',
  styleUrls: ['./time-keeper.component.scss']
})
export class TimeKeeperComponent implements OnInit, OnDestroy {

  public statusIn: boolean = false;

  public timeEntries: TimeEntry[] = [];
  
  public currentUUID: string = '';

  public timeElapsed: string = '';
  
  private displaySubscription: Subscription;

  constructor(
    public appData: AppDataService,
    public timeData: TimeDataService,
  ) { }

  ngOnInit(): void {
    this.displaySubscription = interval(250).subscribe((x) => {
      this.setTimeElapsed();
    });
    // TOOD: Pull all existing entries from Cosmos
    // find most recent, and if it is current enough
    // set itid to the active currentUUID value.
  }

  ngOnDestroy(): void {
    this.displaySubscription.unsubscribe();
  }

  public processToggle(): void {
    if (this.statusIn) {
      this.currentUUID = uuidv4();
      const te: TimeEntry = {
        id: this.currentUUID,
        in_datetime: new Date(),
        in_lat: 0,
        in_lng: 0,
        out_datetime: null,
        out_lat: null,
        out_lng: null,
        account_name: this.appData.scouterName,
        secret_team_key: this.appData.teamKey,
        notes: 'trial run',
      };
      // TODO: Push this to Cosmos
      this.timeEntries.push(te);
    } else {
      var te = this.timeEntries.find((te) => te.id === this.currentUUID);
      if (te) {
        te.out_datetime = new Date();
        // TODO: Push this to Cosmos
      }

    }
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
    const elapsed = te.out_datetime.getTime() - te.in_datetime.getTime();
    return new Date(elapsed).toISOString().slice(11, -1);
  }

  public setTimeElapsed(): void {
    if (this.statusIn === false || this.currentTimeEntry == null) {
      this.timeElapsed = '';
      return;
    }
    // TODO: Improve date to string handling
    const now = new Date().getTime();
    const inms = this.currentTimeEntry.in_datetime.getTime();
    const elapsed = now - inms;
    console.log(now, inms);
    console.log(elapsed);
    this.timeElapsed = new Date(elapsed).toISOString().slice(11, -1);
  }

  public formatIntime(in_datetime: Date): string {
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
    }
    return out_datetime.toLocaleTimeString('en-us',
      {
        hour: 'numeric',
        minute: 'numeric',
      });
  }

}
