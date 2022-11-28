/* eslint-disable import/prefer-default-export */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewResultsComponent } from './components/view-results/view-results.component';
import { ScoreMatchComponent } from './components/score-match/score-match.component';
import { TeamDetailsComponent } from './components/team-details/team-details.component';
import { ScoutPitComponent } from './components/scout-pit/scout-pit.component';
import { SettingsComponent } from './components/settings/settings.component';
import { HeldDataComponent } from './components/held-data/held-data.component';
import { TimeKeeperComponent } from './components/time-keeper/time-keeper.component';

const routes: Routes = [
  {
    path: 'time-keeper',
    component: TimeKeeperComponent,
  },
  {
    path: 'score-match',
    component: ScoreMatchComponent,
  },
  {
    path: 'scout-pit',
    component: ScoutPitComponent,
  },
  {
    path: 'view-results',
    component: ViewResultsComponent,
  },
  {
    path: 'team-details',
    component: TeamDetailsComponent,
  },
  {
    path: 'team-details/:teamKey',
    component: TeamDetailsComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
  {
    path: '',
    component: SettingsComponent,
  },
  {
    path: 'helddata',
    component: HeldDataComponent,
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class AppRoutingModule { }
