import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {

  money: number = 0;

  constructor() { }

  ngOnInit() {
  }

  imgClick() {
    this.money += 1;
  }

}
