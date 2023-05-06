import { Component, Input } from '@angular/core';
import { User } from '@users/utils/models/user.model';

@Component({
  selector: 'gu-user-profile-card',
  templateUrl: './user-profile-card.component.html',
  styleUrls: ['./user-profile-card.component.scss']
})
export class UserProfileCardComponent {

  @Input({ required: true }) user!: User;

}
