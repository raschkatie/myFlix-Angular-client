import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  userData: any = { };
  favoriteMovies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public router: Router
  ) {
    this.userData = JSON.parse(localStorage.getItem('user') || '');
  }

  ngOnInit(): void {
    if (this.userData.Birthday) {
      this.userData.Birthday = this.formatDate(this.userData.Birthday);
    }
  
    this.getUserData().subscribe((resp) => {
      this.getFavoriteMovies();
    });
  }
  
  redirectMovies(): void {
    this.router.navigate(['movies']);
  }

  logout(): void {
    this.router.navigate(['welcome']);
    localStorage.removeItem('user');
  }

  getUserData(): Observable<any> {
    const username = this.userData.Username;
    return this.fetchApiData.getUser(username).pipe(
      map((resp: any) => {
        if (resp.Birthday) {
          resp.Birthday = this.formatDate(resp.Birthday);
        }
        this.userData = resp;
        this.favoriteMovies = resp.FavoriteMovies || [];
        return resp;
      })
    );
  }
  
  formatDate(dateString: string): string {
    if (!dateString) return '';
    return dateString.split('T')[0];
  }

  editUser(): void {
    const currentUsername = this.userData.Username; 
    const updatedUser: any = { ...this.userData };
    
    if (this.userData.newUsername) {
      updatedUser.Username = this.userData.newUsername;
    }
  
    this.fetchApiData.editUser(currentUsername, updatedUser).subscribe(
      (resp: any) => {  
        localStorage.setItem('user', JSON.stringify(resp));
        this.userData = resp;        
        this.snackBar.open('User information updated successfully!', 'OK', { duration: 2000 });
  
        if (updatedUser.Username) {
          this.router.navigate([`/users/${updatedUser.Username}`]);
        }
      },
      (error: any) => {
        console.error("Error:", error);
      }
    );
  }
  
  deleteAccount(): void {
    const confirmation = confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (confirmation) {
      const username = this.userData.Username;
      this.fetchApiData.deleteUser(username).subscribe(() => {
          localStorage.clear();
          this.router.navigate(['welcome']).then(() => {
            this.snackBar.open('Account deleted successfully.', 'OK', { duration: 2000 });
          });
        },
        (error) => {
          console.error("Error:", error);
        }
      );
    }
  }
  

  getFavoriteMovies(): void {  
    if (!this.userData.FavoriteMovies) {
      console.error('Favorite movies data is undefined.');
      return;
    }
  
    this.fetchApiData.getAllMovies().subscribe((res: any) => {
      this.favoriteMovies = res.filter((movie: any) => {
        return this.userData.FavoriteMovies.includes(movie._id.toString());
      });
    }, (error: any) => {
      console.error(error);
    });
  }
  

  removeFavorite(movieId: string): void {
    const username = this.userData.Username;
    this.fetchApiData.removeFavoriteMovie(username, movieId).subscribe(() => {
      this.favoriteMovies = this.favoriteMovies.filter(movie => movie._id !== movieId);
      this.snackBar.open('Movie removed from favorites.', 'OK', {
        duration: 2000
      });
    }, (error: any) => {
      console.error(error);
    });
  }

}
