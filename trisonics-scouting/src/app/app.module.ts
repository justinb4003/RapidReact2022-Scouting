import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginScreenComponent } from './components/login-screen/login-screen.component';
import { ScoreMatchComponent } from './components/score-match/score-match.component';
import { ViewResultsComponent } from './components/view-results/view-results.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginScreenComponent,
    ScoreMatchComponent,
    ViewResultsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
