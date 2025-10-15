import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { GameDataService } from '../../core/services/game-data.service';
import { AccordionComponent } from "../../core/components/accordion/accordion.component";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  imports: [AccordionComponent, AsyncPipe],
})
export class MainPageComponent implements OnInit {
  balance$!: Observable<number>;
  income$!: Observable<number>;

  constructor(private gameData: GameDataService) { }

  ngOnInit() {
    this.balance$ = this.gameData.balance$;
    this.income$ = this.gameData.income$;
  }

  imgClick() {
    this.gameData.incrementBalance(1);
  }

}
