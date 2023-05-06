import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersShellRoutingModule } from './users-shell-routing.module';
import { UsersShellComponent } from './users-shell.component';
import { UserService } from '@users/data-access/services/user.service';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UsersShellComponent
  ],
  imports: [
    CommonModule,
    UsersShellRoutingModule,
    FormsModule
  ],
  providers: [
    UserService
  ]
})
export class UsersShellModule { }
