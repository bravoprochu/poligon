import {
  trigger,
  transition,
  state,
  animate,
  style,
} from '@angular/animations';

export function BP_ANIM_APPEAR_UP_DOWN(animTime = 250, animDelay = 0) {
  return trigger('appearUpDown', [
    transition(':enter', [
      style({
        transform: 'scaleY(0)',
        // transformOrigin: 'top',
        opacity: 0,
      }),
      animate(
        `${animTime}ms ${animDelay}ms ease-in`,
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
