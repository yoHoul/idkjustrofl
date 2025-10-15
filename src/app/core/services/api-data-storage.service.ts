import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAllGameData, IUserGameData } from '../../shared/types/game-data';

@Injectable({
  providedIn: 'root'
})
export class ApiDataStorageService {

  constructor(
    private http:HttpClient
  ) { }

  getGameData(): Observable<IAllGameData>{
    return this.http.get<IAllGameData>('assets/mocks/game-data.json')
  }

  getUserGameData(): Observable<IUserGameData>{
    return this.http.get<IUserGameData>('assets/mocks/user-game-data.json')
  }

}
