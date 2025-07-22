import { Component, OnInit } from '@angular/core';
import { Profile } from '../profile';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  profile: Profile = {};
}
