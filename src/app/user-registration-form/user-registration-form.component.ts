import { Component, OnInit, Input } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FetchApiDataService } from "../fetch-api-data.service";
import { MatSnackBar } from "@angular/material/snack-bar";

/**
 * This is the component that allows the user to register a new account.
 * 
 * UserRegistrationFormComponent opens a dialog window with a registration form
 * that the user can fill out with their username, password, email address,
 * and birthday. The dialog is closed after the account is successfully created.
 */

@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss']
})
export class UserRegistrationFormComponent implements OnInit {

  @Input() userData = { Username: '', Password: '', Email: '', Birthday: ''};

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar) { }

    ngOnInit(): void {
      
    }

    /**
     * Takes the user's new information and creates an account.
     * 
     * @returns {void} - does not return a value
     */
    registerUser(): void {
      this.fetchApiData.userRegistration(this.userData).subscribe((result: string) => {
        this.dialogRef.close();
        this.snackBar.open('Account successfully created! Please log in.', 'OK', {
          duration: 2000
        });
      }, (result: string) => {
        this.snackBar.open('Error: Please try again', 'OK', {
          duration: 2000
        });
      });
    }
}