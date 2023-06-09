import { Component, DestroyRef, inject } from '@angular/core';
import { UserService } from '@users/data-access/services/user.service';

@Component({
  selector: 'gu-users-shell',
  templateUrl: './users-shell.component.html',
  styleUrls: ['./users-shell.component.scss']
})
export class UsersShellComponent {

  token: string = '';

  destroyRef = inject(DestroyRef);

  constructor(private userService: UserService) {
    this.destroyRef.onDestroy(
      () => this.userService.cancelUserListFetch()
    );
  }

  updateToken(): void {
    this.userService.setToken(this.token);
  }
}
