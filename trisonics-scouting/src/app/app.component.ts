import { Component, OnInit, ViewChild } from '@angular/core';
import { AppDataService } from './shared/services/app-data.service';
import { MatSidenav } from '@angular/material/sidenav';
import { MediaObserver } from '@angular/flex-layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'trisonics-scouting';

  @ViewChild('sidenav', { static: true })
  public sidenav: MatSidenav;

  constructor(
    private appData: AppDataService,
    public media: MediaObserver,
    ) { }

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
    /*
    console.log('going for a post');
    this.appData.postResults(d).subscribe((data) => {
      console.log(data);
    });
    */
    console.log('init ended');

  }

  public displaySidenavMenu(): void {
    this.sidenav.open();
  }

  public logout(): void {
    console.log('Does nothing. HAH! Tricked you.');
  }

}
