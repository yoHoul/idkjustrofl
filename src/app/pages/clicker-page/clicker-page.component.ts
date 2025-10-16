import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { GameDataService } from '../../core/services/game-data.service';
import { AccordionComponent } from "../../core/components/accordion/accordion.component";
import { IAllGameData, IClickerGameData, IHeroesData } from '../../shared/types/game-data';

@Component({
  selector: 'app-clicker-page',
  templateUrl: './clicker-page.component.html',
  styleUrls: ['./clicker-page.component.scss'],
  imports: [AccordionComponent, AsyncPipe],
})
export class ClickerPageComponent implements OnInit {
  balance$!: Observable<number>;
  income$!: Observable<number>;
  gameData$!: Observable<IAllGameData | null>;
  clickerData: IClickerGameData[] = [];
  heroesData: IHeroesData[] = [];

  constructor(private gameData: GameDataService) { }

  ngOnInit() {
    this.balance$ = this.gameData.balance$;
    this.income$ = this.gameData.income$;
    this.gameData$ = this.gameData.gameData$;
    
    this.gameData.loadAll();
    
    this.gameData$.subscribe(data => {
      if (data) {
        this.clickerData = data.clickerData;
        this.heroesData = data.heroesData || [];
      }
    });
  }

  imgClick() {
    this.gameData.incrementBalance(1);
  }

  formatNumber(num: number): string {
    return this.gameData.formatNumber(num);
  }

}
