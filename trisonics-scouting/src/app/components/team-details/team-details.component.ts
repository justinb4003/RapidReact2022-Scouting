import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OPRData } from 'src/app/shared/models/opr-data-model';
import { AppDataService } from 'src/app/shared/services/app-data.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as _ from 'lodash';

@Component({
  selector: 'app-team-details',
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.scss']
})
export class TeamDetailsComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;

  public fullOPRData: OPRData[] = [];
  public oprData = new MatTableDataSource<OPRData>();
  public displayedColumns: string[] = [];
  public columns: Array<any> = [];
  public dataLoading: boolean = false;

  public oprColumnsMain: string[] = [
    'teamNumber',
    'autoCargoUpper',
    'autoCargoLower',
    'autoPoints',
    'teleopCargoUpper',
    'teleopCargoLower',
    'teleopPoints',
    'endgamePoints',
    'totalPoints',
    'rp',
    'foulCount',
    'foulPoints',
  ]

  public fgEvent: FormGroup = new FormGroup({
    teamNumber: new FormControl(''),
    eventKey: new FormControl('2022misjo'),
  });

  constructor(
    private appData: AppDataService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    const tk = this.route.snapshot.paramMap.get('teamKey');
    if (tk) {
      this.fgEvent.get('teamNumber')?.setValue(tk);
    }
    this.loadOPRData();
    this.fgEvent.get('eventKey')?.valueChanges.subscribe((x) => {
      this.loadOPRData();
    })
    this.fgEvent.get('teamNumber')?.valueChanges.subscribe((x) => {
      this.filterOPRData();
    });
  }

  public ngAfterViewInit(): void {
    this.oprData.sort = this.sort;
  }

  public filterOPRData(): void {

  }

  public loadOPRData(): void {
    this.dataLoading = true;
    this.appData.getOPRData(this.fgEvent.get('eventKey')?.value).subscribe({
      next: (data) => {
        console.log(JSON.stringify(data, null, 4));
        // const columns = Object.keys(data[0]);
        const columns = this.oprColumnsMain;
        this.columns = columns.map(column => {
          return {
            columnDef: column,
            header: column,
            cell: (element: any) => {
              if (column === 'teamNumber') {
                return Number.parseInt(element[column], 10);
              }
              return element[column] ? `${Number.parseFloat(element[column]).toFixed(2)}`: ``
            },
          }
        })
        data.forEach((row) => {
          row.autoCargoLower = (row.autoCargoLowerBlue + row.autoCargoLowerRed + row.autoCargoLowerNear + row.autoCargoLowerFar);
          row.autoCargoUpper = (row.autoCargoUpperBlue + row.autoCargoUpperRed + row.autoCargoUpperNear + row.autoCargoUpperFar);
          row.teleopCargoLower = (row.teleopCargoLowerBlue + row.teleopCargoLowerRed + row.teleopCargoLowerNear + row.teleopCargoLowerFar)
          row.teleopCargoUpper = (row.teleopCargoUpperBlue + row.teleopCargoUpperRed + row.teleopCargoUpperNear + row.teleopCargoUpperFar);
        })
        this.displayedColumns = this.columns.map(c => c.columnDef);
        _.remove(this.displayedColumns, c => c === 'teamNumber');
        this.displayedColumns.unshift('teamNumber');
        this.oprData.data = data;
        this.dataLoading = false;

      },
      error: (err) => {
        console.error(err);
        this.dataLoading = false;
        alert('Error retrieving OPR data!')
      }
    });

  }

  public downloadFile(data: any) {
    const replacer = (key: any, value: any) => (value === null ? '' : value); // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    const csv = data.map((row: any) =>
      header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(',')
    );
    csv.unshift(header.join(','));
    const csvArray = csv.join('\r\n');

    const a = document.createElement('a');
    const blob = new Blob([csvArray], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = 'opr-calcs.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  public exportCSV(): void {
    this.downloadFile(this.oprData.data);
  }
}
