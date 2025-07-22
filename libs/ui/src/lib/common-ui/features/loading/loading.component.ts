import { AnimationOptions } from 'ngx-lottie';
import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { LoaderService } from '@verisure/services';
import { Subject } from 'rxjs';

@Component({
  selector: 'verisure-loader',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoaderComponent implements OnInit {
  isLoading: Subject<boolean | any> = this.loaderService.isLoading;
  loaderMessage: Subject<boolean | any> = this.loaderService.loaderMssg;
  options: AnimationOptions = {
    path: 'assets/lotties/loader.json', // download the JSON version of animation in your project directory and add the path to it like ./assets/animations/example.json
  };
  message: string | null = null;
  isLoadingOk!: boolean;
  constructor(private loaderService: LoaderService) {}
  ngOnInit() {
    this.loaderMessage.subscribe((e) => {
      this.message = e;
    });
    this.isLoading.subscribe((e) => {
      console.log(e, 'loading changed');
      this.isLoadingOk = e;
      return;
    });
  }
}
