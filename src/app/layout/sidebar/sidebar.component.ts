import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css'],
    imports: [CommonModule]
})
export class SidebarComponent {

    menuItems: any[] = [];

    constructor(private router: Router, private translate: TranslateService) {
        this.menuItems = [
            {
                label: this.translate.instant('app.sidebar.home'),
                icon: '🏠',
                route: '/dashboard/home',
                active: true
            },
            {
                label: this.translate.instant('app.sidebar.orders'),
                icon: '🛒',
                route: '/dashboard/orders',
                active: false
            },
            {
                label: this.translate.instant('app.sidebar.users'),
                icon: '👤',
                route: '/dashboard/users',
                active: false
            }
        ];
    }

    navigateTo(route: string) {
        this.router.navigate([route]);
        this.updateActiveItem(route);
    }

    private updateActiveItem(route: string) {
        this.menuItems.forEach(item => {
            item.active = item.route === route;
        });
    }
}
