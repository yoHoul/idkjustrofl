import { RouterModule, Routes } from '@angular/router';
import { ClickerPageComponent } from './pages/clicker-page/clicker-page.component';
import { NgModule } from '@angular/core';
import { HeroesPageComponent } from './pages/heroes-page/heroes-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'clicker-page', pathMatch: 'full' },
  { path: 'clicker-page', component: ClickerPageComponent },
  { path: 'heroes-page', component: HeroesPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
