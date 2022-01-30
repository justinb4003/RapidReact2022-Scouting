import { Component, OnInit } from '@angular/core';
import { AppDataService } from './shared/services/app-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'trisonics-scouting';

  constructor(private appData: AppDataService) { }

  public ngOnInit(): void {
    console.log('init started');
    this.appData.getHelloWorld().subscribe((data) => {
        console.log(data);
    });
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
    console.log('init ended');

  }

}
