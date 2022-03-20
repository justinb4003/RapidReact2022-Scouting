import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppDataService } from 'src/app/shared/services/app-data.service';
import { TBATeam } from 'src/app/shared/models/tba-team.model';
import { PitResult } from 'src/app/shared/models/pit-result.model copy';

@Component({
  selector: 'app-scout-pit',
  templateUrl: './scout-pit.component.html',
  styleUrls: ['./scout-pit.component.scss']
})
export class ScoutPitComponent implements OnInit {

  public teamList: TBATeam[] = [];

  public fgScoutPit: FormGroup = new FormGroup({
    scouterName: new FormControl(this.appData.scouterName, Validators.required),
    teamKey: new FormControl(this.appData.teamKey, Validators.required),
    scoutingTeam: new FormControl(this.appData.scoutingTeam, [
      Validators.required,
      Validators.min(1),
    ]),
    eventKey: new FormControl(this.appData.eventKey, Validators.required),

    driveTrain: new FormControl(''),
    hasWheelOmni: new FormControl(false),
    hasWheelMec: new FormControl(false),
    hasWheelSolid: new FormControl(false),
    hasWheelInflated: new FormControl(false),
    lowGoal: new FormControl(false),
    highGoal: new FormControl(false),
    lowHang: new FormControl(false),
    highHang: new FormControl(false),
    midHang: new FormControl(false),
    traversalHang: new FormControl(false),
  });

  constructor(
    public appData: AppDataService,
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.fgScoutPit.get('eventKey')?.valueChanges.subscribe((eventKey) => {
      this.appData.eventKey = eventKey;
      this.loadData();
    });
  }

  private loadData(): void {
    console.log('this.app eventkey', this.appData.eventKey);
    this.appData.getEventTeamList(this.appData.eventKey).subscribe((tl) => {
      console.log('team list', tl)
      this.teamList = tl;
    });
  }

  get pitData(): PitResult {
    const ret = {
      scouter_name: this.appData.scouterName,
      secret_team_key: this.appData.teamKey,
      event_key: this.appData.eventKey,
      scouting_team: this.appData.scoutingTeam,
      drive_train: this.fgScoutPit.get('driveTrain')?.value,
      wheel_omni: this.fgScoutPit.get('hasWheelOmni')?.value,
      wheel_inflated: this.fgScoutPit.get('hasWheelInflated')?.value,
      wheel_mec: this.fgScoutPit.get('hasWheelMec')?.value,
      wheel_solid: this.fgScoutPit.get('hasWheelSolid')?.value,
    } as PitResult;
    return ret;
  }

  public sendData(): void{
    if (this.fgScoutPit.valid) {
      this.appData.postPitResults(this.pitData).subscribe({
        next: (data) => {
          console.log('it worked');
        },
        error: (err) => {
          console.log('Error uploading data: ', err);

        }
      });
    } else {
      let fields: string[] = [];
      if (!this.fgScoutPit.get('scouterName')?.valid) {
        fields.push('scouter name');
      }
      if (!this.fgScoutPit.get('scoutingTeam')?.valid) {
        fields.push('team you are scouting');
      }
      if (!this.fgScoutPit.get('eventKey')?.valid) {
        fields.push('event you are scouting');
      }

      const msg = 'Please enter a value for ' + fields.join(', ');
      alert(msg);
    }
  }
}
