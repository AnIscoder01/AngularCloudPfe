import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VmwareApiService {

  private API_SERVER = "/api";

  constructor(private httpClient: HttpClient) { }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown Error.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

  private get vmwareHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/vnd.vmware.vmw.rest-v1+json',
      'Accept': 'application/vnd.vmware.vmw.rest-v1+json',
      'Authorization': 'Basic ' + btoa('root:Admin@123456')
    });
  }

  getVmList(): Observable<any> {
    return this.httpClient.get(this.API_SERVER + "/vms", { headers: this.vmwareHeaders })
      .pipe(catchError(this.handleError));
  }

  getVmById(id: string): Observable<any> {
    return this.httpClient.get(this.API_SERVER + "/vms/" + id, { headers: this.vmwareHeaders })
      .pipe(catchError(this.handleError));
  }

  addVm(nom: string, template_vm_id: string) {
    const body = { "name": nom, "parentId": template_vm_id };
    return this.httpClient.post(this.API_SERVER + "/vms", body, { headers: this.vmwareHeaders })
      .pipe(catchError(this.handleError));
  }

  updateVm(id: string, cpu: number, ram: number) {
    const body = { "processors": cpu, "memory": ram };
    return this.httpClient.put(this.API_SERVER + "/vms/" + id, body, { headers: this.vmwareHeaders })
      .pipe(catchError(this.handleError));
  }

  deleteVm(id: string) {
    return this.httpClient.delete(this.API_SERVER + "/vms/" + id, { headers: this.vmwareHeaders })
      .pipe(catchError(this.handleError));
  }

  powerVmOn(id: string) {
    return this.httpClient.put(this.API_SERVER + "/vms/" + id + "/power", "on", { headers: this.vmwareHeaders })
      .pipe(catchError(this.handleError));
  }

  powerVmOff(id: string) {
    return this.httpClient.put(this.API_SERVER + "/vms/" + id + "/power", "off", { headers: this.vmwareHeaders })
      .pipe(catchError(this.handleError));
  }

  getVmPowerState(id: string) {
    return this.httpClient.get(this.API_SERVER + "/vms/" + id + "/power", { headers: this.vmwareHeaders })
      .pipe(catchError(this.handleError));
  }

  getVmIp(id: string): Observable<any> {
    return this.httpClient.get(this.API_SERVER + "/vms/" + id + "/ip", { headers: this.vmwareHeaders })
      .pipe(catchError(this.handleError));
  }
}