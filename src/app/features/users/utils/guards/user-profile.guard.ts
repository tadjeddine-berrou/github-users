import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '@users/data-access/services/user.service';

export const userProfileGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  return !!userService.userListState.list.length || router.parseUrl('/users');
};
