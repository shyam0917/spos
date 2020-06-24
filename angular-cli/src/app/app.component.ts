import { IdealTimeService } from "./ideal-time.service";
import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Spinkit } from "ng-http-loader";
import { GlobalServiceService } from "./auth/global-service.service";
import { Idle, DEFAULT_INTERRUPTSOURCES } from "@ng-idle/core";
import { Keepalive } from "@ng-idle/keepalive";
import { RouterModule, Routes } from "@angular/router";
import { Router } from "@angular/router";
// import { SpinnerVisibilityService } from 'ng-http-loader/services/spinner-visibility.service';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  public spinkit = Spinkit;
  spinnerBoolean = true;
  idleState = "Not started.";
  timedOut = false;
  lastPing?: Date = null;
  title = "angular-idle-timeout";

  constructor(
    private IdealTimeService: IdealTimeService,
    private idle: Idle,
    private router: Router,
    private keepalive: Keepalive,
    private translate: TranslateService,
    public globalService: GlobalServiceService // private spinner: SpinnerVisibilityService
  ) {
    this.globalService.currentSpinnerFlag.subscribe(data => {
      this.spinnerBoolean = data;
    });
    // spinner.visibilitySubject.next(false);

    translate.addLangs(["en", "fr", "ur", "es", "it", "fa"]);
    translate.setDefaultLang("en");
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr|ur|es|it|fa/) ? browserLang : "en");
    idle.setIdle(60 * 18);
    idle.setTimeout(2);
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => {
      this.idleState = "No longer idle.";
      this.reset();
    });

    idle.onTimeout.subscribe(() => {
      this.idleState = "Timed out!";
      this.timedOut = true;
      localStorage.clear();
      this.router.navigate(["/login"]);
    });

    idle.onIdleStart.subscribe(() => {
      this.idleState = "You've gone idle!";
      // this.childModal.show();
    });

    idle.onTimeoutWarning.subscribe(countdown => {
      this.idleState = "You will time out in " + countdown + " seconds!";
    });

    // sets the ping interval to 15 seconds
    keepalive.interval(15);

    keepalive.onPing.subscribe(() => (this.lastPing = new Date()));

    this.reset();
    this.IdealTimeService.getUserLoggedIn().subscribe(userLoggedIn => {
      if (userLoggedIn) {
        idle.watch();
        this.timedOut = false;
      } else {
        idle.stop();
      }
    });

    // this.reset();
  }

  reset() {
    this.idle.watch();
    this.idleState = "Started.";
    this.timedOut = false;
  }
}
