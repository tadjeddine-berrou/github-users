import { Component, Input } from '@angular/core';
import { User } from '@users/utils/models/user.model';

@Component({
  selector: 'gu-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent {

  @Input({ required: true }) user!: User;

}
