import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ScoutResult } from 'src/app/shared/models/scout-result.model';
import { TBATeam } from 'src/app/shared/models/tba-team.model';
import { AppDataService } from 'src/app/shared/services/app-data.service';

@Component({
  selector: 'app-score-match',
  templateUrl: './score-match.component.html',
  styleUrls: ['./score-match.component.scss'],
})
export class ScoreMatchComponent implements OnInit, AfterViewInit {
  public uploadError = false;

  public teamList: TBATeam[] = [];

  public fgMatch: FormGroup = new FormGroup({
    autoCommunity: new FormControl(this.appData.autoCommunity, Validators.required),
    endgameDocked: new FormControl(this.appData.endgameDock, Validators.required),
    autoEngaged: new FormControl(this.appData.autoEngaged, Validators.required),
    endGameParked: new FormControl(this.appData.endgameParked, Validators.required),
    scouterName: new FormControl(this.appData.scouterName, Validators.required),
    teamKey: new FormControl(this.appData.teamKey),
    scoutingTeam: new FormControl(this.appData.scoutingTeam, [
      Validators.required,
      Validators.min(1),
    ]),
    eventKey: new FormControl(this.appData.eventKey, Validators.required),
    match: new FormControl(this.appData.match, [
      Validators.required,
      Validators.pattern('^[1-9][0-9]*$'), // Fun with regex to force only numbers as valid input
    ]),
    matchNotes: new FormControl(this.appData.matchNotes),
  });

  constructor(
    public appData: AppDataService,
    public snackbar: MatSnackBar,
  ) {}

  public ngOnInit(): void {
    this.loadData();
    this.fgMatch.get('eventKey')?.valueChanges.subscribe((eventKey) => {
      this.appData.eventKey = eventKey;
      this.loadData();
    });
  }

  private loadData(): void {
    console.log('this.app eventkey', this.appData.eventKey);
    this.appData.getEventTeamList(this.appData.eventKey).subscribe((tl) => {
      console.log('team list', tl);
      this.teamList = tl;
    });
  }

  public ngAfterViewInit(): void {
    // Create event handlers for text input form controls
    // The ? operator here is used to abort the command if the get() returns
    // a null or undefined value.
    // We're also creating a subscription that processes the tiny little function
    // that we define within the subscribe() method itself.
    this.fgMatch.get('scouterName')?.valueChanges.subscribe((x) => {
      this.appData.scouterName = x;
    });
    this.fgMatch.get('teamKey')?.valueChanges.subscribe((x) => {
      this.appData.teamKey = x;
    });
    this.fgMatch.get('eventKey')?.valueChanges.subscribe((x) => {
      this.appData.eventKey = x;
      this.loadData();
    });
    this.fgMatch.get('match')?.valueChanges.subscribe((x) => {
      this.appData.match = x;
    });
    this.fgMatch.get('scoutingTeam')?.valueChanges.subscribe((x) => {
      // We use the + operator to force the value to be a number.
      this.appData.scoutingTeam = +x;
    });
    // Now let's define one with a defined function instead of an anonymous one.
    this.fgMatch.get('matchNotes')?.valueChanges.subscribe((x) => this.updateMatchNotes(x));
  }

  public updateMatchNotes(notes: string): void {
    this.appData.matchNotes = notes;
  }

  public toggleAutoCommunity(): void {
    this.appData.autoCommunity = this.fgMatch.get('autoTarmac')?.value;
  }

  public toggleEndgameDocked(): void {
    this.appData.endgameDock = this.fgMatch.get('endgameDocked')?.value;
  }

  public toggleAutoDocked(): void {
    this.appData.autoDocked = this.fgMatch.get('autoDocked')?.value;
  }

  public toggleAutoEngaged(): void {
    this.appData.autoEngaged = this.fgMatch.get('autoEngaged')?.value;
  }

  public toggleEndgameParked(): void {
    this.appData.autoEngaged = this.fgMatch.get('endgameParked')?.value;
  }

  public toggleEndgameEngaged(): void {
    this.appData.autoEngaged = this.fgMatch.get('endgameEngaged')?.value;
  }

  public autoCubeHighInc(): void {
    this.appData.autoCubeHigh += 1;
  }

  public autoCubeHighDec(): void {
    if (this.appData.autoCubeHigh > 0) {
      this.appData.autoCubeHigh -= 1;
    }
  }

  public autoCubeMediumInc(): void {
    this.appData.autoCubeMedium += 1;
  }

  public autoCubeMediumDec(): void {
    if (this.appData.autoCubeMedium > 0) {
      this.appData.autoCubeMedium -= 1;
    }
  }

  public autoCubeLowInc(): void {
    this.appData.autoCubeLow += 1;
  }

  public autoCubeLowDec(): void {
    if (this.appData.autoCubeLow > 0) {
      this.appData.autoCubeLow -= 1;
    }
  }

  public autoConeHighInc(): void {
    this.appData.autoConeHigh += 1;
  }

  public autoConeHighDec(): void {
    if (this.appData.autoConeHigh > 0) {
      this.appData.autoConeHigh -= 1;
    }
  }

  public autoConeMediumInc(): void {
    this.appData.autoConeMedium += 1;
  }

  public autoConeMediumDec(): void {
    if (this.appData.autoConeMedium > 0) {
      this.appData.autoConeMedium -= 1;
    }
  }

  public autoConeLowInc(): void {
    this.appData.autoConeLow += 1;
  }

  public autoConeLowDec(): void {
    if (this.appData.autoConeLow > 0) {
      this.appData.autoConeLow -= 1;
    }
  }
  
  public teleopCubeHighInc(): void {
    this.appData.teleopCubeHigh += 1;
  }

  public teleopCubeHighDec(): void {
    if (this.appData.teleopCubeHigh > 0) {
      this.appData.teleopCubeHigh -= 1;
    }
  }

  public teleopCubeMediumInc(): void {
    this.appData.teleopCubeMedium += 1;
  }

  public teleopCubeMediumDec(): void {
    if (this.appData.teleopCubeMedium > 0) {
      this.appData.teleopCubeMedium -= 1;
    }
  }

  public teleopCubeLowInc(): void {
    this.appData.teleopCubeLow += 1;
  }

  public teleopCubeLowDec(): void {
    if (this.appData.teleopCubeLow > 0) {
      this.appData.teleopCubeLow -= 1;
    }
  }

  public teleopConeHighInc(): void {
    this.appData.teleopConeHigh += 1;
  }

  public teleopConeHighDec(): void {
    if (this.appData.teleopConeHigh > 0) {
      this.appData.teleopConeHigh -= 1;
    }
  }

  public teleopConeMediumInc(): void {
    this.appData.teleopConeMedium += 1;
  }

  public teleopConeMediumDec(): void {
    if (this.appData.teleopConeMedium > 0) {
      this.appData.teleopConeMedium -= 1;
    }
  }

  public teleopConeLowInc(): void {
    this.appData.teleopConeLow += 1;
  }

  public teleopConeLowDec(): void {
    if (this.appData.teleopConeLow > 0) {
      this.appData.teleopConeLow -= 1;
    }
  }

  public endgameBuddyInc(): void {
    this.appData.buddyBots += 1;
  }

  public endgameBuddyDec(): void {
    if (this.appData.buddyBots > 0) {
      this.appData.buddyBots -= 1;
    }
  }


  get matchData(): ScoutResult {
    // const ret = {
    //   scouter_name: this.appData.scouterName,
    //   secret_team_key: this.appData.teamKey.toLowerCase().trim(),
    //   event_key: this.appData.eventKey,
    //   match_key: this.appData.match,
    //   scouting_team: this.appData.scoutingTeam,
    //   auton_tarmac: this.appData.autoCommunity,
    //   auton_high_goals: this.appData.autoHighGoal,
    //   auton_high_miss: this.appData.autoHighGoalmiss,
    //   auton_low_goals: this.appData.autoLowGoal,
    //   auton_low_miss: this.appData.autoLowGoalmiss,
    //   auton_human_player: this.appData.humanGoals,
    //   teleop_high_goals: this.appData.teleopHighGoal,
    //   teleop_high_miss: this.appData.teleopHighGoalmiss,
    //   teleop_low_goals: this.appData.teleopLowGoal,
    //   teleop_low_miss: this.appData.teleopLowGoalmiss,
    //   final_hang_pos: this.appData.finalHangPos,
    //   match_notes: this.appData.matchNotes,
    // } as ScoutResult;
    // return ret;
    return {} as ScoutResult;
  }

  public uploadData(): void {
    if (this.fgMatch.valid) {
      this.appData.postResults(this.matchData).subscribe({
        next: (data) => {
          this.uploadError = false;
          this.snackbar.open(
            'Success! Data uploaded!',
            'Close',
            { duration: 5000, panelClass: ['snackbar-success'] },
          );
          // Reset form controls that should be reset between matches
          this.resetForm();
        },
        error: (err) => {
          console.log('Error uploading data: ', err);
          this.uploadError = true;
          this.snackbar.open(
            'Error uploading data, please try again.',
            'Close',
            { duration: 5000, panelClass: ['snackbar-error'] },
          );
        },
      });
    } else {
      const fields: string[] = [];
      if (!this.fgMatch.get('scouterName')?.valid) {
        fields.push('scouter name');
      }
      if (!this.fgMatch.get('scoutingTeam')?.valid) {
        fields.push('team you are scouting');
      }
      if (!this.fgMatch.get('eventKey')?.valid) {
        fields.push('event you are scouting');
      }
      if (!this.fgMatch.get('match')?.valid) {
        fields.push('match number');
      }

      const msg = 'Please enter a value for ' + fields.join(', ');
      alert(msg);
    }
  }

  public resetForm(): void {
  }
  public resetFormConfirm(): void {
    const resp = confirm('Are you sure you want to clear the form?');
    if (resp) {
      this.resetForm();
    }
  }

  get gameJSON(): string {
    return JSON.stringify(this.matchData);
  }

  get gameJSONFormatted(): string {
    return JSON.stringify(this.matchData, null, 4);
  }
}

export default ScoreMatchComponent;
