import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';
import { AppRoutingModule }     from './app-routing.module';

import { AppComponent }         from './app.component';
import { HonkuComponent } from './honku/honku.component';
import { PhaserModule } from 'phaser-component-library';
import { HomeComponent } from './home/home.component';



@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'honkku' }),
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    PhaserModule
  ],
  declarations: [
    AppComponent,
    HonkuComponent,
    HomeComponent
  ],
  providers: [  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
  constructor(
  ){}
}
