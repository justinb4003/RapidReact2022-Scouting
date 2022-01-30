import { Component, OnInit } from '@angular/core';
import { AppDataService } from 'src/app/shared/services/app-data.service';

@Component({
  selector: 'app-score-match',
  templateUrl: './score-match.component.html',
  styleUrls: ['./score-match.component.scss']
})
export class ScoreMatchComponent implements OnInit {

  constructor(private appData: AppDataService) { }

  public ngOnInit(): void {
    const self = this;
  }

  public updateData(): void {
    console.log('hit cosmos now');
    const d = {
      'name': 'Justin',
      'age': 41,
      'event_key': 'misjo_2022',
      'scouting_team': 8008,
      'upper_goals_auton': 1,
      'lower_goals_auton': 3,
      'upper_goals_teleop': 4,
      'lower_goals_teleop': 2,
      'final_hang': 'lower',
    };
    console.log('going for a post');
    this.appData.postResults(d).subscribe((data) => {
      console.log(data);
    });
  }

}
