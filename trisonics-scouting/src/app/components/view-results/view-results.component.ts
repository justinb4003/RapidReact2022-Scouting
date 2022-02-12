import { Component, OnInit } from '@angular/core';
import { AppDataService } from 'src/app/shared/services/app-data.service';

@Component({
  selector: 'app-view-results',
  templateUrl: './view-results.component.html',
  styleUrls: ['./view-results.component.scss']
})
export class ViewResultsComponent implements OnInit {

  public htmlData: string = '';

  constructor(
    public appData: AppDataService,
  ) { }

  ngOnInit(): void {
    this.appData.getResults().subscribe((res) => {
      console.log(res);
      this.htmlData = res;
    });
  }
}
