import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ScoutResult } from 'src/app/shared/models/scout-result.model';
import { AppDataService } from 'src/app/shared/services/app-data.service';

@Component({
  selector: 'app-score-match',
  templateUrl: './score-match.component.html',
  styleUrls: ['./score-match.component.scss']
})
export class ScoreMatchComponent implements OnInit, AfterViewInit {

  public uploadError: boolean = false;

  public fgMatch: FormGroup = new FormGroup({
    autoTarmac: new FormControl(this.appData.autoTarmac, Validators.required),
    scouterName: new FormControl(this.appData.scouterName, Validators.required),
    teamKey: new FormControl(this.appData.teamKey, Validators.required),
    scoutingTeam: new FormControl(this.appData.scoutingTeam, Validators.required),
    eventKey: new FormControl(this.appData.eventKey, Validators.required),
    match: new FormControl(this.appData.match, Validators.required),
    finalHangPos: new FormControl(this.appData.finalHangPos, Validators.required),
    matchNotes: new FormControl(this.appData.matchNotes),
  });

  constructor(
    public appData: AppDataService,
    public snackbar: MatSnackBar,
    ) {}

  public ngOnInit(): void {
    const self = this;
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
    this.fgMatch.get('eventKey')?.valueChanges.subscribe((x) => {
      this.appData.eventKey = x;
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

  public updateScouterName(): void {
    this.appData.scouterName = this.fgMatch.get('scouterName')?.value;
  }

  public autoHighGoalInc(): void {
    this.appData.autoHighGoal += 1;
  }

  public autoHighGoalDec(): void {
    if (this.appData.autoHighGoal > 0) {
      this.appData.autoHighGoal -= 1;
    }
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
    // The + forces the value to be a number.
    this.appData.finalHangPos = +this.fgMatch.get('finalHangPos')?.value;
  }

  private getGameData(): ScoutResult {
    const ret = {
      scouter_name: this.appData.scouterName,
      secret_team_key: this.appData.teamKey,
      event_key: this.appData.eventKey,
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
    // Nice way to demonstrate how async timing works out.
    this.appData.postResults(this.getGameData()).subscribe({
      next: (data) => {
        this.uploadError = false;
        this.snackbar.open('Success! Data uploaded!', 
          'Close', { duration: 5000, panelClass: ['snackbar-success'] });
        // Reset form controls that should be reset between matches
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
      },
      error: (err) => {
        console.log('Error uploading data: ', err);
        this.uploadError = true;
        this.snackbar.open('Error uploading data, please try again.', 
          'Close', { duration: 5000, panelClass: ['snackbar-error'] });
      }
    });
  }

  get qrGameString(): string {
    return JSON.stringify(this.getGameData());
  }
}
