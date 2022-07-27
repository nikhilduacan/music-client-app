import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { merge, of } from 'rxjs';
import { startWith, map, switchMap, catchError} from 'rxjs/operators';

import { MusicService } from './services/music.service';
import { MusicRecord } from './models';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit  {
  title = 'music-client';
  displayedColumns: string[] = ['artistName','albumName', 'yearReleased', 'songTrack', 'songName' ]

  isLoading = false;
  numberOfMusicRecords = 0;
  musicRecordsList: MusicRecord[] = [];
  dataSource = new MatTableDataSource<MusicRecord>();

  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort) sort: MatSort = new MatSort();

  constructor(private musicService: MusicService) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.sort.sortChange.subscribe(() => { 
      this.paginator.pageIndex = 0;
    });

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoading = true;
          return this.musicService.getMusicRecords(
            this.sort.active, this.sort.direction);
        }),
        map(data => {
          this.isLoading = false;
          this.numberOfMusicRecords = data.length;
          return data;
        }),
        catchError(() => {
          this.isLoading = false;
          return of([]);
        })
      ).subscribe(data => {
        this.dataSource.data = data;
      });
   }

}
