import {
  trigger,
  transition,
  state,
  animate,
  style,
} from '@angular/animations';

export function BP_ANIM_APPEAR_UP_DOWN(animTime: number = 250) {
  return trigger('appearUpDown', [
    transition(':enter', [
      style({
        transform: 'scaleY(0)',
        // transformOrigin: 'top',
        opacity: 0,
      }),
      animate(
        `${animTime}ms ease-in`,
        style({ transform: 'scaleY(1)', opacity: 1 })
      ),
    ]),
    transition(':leave', [
      animate(
        `${animTime * (2 / 5)}ms ease-out`,
        style({ transform: 'scaleY(0)', opacity: 0 })
      ),
    ]),
  ]);
}
