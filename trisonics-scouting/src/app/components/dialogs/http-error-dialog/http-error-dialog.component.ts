import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-http-error-dialog',
  templateUrl: './http-error-dialog.component.html',
  styleUrls: ['./http-error-dialog.component.scss'],
})
export class HttpErrorDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public httpError: HttpErrorResponse,
  ) { }

  ngOnInit(): void {
    console.log(this.httpError);
  }

  // TODO: Fill in the rest of these with explanations that make sense to students
  get errorMeaning(): string {
    switch (this.httpError.status) {
      case 0:
        return 'No server responed to our request at all.';
      case 404:
        return 'The server could not find what you asked for.';
      case 500:
        return 'The API code we called tossed an error. Bad programmer!';
      default:
        return 'Undefined';
    }
  }
}

export default HttpErrorDialogComponent;
