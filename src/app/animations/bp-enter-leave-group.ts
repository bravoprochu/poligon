import {
  transition,
  animation,
  trigger,
  animate,
  style,
  group,
  query,
  stagger,
} from '@angular/animations';

export function BP_ANIM_ENTER_LEAVE_GROUP(
  enterDurationTime: number,
  staggerDuration: number,
  queryElements: string = 'rect,  text, line'
) {
  return trigger('enterLeaveGroup', [
    transition(':enter, :increment', [
      query(queryElements, [
        stagger(`${staggerDuration}ms`, [
          style({ opacity: 0 }),
          animate(`${enterDurationTime}ms`, style({ opacity: '*' })),
        ]),
      ]),
    ]),
    transition(':leave, :decrement', [
      query(
        queryElements,
        stagger(`-${staggerDuration}ms`, [
          animate(`${enterDurationTime}ms`, style({ opacity: 0 })),
        ])
      ),
    ]),
  ]);
}
