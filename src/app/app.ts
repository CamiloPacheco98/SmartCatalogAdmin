import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  TranslateService,
  TranslatePipe,
} from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TranslatePipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(translate: TranslateService) {
    const browserLang = navigator.language.split('-')[0];
    translate.addLangs(['en', 'es']);
    translate.setFallbackLang('es');
    translate.use(browserLang.match(/en|es/) ? browserLang : 'es');
  }
}
