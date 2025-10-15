import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAllGameData } from '../../shared/types/game-data';

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

}
