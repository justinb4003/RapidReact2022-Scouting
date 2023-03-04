import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { AppDataService } from 'src/app/shared/services/app-data.service';
import { ScoutResult } from 'src/app/shared/models/scout-result.model';
import { PitResult } from 'src/app/shared/models/pit-result.model';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { TBATeam } from 'src/app/shared/models/tba-team.model';
import { ScoutDetailComponent } from '../dialogs/scout-detail/scout-detail.component';

@Component({
  selector: 'app-view-results',
  templateUrl: './view-results.component.html',
  styleUrls: ['./view-results.component.scss'],
})
export class ViewResultsComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;

  public htmlData = '';

  public fullScoutData: ScoutResult[] = [];

  public fullPitData: PitResult[] = [];

  public pitData: PitResult[] = [];

  public scoutData = new MatTableDataSource<ScoutResult>();

  public pageReady = false;

  public dataLoading = true;

  public teamList: TBATeam[] = [];

  public allColumns = [
    'scouting_team',
    'team_name',
    'event_key',
    'auto_engaged',
    'auto_docked',
    'auto_community',
    'auto_cubes_high',
    'auto_cubes_medium',
    'auto_cubes_low',
    'auto_cones_high',
    'auto_cones_medium',
    'auto_cones_low',
    'teleop_cubes_high',
    'teleop_cubes_medium',
    'teleop_cubes_low',
    'teleop_cones_high',
    'teleop_cones_medium',
    'teleop_cones_low',
    'endgame_engaged',
    'endgame_docked',
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
      this.displayedColumns = this.displayedColumns.filter((x) => !(x.startsWith('auto')));
    }
    if (!this.fgSearch.value.displayTeleop) {
      this.displayedColumns = this.displayedColumns.filter((x) => !(x.startsWith('teleop')));
    }
    if (!this.fgSearch.value.displayEndGame) {
      this.displayedColumns = this.displayedColumns.filter((x) => !(x.startsWith('endgame')));
    }
    if (!this.fgSearch.value.displayNotes) {
      this.displayedColumns = this.displayedColumns.filter((x) => x !== 'match_notes');
      this.displayedColumns = this.displayedColumns.filter((x) => x !== 'scouter_name');
    }
    // TODO: When we're using the averaged view we should hide the things
    // we cannot aggregate, like match notes, scouter name, and match number.
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
      const output =
    _(this.scoutData.data).groupBy('scouting_team')
      .map((objs, key) => ({
        scouting_team: +key,
        team_name: this.teamList.find((t) => t.number === +key)?.name!,
        auto_engaged: _.meanBy(objs, (o) => o.auto_engaged ? 1 : 0),
        auto_docked: _.meanBy(objs, (o) => o.auto_docked ? 1 : 0),
        auto_community: _.meanBy(objs, (o) => o.auto_community ? 1 : 0),
        endgame_engaged: _.meanBy(objs, 'endgame_engaged'),
        endgame_docked: _.meanBy(objs, 'endgame_docked'),
        endgame_parked: _.meanBy(objs, 'endgame_parked'),
        
        auto_cubes_high:_.meanBy(objs, 'auto_cubes_high'),
        auto_cubes_medium:_.meanBy(objs, 'auto_cubes_medium'),
        auto_cubes_low:_.meanBy(objs, 'auto_cubes_low'),
        auto_cones_high:_.meanBy(objs, 'auto_cones_high'),
        auto_cones_medium:_.meanBy(objs, 'auto_cones_medium'),
        auto_cones_low:_.meanBy(objs, 'auto_cones_low'),
        
        teleop_cubes_high:_.meanBy(objs, 'teleop_cubes_high'),
        teleop_cubes_medium:_.meanBy(objs, 'teleop_cubes_medium'),
        teleop_cubes_low:_.meanBy(objs, 'teleop_cubes_low'),
        teleop_cones_high:_.meanBy(objs, 'teleop_cones_high'),
        teleop_cones_medium:_.meanBy(objs, 'teleop_cones_medium'),
        teleop_cones_low:_.meanBy(objs, 'teleop_cones_low'),

        // These cannot be summarized but we'll give them some empty values
        // that won't cause a problem later on in the code if we try and
        // display them.
        event_key: '',
        match_key: '',
        scouter_name: '',
        match_notes: '',
        secret_team_key: '',
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
          row.team_name = teamList.find((t) => t.number === row.scouting_team)?.name || 'undefined';
        });
        this.fullScoutData = res;
        this.appData.getPitResults('', eventKey, '').subscribe((r) => {
          this.fullPitData = r;
          this.pitData = r;
          this.filterData();
          this.pageReady = true;
          this.dataLoading = false;
        });
      });
    });
  }

  public downloadFile(data: any) {
    const replacer = (key: any, value: any) => (value === null ? '' : value); // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    const csv = data.map((row: any) => header
      .map((fieldName) => JSON.stringify(row[fieldName], replacer))
      .join(','));
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

export default ViewResultsComponent;
