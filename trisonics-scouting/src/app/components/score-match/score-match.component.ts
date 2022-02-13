import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ScoutResult } from 'src/app/shared/models/scout-result.model';
import { AppDataService } from 'src/app/shared/services/app-data.service';

@Component({
  selector: 'app-score-match',
  templateUrl: './score-match.component.html',
  styleUrls: ['./score-match.component.scss']
})
export class ScoreMatchComponent implements OnInit {

  public fgMatch: FormGroup = new FormGroup({
    autoTarmac: new FormControl(this.appData.autoTarmac, Validators.required),
    scouterName: new FormControl(this.appData.scouterName, Validators.required),
    scoutingTeam: new FormControl(this.appData.scoutingTeam, Validators.required),
    eventKey: new FormControl(this.appData.eventKey, Validators.required),
    match: new FormControl(this.appData.match, Validators.required),
    finalHangPos: new FormControl(this.appData.finalHangPos, Validators.required),
    matchNotes: new FormControl(this.appData.matchNotes),
  });

  constructor(public appData: AppDataService) {
  }

  public ngOnInit(): void {
    const self = this;
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

  public updateEventKey(): void {
    this.appData.eventKey = this.fgMatch.get('eventKey')?.value;
  }

  public updateMatch(): void {
    this.appData.match = this.fgMatch.get('match')?.value;
  }

  public updateScoutingTeam(): void {
    this.appData.scoutingTeam = +this.fgMatch.get('scoutingTeam')?.value;
  }

  public updateMatchNotes(): void {
    this.appData.matchNotes = this.fgMatch.get('matchNotes')?.value;
    console.log('match notes', this.appData.matchNotes);
  }

  public uploadData(): void {
    // Nice way to demonstrate how async timing works out.
    console.log('update data started');
    console.log('going for a post');

    this.appData.postResults(this.getGameData()).subscribe((data) => {
      console.log(data);
      console.log('post complete.');
    });

    console.log('update date complete.');
  }

  get qrGameString(): string {
    return JSON.stringify(this.getGameData());
  }
}
