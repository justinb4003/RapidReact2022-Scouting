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
    autoTarmac: new FormControl(this.appData.autoTarmac, Validators.required),
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
    finalHangPos: new FormControl(this.appData.finalHangPos, Validators.required),
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

  public toggleAutoTarmac(): void {
    this.appData.autoTarmac = this.fgMatch.get('autoTarmac')?.value;
  }

  public humanGoalsDec(): void {
    if (this.appData.humanGoals > 0) {
      this.appData.humanGoals -= 1;
    }
  }

  public humanGoalsInc(): void {
    this.appData.humanGoals += 1;
  }

  public autoLowGoalsInc(): void {
    this.appData.autoLowGoal += 1;
  }

  public autoLowGoalDec(): void {
    if (this.appData.autoLowGoal > 0) {
      this.appData.autoLowGoal -= 1;
    }
  }

  public autoHighGoalmissInc(): void {
    this.appData.autoHighGoalmiss += 1;
  }

  public autoHighGoalmissDec(): void {
    if (this.appData.autoHighGoalmiss > 0) {
      this.appData.autoHighGoalmiss -= 1;
    }
  }

  public autoLowGoalmissInc(): void {
    this.appData.autoLowGoalmiss += 1;
  }

  public autoLowGoalmissDec(): void {
    if (this.appData.autoLowGoalmiss > 0) {
      this.appData.autoLowGoalmiss -= 1;
    }
  }

  public teleopLowGoalsInc(): void {
    this.appData.teleopLowGoal += 1;
  }

  public teleopHighGoalInc(): void {
    this.appData.teleopHighGoal += 1;
  }

  public teleopHighGoalDec(): void {
    if (this.appData.teleopHighGoal > 0) {
      this.appData.teleopHighGoal -= 1;
    }
  }

  public teleopLowGoalDec(): void {
    if (this.appData.teleopLowGoal > 0) {
      this.appData.teleopLowGoal -= 1;
    }
  }

  public teleopHighGoalmissInc(): void {
    this.appData.teleopHighGoalmiss += 1;
  }

  public teleopHighGoalmissDec(): void {
    if (this.appData.teleopHighGoalmiss > 0) {
      this.appData.teleopHighGoalmiss -= 1;
    }
  }

  public teleopLowGoalmissInc(): void {
    this.appData.teleopLowGoalmiss += 1;
  }

  public teleopLowGoalmissDec(): void {
    if (this.appData.teleopLowGoalmiss > 0) {
      this.appData.teleopLowGoalmiss -= 1;
    }
  }

  public updateFinalHangPos(): void {
    // The + forces the value to be a number type.
    const c = this.fgMatch.get('finalHangPos');
    this.appData.finalHangPos = c ? c.value : 0;
  }

  get matchData(): ScoutResult {
    const ret = {
      scouter_name: this.appData.scouterName,
      secret_team_key: this.appData.teamKey.toLowerCase().trim(),
      event_key: this.appData.eventKey,
      match_key: this.appData.match,
      scouting_team: this.appData.scoutingTeam,
      auton_tarmac: this.appData.autoTarmac,
      auton_high_goals: this.appData.autoHighGoal,
      auton_high_miss: this.appData.autoHighGoalmiss,
      auton_low_goals: this.appData.autoLowGoal,
      auton_low_miss: this.appData.autoLowGoalmiss,
      auton_human_player: this.appData.humanGoals,
      teleop_high_goals: this.appData.teleopHighGoal,
      teleop_high_miss: this.appData.teleopHighGoalmiss,
      teleop_low_goals: this.appData.teleopLowGoal,
      teleop_low_miss: this.appData.teleopLowGoalmiss,
      final_hang_pos: this.appData.finalHangPos,
      match_notes: this.appData.matchNotes,
    } as ScoutResult;
    return ret;
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
    this.fgMatch.get('autoTarmac')?.setValue(false);
    this.fgMatch.get('scoutingTeam')?.setValue('');
    this.fgMatch.get('match')?.setValue('');
    this.fgMatch.get('finalHangPos')?.setValue(0);
    this.fgMatch.get('matchNotes')?.setValue('');

    // Now flip the numeric controls back to 0
    this.appData.autoHighGoal = 0;
    this.appData.autoHighGoalmiss = 0;
    this.appData.autoLowGoal = 0;
    this.appData.autoLowGoalmiss = 0;
    this.appData.humanGoals = 0;
    this.appData.teleopHighGoal = 0;
    this.appData.teleopHighGoalmiss = 0;
    this.appData.teleopLowGoal = 0;
    this.appData.teleopLowGoalmiss = 0;
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
