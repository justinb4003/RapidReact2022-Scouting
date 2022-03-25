import { _resolveDirectionality } from '@angular/cdk/bidi/directionality';
import { Component, OnInit, Input } from '@angular/core';
import { PitResult } from 'src/app/shared/models/pit-result.model copy';

@Component({
  selector: 'app-scout-pit-view',
  templateUrl: './scout-pit-view.component.html',
  styleUrls: ['./scout-pit-view.component.scss']
})
export class ScoutPitViewComponent implements OnInit {

  @Input() public pitResult!: PitResult;

  constructor() { }

  ngOnInit(): void {
  }

  get wheelType(): string {
    const pr = this.pitResult;
    let retVal = 'unknown';
    if (pr.wheel_inflated) {
      retVal = 'inflated';
    } else if (pr.wheel_solid) {
      retVal = 'solid';
    } else if (pr.wheel_omni) {
      retVal = 'omni';
    } else if (pr.wheel_mec) {
      retVal = 'mecanum'
    }

    return retVal;
  }
}
