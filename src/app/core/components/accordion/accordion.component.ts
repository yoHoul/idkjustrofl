import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiScrollbar } from '@taiga-ui/core';
import { IClickerGameData, IHeroesData } from '../../../shared/types/game-data';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
  imports: [TuiScrollbar, CommonModule],
})
export class AccordionComponent {
  @Input() clickerData: IClickerGameData[] = [];
  @Input() heroesData: IHeroesData[] = [];
}
