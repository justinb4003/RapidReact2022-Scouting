import { Component, OnInit } from '@angular/core';
import { AppDataService } from 'src/app/shared/services/app-data.service';

@Component({
  selector: 'app-held-data',
  templateUrl: './held-data.component.html',
  styleUrls: ['./held-data.component.scss']
})
export class HeldDataComponent implements OnInit {

  constructor(
    public appData: AppDataService,
  ) { }

  ngOnInit(): void {
  }

  public uploadData(): void {
    this.appData.heldScoutData.forEach((sd) => {
      this.appData.postResults(sd).subscribe((r) => {
        console.log('uploaded for match', sd.scouting_team);
      });
    });

    this.appData.heldPitData.forEach((sd) => {
      this.appData.postPitResults(sd).subscribe((r) => {
        console.log('uploaded for pit', sd.scouting_team);
      });
    });

  }

  get hasScoutData(): boolean {
    return this.appData.heldScoutData.length > 0;
  }

  get hasPitData(): boolean {
    return this.appData.heldPitData.length > 0;
  }

}
