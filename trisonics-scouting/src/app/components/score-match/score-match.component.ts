import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-score-match',
  templateUrl: './score-match.component.html',
  styleUrls: ['./score-match.component.scss']
})
export class ScoreMatchComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  public updateData(): void {
    console.log('hit cosmos now');
  }

}
