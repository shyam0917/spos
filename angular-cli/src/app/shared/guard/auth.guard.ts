import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { Router } from "@angular/router";
import { VerifyService } from "../../auth/verify-service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private verifyService: VerifyService) {}

  canActivate() {
    if (localStorage.getItem("access_token")) {
      this.verifyToken();
    }

    if (localStorage.getItem("isLoggedin")) {
      return true;
    }

    this.router.navigate(["/login"]);
    return false;
  }

  verifyToken() {
    this.verifyService.verify().then((data: any) => {
      console.log("token verification", data);
      if (data.verifytoken == true) {
        if (data.refreshToken) {
          localStorage.setItem("access_token", data.refreshToken);
        }
      } else {
        localStorage.clear();
        this.router.navigate(["/login"]);
        console.log("token verification", data);
      }
    });
  }
}
