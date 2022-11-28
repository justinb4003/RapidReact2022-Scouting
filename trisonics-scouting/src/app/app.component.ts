import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { MediaObserver } from '@angular/flex-layout';
import { AppDataService } from './shared/services/app-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'trisonics-scouting';

  private teamKeyVisible = false;

  @ViewChild('sidenav', { static: true })
  public sidenav!: MatSidenav;

  constructor(
    public appData: AppDataService,
    public media: MediaObserver,
    public router: Router,
  ) { }

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

export default AppComponent;
