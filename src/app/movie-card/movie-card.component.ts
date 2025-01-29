import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MovieDialogComponent } from '../movie-dialog/movie-dialog.component';

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

  redirectProfile(): void {
    this.router.navigate(['users/:userId']);
  }

  logout(): void {
    this.router.navigate(['welcome']);
    localStorage.removeItem('user');
  }

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

  isFavorite(movieId: string): boolean {
    return this.favoriteMovies.includes(movieId.toString());
  }

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
  
  openDialog(type: string, data: any, movie: string): void {
    this.dialog.open(MovieDialogComponent, {
      data: { type, data, movie },
      width: '500px'
    });
  }

}
