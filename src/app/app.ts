import { Component, signal, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TuiSwitch, TuiTabs } from '@taiga-ui/kit';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [
    RouterModule,
    RouterOutlet,
    FormsModule,
    TuiTabs,
    TuiSwitch,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('troveClicker');

  private subscription?: Subscription;
  isDark!: boolean;

  constructor() {}

  ngOnInit() {
    this.isDark = true;
    this.changeTheme(true);
  }

  changeTheme(isDark: boolean) {
    const link = document.getElementById('app-theme') as HTMLLinkElement | null;
    if (link) link.href = isDark ? 'assets/themes/dark.css' : 'assets/themes/light.css';
  }
}
