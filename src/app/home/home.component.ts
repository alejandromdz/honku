import { Component, OnInit } from '@angular/core';

import {version, repository} from '../../../package.json';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  version:string;
  repoURL:string

  constructor() {
    this.version = version;
    this.repoURL = repository.url;
   }

  ngOnInit() {
    
  }

}
