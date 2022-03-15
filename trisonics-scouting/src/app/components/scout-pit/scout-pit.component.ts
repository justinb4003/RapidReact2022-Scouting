import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppDataService } from 'src/app/shared/services/app-data.service';

@Component({
  selector: 'app-scout-pit',
  templateUrl: './scout-pit.component.html',
  styleUrls: ['./scout-pit.component.scss']
})
export class ScoutPitComponent implements OnInit {
  public fgScoutPit: FormGroup = new FormGroup({
    teamNumber: new FormControl(''),
    driveTrain: new FormControl(''),
    lowGoal: new FormControl(false),
    highGoal: new FormControl(false),
    lowHang: new FormControl(false),
    highHang: new FormControl(false),
    midHang: new FormControl(false),
    traversalHang: new FormControl(false),
  });

  constructor(
    public appData: AppDataService,
  ) { }

  ngOnInit(): void {
  }

}
