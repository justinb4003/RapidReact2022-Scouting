import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
    matchNotes: new FormControl('', Validators.required),
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
  public autoLowGoalsInc(): void {
    this.appData.autoLowGoal += 1;
  }
  public humanGoalsDec(): void {
    if (this.appData.humanGoals > 0) {
      this.appData.humanGoals -= 1;
    }
  }
  public humanGoalsInc(): void {
    this.appData.humanGoals += 1;
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


  private getGameData(): any {
    const d = {
      'name': this.appData.scouterName,
      'event_key': 'misjo_2022',
      'scouting_team': 8008,
      'high_goals_auton': this.appData.autoHighGoal,
      'tarmac_auton': this.appData.autoTarmac,
      'lower_goals_auton': this.appData.autoLowGoal,
      'human_goals': this.appData.humanGoals,
      'upper_goals_teleop': 4,
      'lower_goals_teleop': 2,
      'final_hang': 'lower',
      'low_goals_miss_auton': this.appData.autoLowGoalmiss,
      'high_goals_miss_auton': this.appData.autoHighGoalmiss,
    };
    return d;
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
