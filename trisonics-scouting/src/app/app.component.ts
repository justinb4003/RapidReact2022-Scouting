import { Component, OnInit, ViewChild } from '@angular/core';
import { AppDataService } from './shared/services/app-data.service';
import { MatSidenav } from '@angular/material/sidenav';
import { MediaObserver } from '@angular/flex-layout';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'trisonics-scouting';

  private teamKeyVisible: boolean = false;

  @ViewChild('sidenav', { static: true })
  public sidenav: MatSidenav;

  constructor(
    public appData: AppDataService,
    public media: MediaObserver,
    public router: Router,
    ) { }

  public ngOnInit(): void {
  }

  public displaySidenavMenu(): void {
    this.sidenav.open();
  }

  public logout(): void {
    console.log('Does nothing. HAH! Tricked you.');
  }

  public disableDisplayTeamKey(): void {
    console.log('disable one hit');
    this.teamKeyVisible = false;
  }

  public enableDisplayTeamKey(): void {
    console.log('enable one hit');
    this.teamKeyVisible = true;
    setTimeout(() => {
      this.disableDisplayTeamKey();
    }, 5000);
  }

  public goToSettings(): void {
    this.router.navigate(['/settings']);

  }

  get displayTeamKey(): string {
    if (this.teamKeyVisible) {
      return this.appData.teamKey;
    }
    if (this.appData.teamKey) {
      return '********';
    }
    return 'none set!';
  }

}
