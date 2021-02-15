import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuNavComponent } from './menu-nav/menu-nav.component';
import { MenuService } from './menu.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

const IMPORT_EXPORT_MODULES = [
  FlexLayoutModule,
  ReactiveFormsModule,
  MatButtonModule,
  MatChipsModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatTooltipModule,
  RouterModule,
];

@NgModule({
  declarations: [MenuNavComponent],
  imports: [CommonModule, IMPORT_EXPORT_MODULES],
  exports: [MenuNavComponent, IMPORT_EXPORT_MODULES],
  providers: [MenuService],
})
export class MenuModule {}
