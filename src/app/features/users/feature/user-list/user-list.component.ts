import { UserService } from '@users/data-access/services/user.service';
import { Component, OnInit, Signal, effect } from '@angular/core';
import { UserListState } from '@users/utils/models/user.model';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'gu-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  state: Signal<UserListState | undefined> = toSignal(this.userService.userListState$);

  constructor(private userService: UserService) {
    /** added to track when the state gets updated */
    effect(() => {
      console.log(this.state())
    });
  }

  ngOnInit(): void {
    this.loadFirstPage();
  }

  loadFirstPage(): void {
    this.userService.getUserList();
  }

  loadNextPage(): void {
    this.userService.getUserList({ next: true });
  }

  loadPrevPage(): void {
    this.userService.getUserList({ prev: true });
  }
}
