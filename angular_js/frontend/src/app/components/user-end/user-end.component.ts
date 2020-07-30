import { Component, OnInit } from '@angular/core';
import { PlatformLocation } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router';
import { LocationStrategy } from '@angular/common';

@Component({
  selector: 'app-user-end',
  templateUrl: './user-end.component.html',
  styleUrls: ['./user-end.component.css']
})
export class UserEndComponent implements OnInit {

  constructor(private router: Router, private location: LocationStrategy) {

    // preventing back button in browser
    history.pushState(null, null, window.location.href);
    this.location.onPopState(() => {
      history.pushState(null, null, window.location.href);
    });
  }

  ngOnInit() {
    this.router.navigate(['/end'])
  }

}
