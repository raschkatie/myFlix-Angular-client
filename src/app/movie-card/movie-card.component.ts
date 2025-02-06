import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MovieDialogComponent } from '../movie-dialog/movie-dialog.component';

/**
 * This is the component for the home page; it allows the user to view the
 * list of movies, add movies to their list of favorites, and view each
 * movie's details.
 * 
 * MovieCardComponent retrieves the full list of movies from the API,
 * allows the user to add or remove a movie from their list of favorites,
 * and opens dialog windows with different details of each movie.
 */

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent {
  movies: any[] = [];
  favoriteMovies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public router: Router,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
   }

  ngOnInit(): void {
    this.getMovies();
  }

  /**
   * Navigates to the user's profile page.
   */
  redirectProfile(): void {
    this.router.navigate(['users/:userId']);
  }

  /**
   * Logs the user out of the app.
   */
  logout(): void {
    this.router.navigate(['welcome']);
    localStorage.removeItem('user');
  }

  /**
   * Retrieves the full list of movies from the backend API
   * and finds if the movie is included in the user's list of
   * favorite movies.
   * 
   * @returns {void} - does not return a value
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((movies) => {
      this.movies = movies;

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const username = user.Username;

      this.fetchApiData.getUser(username).subscribe((userData) => {
        this.favoriteMovies = userData.FavoriteMovies || [];

        this.movies.forEach((movie: any) => {
          movie.isFavorite = this.favoriteMovies.includes(movie._id);
        });
        localStorage.setItem('user', JSON.stringify(userData));
      });
    }, (err) => {
      console.error(err);
    });
  }

  /**
   * Checks to see if the movie is in the list of favorite movies.
   * 
   * @param movieId - the id number of the movie to check
   * @returns {boolean} - returns 'true' or 'false' depending on if the movie is found in the list
   */
  isFavorite(movieId: string): boolean {
    return this.favoriteMovies.includes(movieId.toString());
  }

  /**
   * 
   * @param movie - the movie name to add or remove
   * @returns {void} - does not return a value
   */
  modifyFavoriteMovies(movie: any): void {
    const user = JSON.parse(localStorage.getItem('user') ?? '{}');
    const username = user.Username || '';
    const movieId = movie._id.toString();
  
    if (this.isFavorite(movieId)) {
      this.fetchApiData.removeFavoriteMovie(username, movieId).subscribe(() => {
        this.favoriteMovies = this.favoriteMovies.filter(id => id !== movieId);

        user.FavoriteMovies = this.favoriteMovies;
        localStorage.setItem('user', JSON.stringify(user));
  
        this.snackBar.open('Removed from favorites', 'OK', { duration: 2000 });
      });
    } else {
      this.fetchApiData.addFavoriteMovie(username, movieId).subscribe((resp: any) => {
        this.favoriteMovies = resp.FavoriteMovies;
        
        user.FavoriteMovies = this.favoriteMovies;
        localStorage.setItem('user', JSON.stringify(user));
  
        this.snackBar.open('Added to favorites', 'OK', { duration: 2000 });
      });
    }
  }
  
  /**
   * Opens a dialog window with movie information depending on which button
   * the user clicked: Synopsis, Director, or Genre.
   * 
   * @param type - the type of data to retrieve (i.e. string, any, etc.)
   * @param data - the data to retrieve
   * @param movie - the movie name to display
   * @returns {void} - does not return a value
   */
  openDialog(type: string, data: any, movie: string): void {
    this.dialog.open(MovieDialogComponent, {
      data: { type, data, movie },
      width: '500px'
    });
  }

}
