import { Component, ViewContainerRef, HostListener } from '@angular/core';

import { GlobalState } from './global.state';
import { BaImageLoaderService, BaThemePreloader, BaThemeSpinner } from './theme/services';
import { BaThemeConfig } from './theme/theme.config';
import { layoutPaths } from './theme/theme.constants';

import 'style-loader!./app.scss';
import 'style-loader!./theme/initial.scss';
// import "primeng/resources/themes/omega/theme.css";
// import "primeng/resources/primeng.min.css"
/*
 * App Component
 * Top Level Component
 */
@Component({

  selector: 'app',
  template: `
    <main [ngClass]="{'menu-collapsed': isMenuCollapsed}" baThemeRun>
      <div class="additional-bg"></div>
      <router-outlet></router-outlet>
    </main>
  `
})
export class App {

  isMenuCollapsed: boolean = false;

  constructor(private _state: GlobalState,
              private _imageLoader: BaImageLoaderService,
              private _spinner: BaThemeSpinner,
              private viewContainerRef: ViewContainerRef,
              private themeConfig: BaThemeConfig) {

    themeConfig.config();

    this._loadImages();

    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });
    // window.onbeforeunload = function(e)
    // {
    //     localStorage.removeItem('user');
    //     localStorage.removeItem('access_token');
    // };
    // window.onunload = function(e)
    // {
    //       localStorage.removeItem('user');
    //       localStorage.removeItem('access_token');
    // };
  }

  public ngAfterViewInit(): void {
    // hide spinner once all loaders are completed
    BaThemePreloader.load().then((values) => {
      this._spinner.hide();
    });
  }

  private _loadImages(): void {
    // register some loaders
    BaThemePreloader.registerLoader(this._imageLoader.load(layoutPaths.images.root + 'sky-bg.jpg'));
  }
// @HostListener('window:beforeunload', [ '$event' ])
//   beforeUnloadHander(event) {
//     localStorage.removeItem('user');
//         localStorage.removeItem('access_token');
//   }
//    @HostListener('window:unload', [ '$event' ])
//   unloadHandler(event) {
//    localStorage.removeItem('user');
//         localStorage.removeItem('access_token');
//   }
}
