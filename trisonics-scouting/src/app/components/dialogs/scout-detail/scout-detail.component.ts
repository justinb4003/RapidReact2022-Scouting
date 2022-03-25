import { Component, Inject, ViewChild, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PitResult } from 'src/app/shared/models/pit-result.model copy';
import { ScoutResult } from 'src/app/shared/models/scout-result.model';
import { AppDataService } from 'src/app/shared/services/app-data.service';

@Component({
  selector: 'app-scout-detail',
  templateUrl: './scout-detail.component.html',
  styleUrls: ['./scout-detail.component.scss']
})
export class ScoutDetailComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  public detailData = new MatTableDataSource<ScoutResult>();

  public teamNumber: number = 0;

  public pitResults: PitResult[] = [];

  public displayedColumns = [
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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ScoutResult[],
    public appData: AppDataService,
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    this.teamNumber = this.data[0].scouting_team;
    this.detailData.data = this.data;
  }

  ngAfterViewInit(): void {
    this.detailData.sort = this.sort;
  }

}
