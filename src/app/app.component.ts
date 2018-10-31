import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {RouteService} from './core/route.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private router: RouteService, private translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use('en');
    router.navigate('editor');
  }
}
