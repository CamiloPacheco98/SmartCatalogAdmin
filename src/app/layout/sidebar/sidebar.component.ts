import { Component, HostListener, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { filter, Subscription } from 'rxjs';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css'],
    standalone: true,
    imports: [CommonModule]
})
export class SidebarComponent implements OnInit, OnDestroy {

    menuItems: any[] = [];
    isMobileOpen = false;
    isMobile = false;
    isMediumScreen = false;
    private routerSubscription?: Subscription;

    constructor(
        private router: Router,
        private translate: TranslateService,
        private elementRef: ElementRef
    ) {
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

    ngOnInit() {
        this.checkScreenSize();
        this.updateActiveItem(this.router.url);

        // Listen to route changes to update active state
        this.routerSubscription = this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe((event: any) => {
                this.updateActiveItem(event.url);
            });
    }

    ngOnDestroy() {
        if (this.routerSubscription) {
            this.routerSubscription.unsubscribe();
        }
    }

    @HostListener('window:resize')
    onResize() {
        this.checkScreenSize();
        // Close mobile sidebar when resizing to desktop
        if (!this.isMobile && this.isMobileOpen) {
            this.isMobileOpen = false;
        }
    }

    @HostListener('document:click', ['$event'])
    onClickOutside(event: Event) {
        // Close sidebar when clicking outside on mobile
        if (this.isMobile && this.isMobileOpen) {
            const target = event.target as HTMLElement;
            const sidebar = this.elementRef.nativeElement.querySelector('.sidebar');
            const hamburger = this.elementRef.nativeElement.querySelector('.hamburger-menu');
            
            if (sidebar && !sidebar.contains(target) && !hamburger?.contains(target)) {
                this.closeSidebar();
            }
        }
    }

    @HostListener('document:keydown', ['$event'])
    onEscapeKey(event: KeyboardEvent) {
        if (event.key === 'Escape' && this.isMobile && this.isMobileOpen) {
            this.closeSidebar();
        }
    }

    checkScreenSize() {
        const width = window.innerWidth;
        this.isMobile = width < 768;
        this.isMediumScreen = width >= 768 && width < 1024;
    }

    toggleSidebar() {
        if (this.isMobile) {
            this.isMobileOpen = !this.isMobileOpen;
        }
    }

    closeSidebar() {
        if (this.isMobile) {
            this.isMobileOpen = false;
        }
    }

    navigateTo(route: string) {
        this.router.navigate([route]);
        this.updateActiveItem(route);
        
        // Close sidebar on mobile after navigation
        if (this.isMobile) {
            this.closeSidebar();
        }
    }

    private updateActiveItem(route: string) {
        this.menuItems.forEach(item => {
            item.active = route.includes(item.route) || route === item.route;
        });
    }
}
