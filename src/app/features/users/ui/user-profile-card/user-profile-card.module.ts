import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileCardComponent } from './user-profile-card.component';



@NgModule({
  declarations: [
    UserProfileCardComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    UserProfileCardComponent
  ]
})
export class UserProfileCardModule { }
