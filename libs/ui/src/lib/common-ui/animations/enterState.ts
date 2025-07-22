import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const enterStateAnimation = trigger('enterState', [
  state(
    'void',
    style({
      transform: 'translateY(60px)',
      opacity: 0,
    })
  ),
  transition(':enter', [
    animate(
      300,
      style({
        transform: 'translateX(0)',
        opacity: 1,
      })
    ),
  ]),
]);
export const enterLeaveAlertAnimation = trigger('alertAnimation', [
  state(
    'void',
    style({
      opacity: 0,
    })
  ),
  transition(':enter', [
    style({ opacity: 0 }),
    animate(
      600,
      style({
        opacity: 1,
      })
    ),
  ]),
  transition(':leave', [
    style({ opacity: 1 }),
    animate(
      300,
      style({
        opacity: 0,
      })
    ),
  ]),
]);
export const opacityAnimation = trigger('opacityAnimation', [
  state(
    'void',
    style({
      opacity: 0,
    })
  ),
  transition(':enter', [
    style({ opacity: 0.4 }),
    animate(
      100,
      style({
        opacity: 1,
      })
    ),
  ]),
  transition(':leave', [
    style({ opacity: 1 }),
    animate(
      50,
      style({
        opacity: 0,
      })
    ),
  ]),
]);
