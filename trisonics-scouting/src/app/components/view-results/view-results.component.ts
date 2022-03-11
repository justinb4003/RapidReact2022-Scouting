import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AppDataService } from 'src/app/shared/services/app-data.service';
import { ScoutResult } from 'src/app/shared/models/scout-result.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as _ from 'lodash';
import { _MatSlideToggleRequiredValidatorModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-view-results',
  templateUrl: './view-results.component.html',
  styleUrls: ['./view-results.component.scss']
})
export class ViewResultsComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;

  public htmlData: string = '';
  public fullScoutData: ScoutResult[] = [];
  public scoutData = new MatTableDataSource<ScoutResult>();
  public pageReady: boolean = false;

  public allColumns = [
    'scouting_team',
    'auton_tarmac',
    'auton_human_player',
    'auton_high_goals',
    'auton_low_goals',
    'auton_high_miss',
    'auton_low_miss',
    'teleop_high_goals',
    'teleop_low_goals',
    'teleop_high_miss',
    'teleop_low_miss',
    'final_hang_pos',
    'event_key',
    'match_key',
    'scouter_name',
    'match_notes',
  ];

  public displayedColumns: string[] = [];

  public oprColumns: any[] = [];
  public oprData: any[] = [];

  public fgSearch: FormGroup = new FormGroup({
    teamKey: new FormControl(this.appData.teamKey),
    eventKey: new FormControl('2022misjo'),
    displayAuton: new FormControl(true),
    displayTeleop: new FormControl(true),
    displayEndGame: new FormControl(true),
    displayOPR: new FormControl(true),
    displayNotes: new FormControl(true),
    displaySummary: new FormControl(false),
  });

  constructor(
    public appData: AppDataService,
  ) { }

  ngOnInit(): void {
    this.setDisplayColumns();
  }

  ngAfterViewInit(): void {
    this.scoutData.sort = this.sort;
    this.fgSearch.valueChanges.subscribe((x) => {
      this.setDisplayColumns();
      this.filterData();
    });
  }

  public setDisplayColumns(): void {
    console.log('change');
    this.displayedColumns = this.allColumns;
    if (this.fgSearch.value.disoplayOPR) {
      this.displayedColumns = this.displayedColumns.concat(this.oprColumns);
    }
    if (!this.fgSearch.value.displayAuton) {
      this.displayedColumns = this.displayedColumns.filter((x) => !(x.startsWith('auton')));
    }
    if (!this.fgSearch.value.displayTeleop) {
      this.displayedColumns = this.displayedColumns.filter((x) => !(x.startsWith('teleop')));
    }
    if (!this.fgSearch.value.displayEndGame) {
      this.displayedColumns = this.displayedColumns.filter((x) => x !== 'final_hang_pos');
    }
    if (!this.fgSearch.value.displayNotes) {
      this.displayedColumns = this.displayedColumns.filter((x) => x !== 'match_notes');
    }
  }

  public filterData(): void {
    const eventKey = this.fgSearch.value.eventKey;
    const summary = this.fgSearch.value.displaySummary;
    if (eventKey) {
      const data = this.fullScoutData.filter((x) => x.event_key === eventKey);
      this.scoutData.data = data;
    } else {
      this.scoutData.data = this.fullScoutData;
    }

    // Check summation now
    if (summary) {
      var output =
    _(this.scoutData.data).groupBy('scouting_team')
      .map((objs, key) => ({
          'scouting_team': +key,
          'auton_tarmac': _.meanBy(objs, 'auton_tarmac'),
          'auton_human_player': _.meanBy(objs, 'auton_human_player'),
          'auton_high_goals': _.meanBy(objs, 'auton_high_goals'),
          'auton_low_goals': _.meanBy(objs, 'auton_low_goals'),
          'auton_high_miss': _.meanBy(objs, 'auton_high_miss'),
          'auton_low_miss': _.meanBy(objs, 'auton_low_miss'),
          'teleop_high_goals': _.meanBy(objs, 'teleop_high_goals'),
          'teleop_low_goals': _.meanBy(objs, 'teleop_low_goals'),
          'teleop_high_miss': _.meanBy(objs, 'teleop_high_miss'),
          'teleop_low_miss': _.meanBy(objs, 'teleop_low_miss'),
          'final_hang_pos': _.meanBy(objs, 'final_hang_pos'),
          'event_key': '',
          'match_key': '',
          'scouter_name': '',
          'match_notes': '',
          'secret_team_key': '',
        })).value();
      this.scoutData.data = output;

    }

  }


  public loadData(): void {
    const teamKey = this.fgSearch.value.teamKey;
    const eventKey = this.fgSearch.value.eventKey;
    this.appData.getResults(teamKey).subscribe((res) => {
      console.log(res);
      this.fullScoutData = res;
      this.filterData();
      this.pageReady = true;
    });
  }
}
