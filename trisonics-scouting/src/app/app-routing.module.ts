import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewResultsComponent } from './components/view-results/view-results.component';
import { ScoreMatchComponent } from './components/score-match/score-match.component';
import { TeamDetailsComponent } from './components/team-details/team-details.component';

const routes: Routes = [
  {
    path: "score-match",
    component: ScoreMatchComponent,
  },
  {
    path: "view-results",
    component: ViewResultsComponent,
  },
  {
    path: "team-details",
    component: TeamDetailsComponent,
  },
  {
    path: "team-details/:teamKey",
    component: TeamDetailsComponent,
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
