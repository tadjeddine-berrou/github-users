import { UserService } from '@users/data-access/services/user.service';
import { Component, Signal, computed, effect } from '@angular/core';
import { User, UserListState } from '@users/utils/models/user.model';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map, pairwise } from 'rxjs';

@Component({
  selector: 'gu-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {

  state: Signal<UserListState | undefined> = toSignal(this.userService.userListState$);
  userHandle: Signal<string | undefined> = toSignal<string>(this.route.params.pipe(map(params => params['user-handle'])));
  userIndex: Signal<number | undefined> = computed(() => this.state()?.list.findIndex(user => user.login === this.userHandle()));
  user: Signal<User | undefined> = computed(() => this.state()?.list.find(user => user.login === this.userHandle()));

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userService.userListState$.pipe(
      takeUntilDestroyed(),
      map(state => state.httpState),
      pairwise()
    ).subscribe(([prevHttpState, currentHttpState]) => {
      if (prevHttpState.status === 'loading' && currentHttpState.status === 'success') {
        let handle: string = '';
        const list = this.state()!.list;
        switch(currentHttpState.dir) {
          case 'next':
            handle = list[0].login;
            break;
          case 'prev':
            handle = list[list.length - 1].login
            break;
        }
        this.router.navigate(['/users', handle]);
      }
    });
    effect(() => {
      if (this.userHandle() && !this.user())
        this.router.navigate(['/users', this.state()!.list[0].login]);
    })
  }

  /** navigate users profiles */
  viewNextProfile(): void {
    if (this.userIndex() === this.state()!.list.length - 1) {
      // load next page of users
      this.loadNextPage();
    } else {
      const handle: string = this.state()!.list[this.userIndex()! + 1].login;
      this.router.navigate(['/users', handle]);
    }
  }

  viewPrevProfile(): void {
    if (this.userIndex()! === 0) {
      // load next page of users
      this.loadPrevPage();
    } else {
      const handle: string = this.state()!.list[this.userIndex()! - 1].login;
      this.router.navigate(['/users', handle]);
    }
  }

  /** load users profiles */
  loadNextPage(): void {
    this.userService.getUserList({ next: true });
  }

  loadPrevPage(): void {
    this.userService.getUserList({ prev: true });
  }
}
