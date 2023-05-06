import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { UserCardComponent } from './user-card.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    UserCardComponent
  ],
  imports: [
    CommonModule,
    NgOptimizedImage,
    RouterModule
  ],
  exports: [
    UserCardComponent
  ]
})
export class UserCardModule { }
