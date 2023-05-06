import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersShellRoutingModule } from './users-shell-routing.module';
import { UsersShellComponent } from './users-shell.component';
import { UserService } from '@users/data-access/services/user.service';


@NgModule({
  declarations: [
    UsersShellComponent
  ],
  imports: [
    CommonModule,
    UsersShellRoutingModule
  ],
  providers: [
    UserService
  ]
})
export class UsersShellModule { }
