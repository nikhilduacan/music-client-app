import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { concatMap, toArray } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Album, Artist, Song, MusicRecord } from '../models';


@Injectable({
    providedIn: 'root'
})
export class MusicService {
    constructor(private httpClient: HttpClient) { }

    private apiBaseUrl = 'http://localhost:5000/';

    getMusicRecords(sortBy: string, order: string): Observable<MusicRecord[]> {
        if (sortBy === 'albumName') {
            return this.getRecordsByAlbum(order, 'name');
        }
        else if (sortBy === 'artistName') {
            return this.getRecordsByArtist(order,'name');
        }
        else if (sortBy === 'yearReleased') {
            return this.getRecordsByAlbum(order, 'year_released');
        }
        else if (sortBy === 'songName') {
            return this.getRecordsBySong(order, 'name');
        }
        else {
            return this.getRecordsBySong(order, 'track');
        }
    }

    getRecordsByAlbum(orderBy: string, sortBy: string): Observable<MusicRecord[]> {
        let albumUrl = `${this.apiBaseUrl}albums?_sort=${sortBy}&_order=${orderBy}`;
        let songUrl = `${this.apiBaseUrl}songs?album_id=`;
        return this.httpClient.get<Album[]>(albumUrl)
            .pipe(
                concatMap(albumArray => albumArray.map(album => ({
                    albumId: album.id,
                    artistId: album.artist_id,
                    yearReleased: album.year_released,
                    albumName: album.name
                }))),
                concatMap(album => this.httpClient.get<Song[]>(`${songUrl}${album.albumId}`).pipe(
                    concatMap(songArray => songArray.map(song => ({
                        ...album,
                        songName: song.name,
                        songTrack: song.track
                    })))
                )),
                concatMap(song => this.getArtistById(song.artistId).pipe(
                    concatMap(artistArray => artistArray.map(artist => ({
                        ...song,
                        artistName: artist.name
                    })))
                )),
                toArray()
            );
    }

    getRecordsByArtist(orderBy: string, sortBy: string): Observable<MusicRecord[]> {
        let albumUrl = `${this.apiBaseUrl}albums?artist_id=`;
        let songUrl = `${this.apiBaseUrl}songs?album_id=`;
        let artistUrl = `${this.apiBaseUrl}artists?_sort=${sortBy}&_order=${orderBy}`;
        return this.httpClient.get<Artist[]>(artistUrl)
            .pipe(
                concatMap(artists => artists.map(artist => ({
                    artistId: artist.id,
                    artistName: artist.name
                }))),
                concatMap(artist => this.httpClient.get<Album[]>(`${albumUrl}${artist.artistId}`).pipe(
                    concatMap(albums => albums.map(album => ({
                        ...artist,
                        albumName: album.name,
                        albumId: album.id,
                        yearReleased: album.year_released
                    })))
                )),
                concatMap(album => this.httpClient.get<Song[]>(`${songUrl}${album.albumId}`).pipe(
                    concatMap(songs => songs.map(song => ({
                        ...album,
                        songName: song.name,
                        songTrack: song.track,
                    })))
                )),
                toArray()
            );
    }

    getRecordsBySong(orderBy: string, sortBy: string) : Observable<MusicRecord[]> {
        let songUrl = `${this.apiBaseUrl}songs?_sort=${sortBy}&_order=${orderBy}`;
        return this.httpClient.get<Song[]>(songUrl)
        .pipe(
            concatMap(songs => songs.map(song => ({
                songTrack: song.track,
                songName: song.name,              
                albumId: song.album_id
            }))),
            concatMap(song => this.getAlbumById(song.albumId).pipe(
                concatMap(albums => albums.map(album => ({
                    ...song,
                    albumName: album.name,
                    yearReleased: album.year_released,
                    artistId: album.artist_id
                })))
            )),
            concatMap(album => this.getArtistById(album.artistId).pipe(
                concatMap(artists => artists.map(artist => ({
                    ...album,
                    artistName: artist.name
                })))
            )),
            toArray()
        );
    }


    getArtistById(artistId: number) {
        return this.httpClient.get<Artist[]>(`${this.apiBaseUrl}artists?id=${artistId}`);
    }


    getAlbumById(albumId: number) {
        return this.httpClient.get<Album[]>(`${this.apiBaseUrl}artists?id=${albumId}`);
    }
 }
