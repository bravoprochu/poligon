import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { LoginService } from 'otherModules/ident/services/login.service';
import { IndicatorsService } from 'otherModules/indicators/indicators.service';

@Component({
  selector: 'app-ident-auth',
  templateUrl: './ident-auth.component.html',
  styleUrls: ['./ident-auth.component.scss'],
})
export class IdentAuthComponent implements OnInit {
  constructor(
    private loginService: LoginService,
    private indicatorsSrv: IndicatorsService
  ) {}

  ngOnInit(): void {}

  get isInProgress$(): Subject<boolean> {
    return this.indicatorsSrv.isInProgress$;
  }
}
