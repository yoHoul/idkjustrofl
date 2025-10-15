import { Component, OnInit } from '@angular/core';
import { AccordionComponent } from "../../core/components/accordion/accordion.component";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  imports: [AccordionComponent],
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
