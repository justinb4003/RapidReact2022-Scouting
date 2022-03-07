import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppDataService } from 'src/app/shared/services/app-data.service';

@Component({
  selector: 'app-team-details',
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.scss']
})
export class TeamDetailsComponent implements OnInit {
  public fgEvent: FormGroup = new FormGroup({
    eventKey: new FormControl('2022mifor'),
  });

  constructor(
    private appData: AppDataService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    console.log(this.route.snapshot.paramMap.get('teamKey'));
    this.appData.getOPRData(this.fgEvent.get('eventKey')?.value).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (err) => {
        console.error(err);
        alert('Error retrieving OPR data!')
      }
    })
  }
}
