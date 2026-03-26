import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription, combineLatest, interval, map } from 'rxjs';
import { IAllGameData, IUserGameData, IClickerGameData, IUserClickerGameData } from '../../shared/types/game-data';
import { ApiDataStorageService } from './api-data-storage.service';

@Injectable({
  providedIn: 'root'
})
export class GameDataService {
  private gameDataSubject = new BehaviorSubject<IAllGameData | null>(null);
  private userDataSubject = new BehaviorSubject<IUserGameData | null>(null);

  gameData$ = this.gameDataSubject.asObservable();
  userData$ = this.userDataSubject.asObservable();
  balance$ = this.userData$.pipe(map(u => u?.balance ?? 0n));
  income$ = combineLatest([this.gameData$, this.userData$]).pipe(
    map(([gameData, userData]) => {
      if (!gameData || !userData) return 0n;
      return this.calculateTotalIncome(gameData, userData);
    })
  );
  private incomeSub?: Subscription;


  vm$ = combineLatest([this.gameData$, this.userData$]).pipe(
    map(([game, user]) => ({ game, user }))
  );

  private isLoaded = false;

  constructor(private api: ApiDataStorageService) { }

  private getClickerUps(gameData: IAllGameData): IClickerGameData[] {
    return gameData.clickerData[0]?.clickerUps ?? [];
  }

  private getUserClickerUps(userData: IUserGameData): IUserClickerGameData[] {
    return userData.clickerData[0]?.clickerUps ?? [];
  }

  loadAll(): void {
    if (this.isLoaded) return;
    
    this.api.getGameData().subscribe(data => {
      this.gameDataSubject.next(data);
    });
    this.api.getUserGameData().subscribe(data => {
      this.userDataSubject.next(data);
      this.startIncomeLoop();
    });
    
    this.isLoaded = true;
  }

  incrementBalance(delta: bigint): void {
    const current = this.userDataSubject.value;
    if (!current) return;
    this.userDataSubject.next({
      ...current,
      balance: current.balance + delta,
    });
  }

  buyUpgrade(upgradeId: number): boolean {
    const gameData = this.gameDataSubject.value;
    const userData = this.userDataSubject.value;
    
    if (!gameData || !userData) return false;
    
    const clickerUps = this.getClickerUps(gameData);
    const upgrade = clickerUps.find(u => u.id === upgradeId);
    const userClickerUps = this.getUserClickerUps(userData);
    const userUpgrade = userClickerUps.find(u => u.id === upgradeId);
    
    if (!upgrade || !userUpgrade) return false;
    
    // экспоненциальная прогрессия цен с BigInt
    const multiplier = Math.pow(upgrade.costMultiplier, userUpgrade.amount);
    const currentCost = BigInt(Math.floor(Number(upgrade.baseCost) * multiplier));
    
    if (userData.balance < currentCost) return false;
    
    const updatedClickerData: IUserGameData['clickerData'] = [
      {
        clickerUps: userClickerUps.map(u =>
          u.id === upgradeId
            ? { ...u, amount: u.amount + 1 }
            : u
        )
      },
      userData.clickerData[1]
    ];

    const newUserData = {
      ...userData,
      balance: userData.balance - currentCost,
      clickerData: updatedClickerData
    };
    
    this.userDataSubject.next(newUserData);
    return true;
  }

  getUpgradeCost(upgradeId: number): bigint {
    const gameData = this.gameDataSubject.value;
    const userData = this.userDataSubject.value;
    
    if (!gameData || !userData) return 0n;
    
    const clickerUps = this.getClickerUps(gameData);
    const upgrade = clickerUps.find(u => u.id === upgradeId);
    const userClickerUps = this.getUserClickerUps(userData);
    const userUpgrade = userClickerUps.find(u => u.id === upgradeId);
    
    if (!upgrade || !userUpgrade) return 0n;
    
    const multiplier = Math.pow(upgrade.costMultiplier, userUpgrade.amount);
    return BigInt(Math.floor(Number(upgrade.baseCost) * multiplier));
  }

  private calculateTotalIncome(gameData: IAllGameData, userData: IUserGameData): bigint {
    const clickerUps = this.getClickerUps(gameData);
    const userClickerUps = this.getUserClickerUps(userData);
    return userClickerUps.reduce((total, userUpgrade) => {
      const upgrade = clickerUps.find(u => u.id === userUpgrade.id);
      if (!upgrade) return total;
      return total + (upgrade.income * BigInt(userUpgrade.amount));
    }, 0n);
  }

  private startIncomeLoop(): void {
    if (this.incomeSub) return;
    this.incomeSub = interval(1000).subscribe(() => {
      const gameData = this.gameDataSubject.value;
      const userData = this.userDataSubject.value;
      if (!gameData || !userData) return;

      const income = this.calculateTotalIncome(gameData, userData);
      if (income !== 0n) this.incrementBalance(income);
    });
  }

  formatNumber(num: bigint): string {
    const numStr = num.toString();
    if (num < 1000n) return numStr;
    
    const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc', 'Ud', 'Dd', 'Td'];
    const tier = Math.floor((numStr.length - 1) / 3);
    const suffix = suffixes[tier] || '';
    const scale = Math.pow(10, tier * 3);
    const scaled = Number(num) / scale;
    
    if (scaled >= 100) {
      return Math.floor(scaled) + suffix;
    } else if (scaled >= 10) {
      return scaled.toFixed(1) + suffix;
    } else {
      return scaled.toFixed(2) + suffix;
    }
  }

  isUpgradeUnlocked(upgradeId: number): boolean {
    const userData = this.userDataSubject.value;
    if (!userData) return false;
    
    // первый ап всегда разблокирован
    if (upgradeId === 1) return true;
    
    // поиск предыдущего апа
    const gameData = this.gameDataSubject.value;
    if (!gameData) return false;
    
    const clickerUps = this.getClickerUps(gameData);
    const currentIndex = clickerUps.findIndex(u => u.id === upgradeId);
    if (currentIndex <= 0) return false;
    
    const previousUpgradeId = clickerUps[currentIndex - 1].id;
    const userClickerUps = this.getUserClickerUps(userData);
    const previousUserUpgrade = userClickerUps.find(u => u.id === previousUpgradeId);
    
    // предыдущий ап должен быть куплен
    return previousUserUpgrade ? previousUserUpgrade.amount > 0 : false;
  }

  getUnlockedUpgrades(): IClickerGameData[] {
    const gameData = this.gameDataSubject.value;
    const userData = this.userDataSubject.value;
    
    if (!gameData || !userData) return [];
    
    const clickerUps = this.getClickerUps(gameData);
    return clickerUps.filter(upgrade => this.isUpgradeUnlocked(upgrade.id));
  }

}
