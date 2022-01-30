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
    console.log('init ended');

  }

  public displaySidenavMenu(): void {
    this.sidenav.open();
  }

  public logout(): void {
    console.log('Does nothing. HAH! Tricked you.');
  }

}
