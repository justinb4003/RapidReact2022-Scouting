import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TBAEvent } from 'src/app/shared/models/tba-event.model';
import { AppDataService } from 'src/app/shared/services/app-data.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public fgSettings: FormGroup = new FormGroup({
    teamKey: new FormControl(this.appData.teamKey),
    scouterName: new FormControl(this.appData.scouterName, Validators.required),
    eventKey: new FormControl(this.appData.eventKey, Validators.required),
  });

  constructor(
    public appData: AppDataService,
  ) { }

  ngOnInit(): void {
    this.fgSettings.get('teamKey')?.valueChanges.subscribe((tk) => {
      this.appData.teamKey = tk;
    });
    this.fgSettings.get('scouterName')?.valueChanges.subscribe((sn) => {
      this.appData.scouterName = sn;
    });
    this.fgSettings.get('eventKey')?.valueChanges.subscribe((ek) => {
      this.appData.eventKey = ek;
    });
  }

}
