import {
  Component,
  ContentChild,
  Input,
  OnInit,
  TemplateRef,
} from '@angular/core';

@Component({
  selector: 'app-basic-virtual-scroll-viewport',
  templateUrl: './basic-virtual-scroll-viewport.component.html',
  styleUrls: ['./basic-virtual-scroll-viewport.component.scss'],
})
export class BasicVirtualScrollViewportComponent<T> implements OnInit {
  @Input('data') data!: T[];
  @Input('itemHeight') itemHeight = 150;
  @Input('itemsToDisplay') itemsToDisplay = 3;

  @ContentChild('viewport', { static: false })
  viewportRef!: TemplateRef<any>;

  constructor() {}

  ngOnInit(): void {}
}
