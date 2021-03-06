import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AppDataService } from 'src/app/shared/services/app-data.service';
import { ScoutResult } from 'src/app/shared/models/scout-result.model';
import { PitResult } from 'src/app/shared/models/pit-result.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as _ from 'lodash';
import { _MatSlideToggleRequiredValidatorModule } from '@angular/material/slide-toggle';
import { MatDialog } from '@angular/material/dialog';
import { ScoutDetailComponent } from '../dialogs/scout-detail/scout-detail.component';
import { TBATeam } from 'src/app/shared/models/tba-team.model';

@Component({
  selector: 'app-view-results',
  templateUrl: './view-results.component.html',
  styleUrls: ['./view-results.component.scss']
})
export class ViewResultsComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;

  public htmlData: string = '';
  public fullScoutData: ScoutResult[] = [];
  public fullPitData: PitResult[] = [];
  public pitData: PitResult[] = [];
  public scoutData = new MatTableDataSource<ScoutResult>();
  public pageReady: boolean = false;

  public dataLoading: boolean = false;

  public teamList: TBATeam[] = [];

  public allColumns = [
    'scouting_team',
    'team_name',
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
    eventKey: new FormControl(this.appData.eventKey),
    displayAuton: new FormControl(true),
    displayTeleop: new FormControl(true),
    displayEndGame: new FormControl(true),
    displayOPR: new FormControl(true),
    displayNotes: new FormControl(true),
    displaySummary: new FormControl(true),
    teamFilter: new FormControl(''),
  });

  constructor(
    public appData: AppDataService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.setDisplayColumns();
    this.loadData();

    this.scoutData.sort = this.sort;
    this.fgSearch.valueChanges.subscribe((x) => {
      console.log('touched');
      this.setDisplayColumns();
      this.filterData();

    });
    this.fgSearch.get('eventKey')?.valueChanges.subscribe((x) => {
      this.loadData();
    });
  }

  public setDisplayColumns(): void {
    // console.log('change');
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
      this.displayedColumns = this.displayedColumns.filter((x) => x !== 'scouter_name');
    }
  }

  public filterData(): void {
    const eventKey = this.fgSearch.value.eventKey;
    const summary = this.fgSearch.value.displaySummary;
    const teamFilter = this.fgSearch.value.teamFilter;
    let data = this.fullScoutData;
    this.pitData = this.fullPitData;
    if (eventKey) {
      data = data.filter((x) => x.event_key === eventKey);
    }

    if (teamFilter.length > 0) {
      data = data.filter((x) => teamFilter.indexOf(x.scouting_team) > -1);
      this.pitData = this.pitData.filter((x) => teamFilter.indexOf(x.scouting_team) > -1);
    }

    this.scoutData.data = data;

    // Check summation now
    if (summary) {
      var output =
    _(this.scoutData.data).groupBy('scouting_team')
      .map((objs, key) => ({
          'scouting_team': +key,
          'team_name': this.teamList.find((t) => t.number === +key)?.name,
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
    this.dataLoading = true;
    this.appData.getEventTeamList(eventKey).subscribe((teamList) => {
      this.teamList = _.sortBy(teamList, 'number');
      this.appData.getResults(teamKey).subscribe((res) => {
        console.log(res);
        res.forEach((row) => {
          row.team_name = teamList.find((t) => t.number === row.scouting_team)?.name!;
        });
        this.fullScoutData = res;
        this.appData.getPitResults('', eventKey, '').subscribe((res) => {
          this.fullPitData = res;
          this.pitData = res;
          this.filterData();
          this.pageReady = true;
          this.dataLoading = false;
        });
      });
    })
  }

  public downloadFile(data: any) {
    const replacer = (key: any, value: any) => (value === null ? '' : value); // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    const csv = data.map((row: any) =>
      header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(',')
    );
    csv.unshift(header.join(','));
    const csvArray = csv.join('\r\n');

    const a = document.createElement('a');
    const blob = new Blob([csvArray], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = 'scout-data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  public exportCSV(): void {
    this.downloadFile(this.scoutData.data);
  }

  public showTeamDetail(teamNumber: number): void {
    console.log('clickly');
    const dref = this.dialog.open(ScoutDetailComponent, {
      height: '75vh',
      width: '100%',
      data: this.fullScoutData.filter(
         (x) => x.scouting_team === teamNumber &&
                x.event_key === this.fgSearch.value.eventKey,
        ),
    });
  }
}
