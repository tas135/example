import { Component, OnInit } from '@angular/core';
import { SessionsApi } from '../../services/sessions-api.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Bugdetail } from '../../services/bugdetail.model';
import { CookieService } from 'ngx-cookie-service';
import { DomSanitizer } from '@angular/platform-browser';
import { PlatformLocation, LocationStrategy } from '@angular/common'
import * as $ from 'jquery';
import { DeviceDetectorService } from 'ngx-device-detector';
import { filter } from 'rxjs/operators'

@Component({
  selector: 'app-bug',
  templateUrl: './bug.component.html',
  styleUrls: ['./bug.component.css']
})
export class BugComponent implements OnInit {

  // Nickname and SessionName from UserComponent
  public UserVoteDetail = {
    "BugID": 1,
    "Nickname": "",
    "SessionID": 0,
    "Rating": 0,
  };
  public bugName: string
  public ImagePath: string
  public Bio: string
  // Check for live status
  public live: boolean
  // Get total number
  public totalBug: number
  // Get device info 
  deviceInfo = null;




  constructor(private SessionsApi: SessionsApi, private router: Router, private cookieService: CookieService,
    private activeRoute: ActivatedRoute, private doms: DomSanitizer,private location: LocationStrategy, private deviceService: DeviceDetectorService) {
    // preventing back button in browser
    history.pushState(null, null, window.location.href);
    this.location.onPopState(() => {
      history.pushState(null, null, window.location.href);
    });
  }


  ngOnInit() {
    // Check device, can style according to device, not using right now
    const isDesktopDevice = this.deviceService.isDesktop();
    const isMobile = this.deviceService.isMobile();
    // Subscribe components to route 
    const routeParams = this.activeRoute.snapshot.params;
    this.UserVoteDetail.BugID = routeParams.id
    // Fetch all the data from API
    this.fetchData()
    // Fix Refreshing issue 
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      console.log('here')
      this.fetchData();
    });
    window.onbeforeunload = () => this.ngOnInit();
  }

  fetchData(){
    // Get total number of bugs 
    this.SessionsApi.getTotalBug().subscribe(
      (res) => {
        this.totalBug = res
      }
    )
    // Get bug detail to display
    this.SessionsApi.getBug(this.UserVoteDetail.BugID).subscribe(
      (res) => {
        this.ImagePath = res.ImagePath;
        this.bugName = res.BugName;
        this.Bio = res.Bio;
      }
    )
    // Update Users Detail to UserVoteDetail
    this.SessionsApi.currentUser.subscribe(mes => {
      // this.UserDetail = mes;
      this.UserVoteDetail.Nickname = this.cookieService.get('User')
      // console.log(parseInt(this.cookieService.get('SessionID')))
      this.UserVoteDetail.SessionID = parseInt(this.cookieService.get('SessionID'))
    }
    )

    // Get Live Status
    this.SessionsApi.checkStatus().subscribe(
      (res) => {
        // console.log("Live Status in OnIt",res)
        this.live = res.LiveStatus
      }
    )
  }
  // Update rating value 
  updateRating(rating: number) {
    this.UserVoteDetail.Rating = rating
    console.log(this.UserVoteDetail.Rating)
    $("#submit").attr("disabled", false)
  }



  userVote() {
    //Check for live status from API, need polling
    this.SessionsApi.checkStatus().subscribe(
      (res) => {
        console.log(res)
        this.live = res.LiveStatus
      }
    )

    // If session is Live:
    if (this.live) {
      // Change button colour when on click 
      if (this.UserVoteDetail.Rating == 1) {
        $('#one').css({ 'background-image': ' color.png' })
      }
      else if (this.UserVoteDetail.Rating == 2) {
        $('#one').css({ 'background-image': ' color.png' })
        $('#two').css({ 'background-image': ' color.png' })
      }
      else if (this.UserVoteDetail.Rating == 3) {
        $('#one').css({ 'background-image': ' color.png' })
        $('#two').css({ 'background-image': ' color.png' })
        $('#three').css({ 'background-image': ' color.png' })
      }
      else if (this.UserVoteDetail.Rating == 4) {
        $('#one').css({ 'background-image': ' color.png' })
        $('#two').css({ 'background-image': ' color.png' })
        $('#three').css({ 'background-image': ' color.png' })
        $('#four').css({ 'background-image': ' color.png' })

      }
      else {
        $('#one').css({ 'background-image': ' color.png' })
        $('#two').css({ 'background-image': ' color.png' })
        $('#three').css({ 'background-image': ' color.png' })
        $('#four').css({ 'background-image': ' color.png' })
        $('#five').css({ 'background-image': ' color.png' })
      }


      console.log(this.UserVoteDetail);
      // Post User's Rating
      this.SessionsApi.postBug(this.UserVoteDetail)
        .subscribe(
          // If User's Rating is successful 
          (res) => {
            console.log(res)
            // Reset Rating to default value =1
            this.UserVoteDetail.Rating = 1
            $('#fakebutton').click()

            if (this.UserVoteDetail.BugID < this.totalBug) {
              this.UserVoteDetail.BugID++;
              // Get next Bug Information

              // this.ratingmodel = null;
              this.SessionsApi.getBug(this.UserVoteDetail.BugID).subscribe(
                (res) => {
                  // this.cookieService.set( 'ID',this.UserVoteDetail.BugID.toString());
                  // fw: Check whether route is safe only navigate
                  this.router.navigate([this.UserVoteDetail.BugID])
                  this.ImagePath = res.ImagePath;
                  this.bugName = res.BugName;
                  this.Bio = res.Bio;
                  //$("#submit").attr("disabled", true)
                },
                (error) => {
                  // If BugID is out of range
                  if (error.status == 400) {
                    alert('BugID is out of range.')
                  }
                }
              )
            }
            else {
              this.router.navigate(['/end'])
            }

          },
          // Fail to Post User Rating 
          (error) => {
            // Not Implemented: If User press back button, bug rating can't be edited 
            // if (error.status == 403){
            //   console.log(error.error)
            //   this.SessionsApi.putBug(this.UserVoteDetail).subscribe(
            //     (res)=>{
            //       console.log(res)
            //     }
            //   )
            // }
            console.log(error.error)
          }
        )

    }
    else {
      // If session is not live, stay at same page
      this.router.navigate([this.UserVoteDetail.BugID])
    }
  }


  imageClick(rating: number) {
    this.UserVoteDetail.Rating = rating
    //Check for live status from API, fw:do polling
    this.SessionsApi.checkStatus().subscribe(
      (res) => {
        console.log(res)
        this.live = res.LiveStatus
      }
    )

    // If session is Live:
    if (this.live) {
      // Change button colour when on click 
      if (this.UserVoteDetail.Rating == 1) {
        $('#one').css({ 'background-image': 'url(../../../assets/color.PNG)' })
      }
      else if (this.UserVoteDetail.Rating == 2) {
        $('#one').css({ 'background-image': 'url(../../../assets/color.PNG)' })
        $('#two').css({ 'background-image': 'url(../../../assets/color.PNG)' })
      }
      else if (this.UserVoteDetail.Rating == 3) {
        $('#one').css({ 'background-image': 'url(../../../assets/color.PNG)' })
        $('#two').css({ 'background-image': 'url(../../../assets/color.PNG)' })
        $('#three').css({ 'background-image': 'url(../../../assets/color.PNG)' })
      }
      else if (this.UserVoteDetail.Rating == 4) {
        $('#one').css({ 'background-image': 'url(../../../assets/color.PNG)' })
        $('#two').css({ 'background-image': 'url(../../../assets/color.PNG)' })
        $('#three').css({ 'background-image': 'url(../../../assets/color.PNG)' })
        $('#four').css({ 'background-image': 'url(../../../assets/color.PNG)' })

      }
      else {
        $('#one').css({ 'background-image': 'url(../../../assets/color.PNG)' })
        $('#two').css({ 'background-image': 'url(../../../assets/color.PNG)' })
        $('#three').css({ 'background-image': 'url(../../../assets/color.PNG)' })
        $('#four').css({ 'background-image': 'url(../../../assets/color.PNG)' })
        $('#five').css({ 'background-image': 'url(../../../assets/color.PNG)' })
      }


      console.log(this.UserVoteDetail);
      // Post User's Rating
      this.SessionsApi.postBug(this.UserVoteDetail)
        .subscribe(
          // If User's Rating is successful 
          (res) => {
            console.log(res)
            // change back to original button colour
            if (this.UserVoteDetail.Rating == 1) {
              $('#one').css({ 'background-image': 'url(../../../assets/black.PNG)' })
            }
            else if (this.UserVoteDetail.Rating == 2) {
              $('#one').css({ 'background-image': 'url(../../../assets/black.PNG)' })
              $('#two').css({ 'background-image': 'url(../../../assets/black.PNG)' })
            }
            else if (this.UserVoteDetail.Rating == 3) {
              $('#one').css({ 'background-image': 'url(../../../assets/black.PNG)' })
              $('#two').css({ 'background-image': 'url(../../../assets/black.PNG)' })
              $('#three').css({ 'background-image': 'url(../../../assets/black.PNG)' })
            }
            else if (this.UserVoteDetail.Rating == 4) {
              $('#one').css({ 'background-image': 'url(../../../assets/black.PNG)' })
              $('#two').css({ 'background-image': 'url(../../../assets/black.PNG)' })
              $('#three').css({ 'background-image': 'url(../../../assets/black.PNG)' })
              $('#four').css({ 'background-image': 'url(../../../assets/black.PNG)' })
      
            }
            else {
              $('#one').css({ 'background-image': 'url(../../../assets/black.PNG)' })
              $('#two').css({ 'background-image': 'url(../../../assets/black.PNG)' })
              $('#three').css({ 'background-image': 'url(../../../assets/black.PNG)' })
              $('#four').css({ 'background-image': 'url(../../../assets/black.PNG)' })
              $('#five').css({ 'background-image': 'url(../../../assets/black.PNG)' })
            }

            if (this.UserVoteDetail.BugID < this.totalBug) {
              this.UserVoteDetail.BugID++;
              // Get next Bug Information

              this.SessionsApi.getBug(this.UserVoteDetail.BugID).subscribe(
                (res) => {
                  // fw: Check whether route is safe only navigate
                  this.router.navigate([this.UserVoteDetail.BugID])
                  this.ImagePath = res.ImagePath;
                  this.bugName = res.BugName;
                  this.Bio = res.Bio;
                  $("#submit").attr("disabled", true)
                },
                (error) => {
                  // If BugID is out of range
                  if (error.status == 400) {
                    alert('BugID is out of range.')
                  }
                }
              )
            }
            else {
              this.router.navigate(['/end'])
            }

          },
          // Fail to Post User Rating 
          (error) => {

            if (error.status == 403){
              console.log(error.error)
              this.SessionsApi.putBug(this.UserVoteDetail).subscribe(
                (res)=>{
                  console.log(res)
                }
              )
            }
            console.log(error.error)
          }
        )

    }
    else {
      // If session is not live, stay at same page
      this.router.navigate([this.UserVoteDetail.BugID])
    }

  }


}
