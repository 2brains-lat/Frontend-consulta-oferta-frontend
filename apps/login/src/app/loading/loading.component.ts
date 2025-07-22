import { AnimationOptions } from 'ngx-lottie';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'verisure-loader',

  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoaderComponent {
  @Input()
  isLoading = false;
  @Input()
  mssg = '';
  options: AnimationOptions = {
    path: 'assets/lotties/loader.json', // download the JSON version of animation in your project directory and add the path to it like ./assets/animations/example.json
  };
}
