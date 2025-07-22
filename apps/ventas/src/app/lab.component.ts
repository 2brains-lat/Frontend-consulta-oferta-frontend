import { Component } from '@angular/core';
import { KituiLabComponent } from '@verisure/ui';

@Component({
  selector: 'verisure-nx-welcome',
  template: `<verisure-kitui-lab></verisure-kitui-lab>`,
  imports: [KituiLabComponent],
  standalone: true,
  styles: [],
})
export class LabComponent {
  // constructor(): void {}
}
