import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiScrollbar } from '@taiga-ui/core';
import { IClickerGameData, IHeroesData } from '../../../shared/types/game-data';
import { GameDataService } from '../../services/game-data.service';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
  imports: [TuiScrollbar, CommonModule],
})
export class AccordionComponent {
  @Input() clickerData: IClickerGameData[] = [];
  @Input() heroesData: IHeroesData[] = [];

  constructor(private gameData: GameDataService) {}

  buyUpgrade(upgradeId: number): void {
    this.gameData.buyUpgrade(upgradeId);
  }

  getUpgradeCost(upgradeId: number): bigint {
    return this.gameData.getUpgradeCost(upgradeId);
  }

  formatNumber(num: bigint): string {
    return this.gameData.formatNumber(num);
  }
}
