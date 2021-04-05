import {
  animate,
  animateChild,
  group,
  query,
  sequence,
  stagger,
  style,
  transition,
  trigger,
  AnimationOptions,
} from '@angular/animations';

const optional = { optional: true } as AnimationOptions;

const ANIM_LEAVE = (queryStr: string = 'section') => {
  return query(
    ':leave',
    [
      animateChild(),
      style({
        position: 'absolute',
        transform: 'translate3d(0,0,0)',
        width: '100%',
        left: 0,
        opacity: 1,
      }),
      query(
        queryStr,
        [
          stagger(100, [
            animate(
              '250ms ease-in',
              style({
                transform: 'translate3d(0, -100%, 0)',
                opacity: 0,
              })
            ),
          ]),
        ],
        optional
      ),
    ],
    optional
  );
};

const ANIM_ENTER_COMPLEX = (
  firstLevel: string = 'section',
  secondLevel = 'mat-card',
  thirdLevel = 'mat-card-title, mat-card-subtitle, p, img'
) => {
  return query(
    ':enter',
    [
      style({
        position: 'absolute',
        width: '100%',
        left: 0,
        opacity: 1,
      }),
      sequence([
        query(
          `${secondLevel}, ${thirdLevel}`,
          [
            style({
              opacity: 0,
            }),
          ],
          optional
        ),
        query(
          firstLevel,
          [
            group([
              stagger(150, [
                style({
                  position: 'relative',
                  transform: 'translate3d(0, -100%, 0)',
                  opacity: 0,
                }),
                animate(
                  '350ms ease-out',
                  style({
                    transform: 'translate3d(0, 0, 0)',
                    opacity: 1,
                  })
                ),
              ]),
            ]),
          ],
          optional
        ),

        query(
          secondLevel,
          [
            group([
              style({}),
              stagger(100, [
                style({
                  position: 'relative',
                  transform: 'translate3d(0, -25%, 0)',
                  opacity: 0,
                }),
                animate(
                  '350ms ease-in',
                  style({
                    transform: 'translate3d(0, 0, 0)',
                    opacity: 1,
                  })
                ),
              ]),
            ]),
          ],
          optional
        ),

        query(
          thirdLevel,
          [
            group([
              style({}),
              stagger(100, [
                style({
                  position: 'relative',
                  transform: 'translate3d(0, -15%, 0)',
                  opacity: 0,
                }),
                animate(
                  '250ms ease-in',
                  style({
                    transform: 'translate3d(0, 0, 0)',
                    opacity: 1,
                  })
                ),
              ]),
            ]),
          ],
          optional
        ),
      ]),
      animateChild(),
    ],
    optional
  );
};

const ANIM_ENTER_LEAVE = (
  direction = 'left',
  firstLevel = 'section',
  secondLevel = 'mat-card',
  thirdLevel = 'figure, mat-card-content, mat-h3, mat-card-title, mat-card-subtitle, p, img'
) => {
  return [
    query(
      ':enter, :leave',
      [
        style({
          position: 'relative',
          [direction]: '-200%',
          opacity: 0,
        }),
      ],
      optional
    ),
    sequence([
      ANIM_LEAVE(firstLevel),
      ANIM_ENTER_COMPLEX(firstLevel, secondLevel, thirdLevel),
    ]),
  ];
};

export const ROUTE_ANIMATIONS = trigger('routeAnimations', [
  /**
   * using default components structure to animate
   * first level - section, then mat-card, then mat-card-titles, content, imgages..
   * To specify elements to animate, just enter parameters for specify routes
   */

  transition('* => *', ANIM_ENTER_LEAVE('left')),
]);
