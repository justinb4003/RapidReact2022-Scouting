import { Component, OnInit, Input } from '@angular/core';
import { PitResult } from 'src/app/shared/models/pit-result.model';
import { AppDataService } from 'src/app/shared/services/app-data.service';

@Component({
  selector: 'app-scout-pit-view',
  templateUrl: './scout-pit-view.component.html',
  styleUrls: ['./scout-pit-view.component.scss'],
})
export class ScoutPitViewComponent implements OnInit {
  @Input() public pitResult!: PitResult;

  public nickname = '...loading..';

  constructor(
    private appData: AppDataService,
  ) { }

  public ngOnInit(): void {
    this.appData.getEventTeamList(this.pitResult.event_key).subscribe((teams) => {
      const team = teams.find((t) => t.number === this.pitResult.scouting_team);
      if (team) {
        this.nickname = team.name;
        console.log('setting nickname ', this.nickname);
      } else {
        console.log('no team found for ', this.pitResult.scouting_team);
      }
    });
  }

  get wheelType(): string {
    const pr = this.pitResult;
    let retVal = 'unknown';
    if (pr.wheel_inflated) {
      retVal = 'inflated';
    } else if (pr.wheel_solid) {
      retVal = 'solid';
    } else if (pr.wheel_omni) {
      retVal = 'omni';
    } else if (pr.wheel_mec) {
      retVal = 'mecanum';
    }

    return retVal;
  }

  get teamDisplayName(): string {
    return `${this.pitResult.scouting_team} (${this.nickname})`;
  }
}

export default ScoutPitViewComponent;
