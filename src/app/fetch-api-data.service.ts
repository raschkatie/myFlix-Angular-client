import { Injectable } from '@angular/core';
import { catchError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

// declare the api url - switch to CONNECTION_URI via Render before launch ?
const apiUrl = 'https://kr-my-flix.onrender.com/';

@Injectable({
  providedIn: 'root'
})

export class FetchApiDataService {
  constructor(private http: HttpClient) {

  }

  public userRegistration(userDetails: any): Observable<any> {
    return this.http.post(`${apiUrl}users`, userDetails).pipe(
      catchError(this.handleError)
    );
  }

  public userLogin(userDetails: any): Observable<any> {
    return this.http.post(`${apiUrl}login`, userDetails).pipe(
      catchError(this.handleError)
    );
  }

  public getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${apiUrl}movies`, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      }
    ).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  public getMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${apiUrl}movies/${title}`, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      }
    ).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  public getGenre(name: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${apiUrl}movies/genre/${name}`, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      }
    ).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  public getUser(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${apiUrl}users/${username}`, {
          headers: new HttpHeaders({
              Authorization: `Bearer ${token}`,
          }),
      }
    ).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  public addFavoriteMovie(username: string, movieId: string): Observable<any> {
    const token = localStorage.getItem('token');

    return this.http.post(`${apiUrl}users/${username}/favorites/${movieId}`, {}, {
          headers: new HttpHeaders({
              Authorization: `Bearer ${token}`,
          }),
      }
    ).pipe(
      map(this.extractResponseData),
      catchError(this.handleError),
    );
  }

  public editUser(username: string, updatedUser: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put(`${apiUrl}users/${username}`, updatedUser, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      }
    ).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }
  

  public deleteUser(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(`${apiUrl}users/${username}`, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
        responseType: 'text'
      }
    ).pipe(
      map((response) => {
        try {
          return JSON.parse(response);
        } catch (error) {
          return { message: response };
        }
      }),
      catchError(this.handleError)
    );
  }
  

  public removeFavoriteMovie(username: string, movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(`${apiUrl}users/${username}/favorites/${movieId}`, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
      }),
    }
  ).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred: ', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`
      );
    }
    return throwError(
      'Something bad happened; please try again later.'
    );
  }

// non-typed response extraction
  private extractResponseData(res: any): any {
    const body = res;
    return body || { };
  }
}