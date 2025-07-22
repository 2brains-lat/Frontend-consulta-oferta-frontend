import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../components/button/button.component';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { RequestStatusAlertService } from '@verisure/services';
import { enterLeaveAlertAnimation } from '../../../animations/enterState';
import { AlertComponent } from '../../../components/alert/alert.component';

@Component({
  selector: 'verisure-next-step',
  standalone: true,
  imports: [CommonModule, ButtonComponent, AlertComponent],
  templateUrl: './next-step.component.html',
  styleUrls: ['./next-step.component.scss'],
  animations: [enterLeaveAlertAnimation],
  encapsulation: ViewEncapsulation.None,
})
export class NextStepComponent {
  @Input() ignoreBackToConsult = false;
  @Input()
  set actualLevel(number: string | number) {
    this._actualLevel = Number(number);
  }
  get actualLevel(): number {
    return this._actualLevel;
  }
  private _actualLevel = 1;
  status: { status: number; message: string } | null = null;
  @Input()
  set lastLevel(number: string | number) {
    this._lastLevel = Number(number);
  }
  get lastLevel(): number {
    return this._lastLevel;
  }
  private _lastLevel = 2;
  @Input() isDisabled = false;
  @Output() toNextStep = new EventEmitter();
  constructor(public requestStatusService: RequestStatusAlertService) {}
  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  @Output() getPdfBase64 = new EventEmitter();
  ngOnInit() {
    this.requestStatusService.requestStatus.subscribe((e) => (this.status = e));
  }
  goTo(number: number) {
    if (number < this.lastLevel + 1) {
      this.toNextStep.emit(Number(number).toString());
    }
  }
  DownloadAll() {
    this.getPdfBase64.emit();
  }
}
