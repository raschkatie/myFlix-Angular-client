import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-movie-dialog',
  templateUrl: './movie-dialog.component.html',
  styleUrls: ['./movie-dialog.component.scss']
})
export class MovieDialogComponent implements OnInit {
  type: string | undefined;
  data: any;
  movie: string | undefined;
  dialogTitle: string | undefined;

  ngOnInit(): void {
    
  }

  constructor(@Inject(MAT_DIALOG_DATA) public injectedData: any) {
    console.log('Injected Data:', injectedData);
    
    this.type = injectedData.type;
    this.data = injectedData.data;
    this.movie = injectedData.movie;

    console.log('TYPE: ', this.type);
    console.log('DATA: ', this.data);
  }
}
