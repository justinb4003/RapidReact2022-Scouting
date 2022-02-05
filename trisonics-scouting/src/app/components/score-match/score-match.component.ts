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

  public autoHighGoalInc(): void {
    this.appData.autoHighGoal += 1;
  }

  public autoHighGoalDec(): void {
    if (this.appData.autoHighGoal > 0) {
      this.appData.autoHighGoal -= 1;
    }
  }
  public autoLowGoalInc(): void {
    this.appData.autoLowGoal += 1;
  }

  public autoLowGoalDec(): void {
    if (this.appData.autoHighGoal > 0) {
      this.appData.autoLowGoal -= 1;
    }
  }

  private getGameData(): any {
    const d = {
      'name': 'Justin',
      'event_key': 'misjo_2022',
      'scouting_team': 8008,
      'high_goals_auton': this.appData.autoHighGoal,
      'tarmac_auton': this.appData.autoTarmac,
      'lower_goals_auton': 3,
      'upper_goals_teleop': 4,
      'lower_goals_teleop': 2,
      'final_hang': 'lower',
    };
    return d;
  }

  public updateData(): void {
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
