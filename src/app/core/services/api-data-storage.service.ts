import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { IAllGameData, IUserGameData } from '../../shared/types/game-data';

@Injectable({
  providedIn: 'root'
})
export class ApiDataStorageService {

  constructor(
    private http:HttpClient
  ) { }

  getGameData(): Observable<IAllGameData>{
    return this.http.get<any>('assets/mocks/game-data.json').pipe(
      map(data => this.convertToBigInt(data))
    )
  }

  getUserGameData(): Observable<IUserGameData>{
    return this.http.get<any>('assets/mocks/user-game-data.json').pipe(
      map(data => this.convertUserDataToBigInt(data))
    )
  }

  private convertToBigInt(data: any): IAllGameData {
    return {
      ...data,
      clickerData: data.clickerData.map((item: any) => ({
        ...item,
        baseCost: BigInt(item.baseCost),
        income: BigInt(item.income)
      })),
      heroesData: data.heroesData?.map((item: any) => ({
        ...item,
        baseCost: BigInt(item.baseCost)
      }))
    };
  }

  private convertUserDataToBigInt(data: any): IUserGameData {
    return {
      ...data,
      balance: BigInt(data.balance),
      totalIncome: BigInt(data.totalIncome)
    };
  }

}
