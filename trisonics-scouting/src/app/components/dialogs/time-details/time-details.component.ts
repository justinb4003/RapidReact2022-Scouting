import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TimeEntry } from 'src/app/shared/models/time-entry.model';

@Component({
  selector: 'app-time-details',
  templateUrl: './time-details.component.html',
  styleUrls: ['./time-details.component.scss']
})
export class TimeDetailsComponent implements OnInit {
  public fgSubmit: FormGroup = new FormGroup({
    subteams: new FormControl(null, Validators.required),
    notes: new FormControl(''),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: TimeEntry,
  ) { }

  ngOnInit(): void {
  }

  public submitTime(): void {
    this.data.subteams = this.fgSubmit.get('subteams')?.value;
    this.data.notes = this.fgSubmit.get('notes')?.value;
    console.log('save it');
  }

}
