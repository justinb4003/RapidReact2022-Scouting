import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TBAEvent } from 'src/app/shared/models/tba-event.model';
import { TBATeam } from 'src/app/shared/models/tba-team.model';
import { AppDataService } from 'src/app/shared/services/app-data.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public teamListLoading: boolean = false;

  public teamList: TBATeam[] = [];

  public fgSettings: FormGroup = new FormGroup({
    teamKey: new FormControl(this.appData.teamKey),
    scouterName: new FormControl(this.appData.scouterName, Validators.required),
    eventKey: new FormControl(this.appData.eventKey, Validators.required),
  });
  constructor(
    public appData: AppDataService,
  ) { }

  ngOnInit(): void {
    this.teamReload();
    this.fgSettings.get('teamKey')?.valueChanges.subscribe((tk) => {
      this.appData.teamKey = tk;
    });
    this.fgSettings.get('scouterName')?.valueChanges.subscribe((sn) => {
      this.appData.scouterName = sn;
    });
    this.fgSettings.get('eventKey')?.valueChanges.subscribe((ek) => {
      this.appData.eventKey = ek;
      this.teamReload();
    });
  }

  public teamReload(): void {
    const ek = this.appData.eventKey;
    this.teamListLoading = true;
    this.appData.getEventTeamList(ek).subscribe((tl) => {
      this.teamListLoading = false;
      this.teamList = tl;
    });
  }

  public forceTeamReload(): void {
    this.teamListLoading = true;
    this.appData.getEventTeamList(this.appData.eventKey, {force: true}).subscribe((tl) => {
      this.teamListLoading = false;
      this.teamList = tl;
    });
  }
}
