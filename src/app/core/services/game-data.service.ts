import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription, combineLatest, interval, map } from 'rxjs';
import { IAllGameData, IUserGameData } from '../../shared/types/game-data';
import { ApiDataStorageService } from './api-data-storage.service';

@Injectable({
  providedIn: 'root'
})
export class GameDataService {
  private gameDataSubject = new BehaviorSubject<IAllGameData | null>(null);
  private userDataSubject = new BehaviorSubject<IUserGameData | null>(null);

  gameData$ = this.gameDataSubject.asObservable();
  userData$ = this.userDataSubject.asObservable();
  balance$ = this.userData$.pipe(map(u => u?.balance ?? 0));
  income$ = this.userData$.pipe(map(u => u?.totalIncome ?? 0));
  private incomeSub?: Subscription;


  vm$ = combineLatest([this.gameData$, this.userData$]).pipe(
    map(([game, user]) => ({ game, user }))
  );

  constructor(private api: ApiDataStorageService) { }

  loadAll(): void {
    this.api.getGameData().subscribe(data => this.gameDataSubject.next(data));
    this.api.getUserGameData().subscribe(data => {
      this.userDataSubject.next(data);
      this.startIncomeLoop();
    });
  }

  incrementBalance(delta: number): void {
    const current = this.userDataSubject.value;
    if (!current) return;
    this.userDataSubject.next({
      ...current,
      balance: current.balance + delta,
    });
  }

  // клик всегда прибавляет 1
  addClick(): void {
    this.incrementBalance(1);
  }

  private startIncomeLoop(): void {
    if (this.incomeSub) return;
    this.incomeSub = interval(1000).subscribe(() => {
      const u = this.userDataSubject.value;
      if (!u) return;
      if (u.totalIncome && u.totalIncome !== 0) {
        this.incrementBalance(u.totalIncome);
      }
    });
  }

}
