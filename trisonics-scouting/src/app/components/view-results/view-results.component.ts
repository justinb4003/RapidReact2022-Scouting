import { Component, OnInit } from '@angular/core';
import { AppDataService } from 'src/app/shared/services/app-data.service';
import { ScoutResult } from 'src/app/shared/models/scout-result.model';

@Component({
  selector: 'app-view-results',
  templateUrl: './view-results.component.html',
  styleUrls: ['./view-results.component.scss']
})
export class ViewResultsComponent implements OnInit {

  public htmlData: string = '';
  public scoutData: ScoutResult[] = [];
  public pageReady: boolean = false;

  public displayedColumns = [
    'scouting_team',
    'auton_tarmac',
    'auton_high_goals'
  ];

  constructor(
    public appData: AppDataService,
  ) { }

  ngOnInit(): void {
    this.appData.getResults().subscribe((res) => {
      console.log(res);
      this.scoutData = res;
      this.pageReady = true;
    });
  }
}
