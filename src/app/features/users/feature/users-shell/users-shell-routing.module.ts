import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersShellComponent } from './users-shell.component';
import { userProfileGuard } from '@users/utils/guards/user-profile.guard';

const routes: Routes = [
  {
    path: '',
    component: UsersShellComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@users/feature/user-list/user-list.module').then(
            m => m.UserListModule
          ),
        title: 'Users List'
      },
      {
        path: ':user-handle',
        loadChildren: () =>
          import('@users/feature/user-profile/user-profile.module').then(
            m => m.UserProfileModule
          ),
        title: 'User Profile',
        canActivate: [userProfileGuard]
      },
      {
        path: '**',
        redirectTo: '/users',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersShellRoutingModule { }
