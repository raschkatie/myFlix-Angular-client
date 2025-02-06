import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

/**
 * This is the component for allowing the user to log in with an existing account.
 * 
 * UserLoginFormComponent renders a login form for the user to enter their 
 * username and password, then communicates with the backend API to authenticate
 * the user and navigate to the movie card view upon a successful login.
 */

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss']
})
export class UserLoginFormComponent implements OnInit {

  @Input() userData = { Username: '', Password: '' };
  isLoading = false;

  constructor(
      public fetchApiData: FetchApiDataService,
      public dialogRef: MatDialogRef<UserLoginFormComponent>,
      public snackBar: MatSnackBar,
      public router: Router
    ) { }

  ngOnInit(): void {
  }

  /**
   * Sends the user's credentials to the API.
   * After a successful response, the login form closes
   * and redirects the user to the home movies page.
   * 
   * @returns {void} - does not return a value
   */
  loginUser(): void {
    this.isLoading = true;
    this.fetchApiData.userLogin(this.userData).subscribe((result) => {
      localStorage.setItem('user', JSON.stringify(result.user));
      localStorage.setItem('token', result.token);
      this.dialogRef.close();
      this.snackBar.open('Log In Success!', 'OK', {
        duration: 2000
      });
      this.router.navigate(['movies']);
    }, 
    (result) => {
      this.snackBar.open(result, 'OK', {
        duration: 2000
      });
    },
    () => {
      this.isLoading = false;
    });
  }

}