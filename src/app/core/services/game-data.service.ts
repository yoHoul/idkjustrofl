import { Injectable } from '@angular/core';
import { IAllGameData } from '../../shared/types/game-data';

@Injectable({
  providedIn: 'root'
})
export class GameDataService {

  gameData: IAllGameData[] = []

  constructor() { }

  setGameData() {

  }

}
