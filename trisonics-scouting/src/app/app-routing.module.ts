import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewResultsComponent } from './components/view-results/view-results.component';
import { ScoreMatchComponent } from './components/score-match/score-match.component';

const routes: Routes = [
  {
    path: "score-match",
    component: ScoreMatchComponent,
  },
  {
    path: "view-results",
    component: ViewResultsComponent,
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
