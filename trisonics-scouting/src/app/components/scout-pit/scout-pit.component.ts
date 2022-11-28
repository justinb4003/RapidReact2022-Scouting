import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppDataService } from 'src/app/shared/services/app-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TBATeam } from 'src/app/shared/models/tba-team.model';
import { PitResult } from 'src/app/shared/models/pit-result.model';

@Component({
  selector: 'app-scout-pit',
  templateUrl: './scout-pit.component.html',
  styleUrls: ['./scout-pit.component.scss'],
})
export class ScoutPitComponent implements OnInit {
  public teamList: TBATeam[] = [];

  public imageList: string[] = [];

  public pitResultList: PitResult[] = [];

  public showExisting = false;

  public pitDataLoading = false;

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
    robotRating: new FormControl(0),
    skipRating: new FormControl(false),
    robotNotes: new FormControl(''),
  });

  constructor(
    public appData: AppDataService,
    public snackbar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.fgScoutPit.get('eventKey')?.valueChanges.subscribe((eventKey) => {
      this.appData.eventKey = eventKey;
      this.loadData();
    });
    this.fgScoutPit.get('scoutingTeam')?.valueChanges.subscribe((teamKey) => {
      this.loadPitData(teamKey);
    });
    this.fgScoutPit.get('skipRating')?.valueChanges.subscribe((skipRating) => {
      if (skipRating) {
        this.fgScoutPit.get('robotRating')?.disable();
      } else {
        this.fgScoutPit.get('robotRating')?.enable();
      }
    });
  }

  private loadPitData(teamKey: string): void {
    this.showExisting = true;
    this.pitDataLoading = true;
    this.appData
      .getPitResults(this.appData.teamKey, this.appData.eventKey, teamKey)
      .subscribe((data) => {
        console.log('pit data', JSON.stringify(data, null, 4));
        this.pitResultList = data;
        this.pitDataLoading = false;
      });
  }

  public viewPitResult(pr: PitResult): void {
    console.log('clickly', pr);
  }

  private loadData(): void {
    this.appData.getEventTeamList(this.appData.eventKey).subscribe((tl) => {
      this.teamList = tl;
    });
  }

  get pitData(): PitResult {
    const ret = {
      scouter_name: this.fgScoutPit.get('scouterName')?.value,
      secret_team_key: this.fgScoutPit.get('teamKey')?.value.toLowerCase().trim(),
      event_key: this.fgScoutPit.get('eventKey')?.value,
      scouting_team: this.fgScoutPit.get('scoutingTeam')?.value,
      drive_train: this.fgScoutPit.get('driveTrain')?.value,
      wheel_omni: this.fgScoutPit.get('hasWheelOmni')?.value,
      wheel_inflated: this.fgScoutPit.get('hasWheelInflated')?.value,
      wheel_mec: this.fgScoutPit.get('hasWheelMec')?.value,
      wheel_solid: this.fgScoutPit.get('hasWheelSolid')?.value,
      robot_rating: this.fgScoutPit.get('robotRating')?.value,
      robot_notes: this.fgScoutPit.get('robotNotes')?.value,
      images: this.imageList,
    } as PitResult;
    if (this.fgScoutPit.get('skipRating')?.value === true) {
      ret.robot_rating = null;
    }
    return ret;
  }

  public resetForm(): void {
    this.fgScoutPit.get('scoutingTeam')?.setValue('');
    this.imageList = [];
  }

  public sendData(): void {
    if (this.fgScoutPit.valid) {
      this.appData.postPitResults(this.pitData).subscribe({
        next: () => {
          this.snackbar.open(
            'Success! Data uploaded!',
            'Close',
            { duration: 5000, panelClass: ['snackbar-success'] },
          );
          this.resetForm();
        },
        error: (err) => {
          alert(err.error.message);
          this.snackbar.open(
            'Error uploading data',
            'Close',
            { duration: 5000, panelClass: ['snackbar-error'] },
          );
        },
      });
    } else {
      const fields: string[] = [];
      if (!this.fgScoutPit.get('scouterName')?.valid) {
        fields.push('scouter name');
      }
      if (!this.fgScoutPit.get('scoutingTeam')?.valid) {
        fields.push('team you are scouting');
      }
      if (!this.fgScoutPit.get('eventKey')?.valid) {
        fields.push('event you are scouting');
      }
      const msg = `Please enter a value for ${fields.join(', ')}`;
      alert(msg);
    }
  }

  public uploadImage($event: any): void {
    console.log('uploading image');
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.imageList.push(fileReader.result as string);
    };
    fileReader.readAsDataURL($event.target.files[0]);
  }
}

export default ScoutPitComponent;
