import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VmwareApiService {

  private API_SERVER = "/vmware";

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

  private get jsonHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  private get textHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'text/plain',
      'Accept': 'application/json'
    });
  }

  getVmList(): Observable<any> {
    return this.httpClient.get(this.API_SERVER + "/vms", { headers: this.jsonHeaders })
      .pipe(catchError(this.handleError));
  }

  getVmById(id: string): Observable<any> {
    return this.httpClient.get(this.API_SERVER + "/vms/" + id, { headers: this.jsonHeaders })
      .pipe(catchError(this.handleError));
  }

  addVm(nom: string, template_vm_id: string): Observable<any> {
    const body = { name: nom, parentId: template_vm_id };
    return this.httpClient.post(this.API_SERVER + "/vms", body, { headers: this.jsonHeaders })
      .pipe(catchError(this.handleError));
  }

  updateVm(id: string, cpu: number, ram: number): Observable<any> {
    const body = { processors: cpu, memory: ram };
    return this.httpClient.put(this.API_SERVER + "/vms/" + id, body, { headers: this.jsonHeaders })
      .pipe(catchError(this.handleError));
  }

  deleteVm(id: string): Observable<any> {
    return this.httpClient.delete(this.API_SERVER + "/vms/" + id, { headers: this.jsonHeaders })
      .pipe(catchError(this.handleError));
  }

  // ← plain text to avoid quotes around "on"/"off"
  powerVmOn(id: string): Observable<any> {
    return this.httpClient.put(
      this.API_SERVER + "/vms/" + id + "/power",
      "on",
      { headers: this.textHeaders }
    ).pipe(catchError(this.handleError));
  }

  powerVmOff(id: string): Observable<any> {
    return this.httpClient.put(
      this.API_SERVER + "/vms/" + id + "/power",
      "off",
      { headers: this.textHeaders }
    ).pipe(catchError(this.handleError));
  }

  getVmPowerState(id: string): Observable<any> {
    return this.httpClient.get(this.API_SERVER + "/vms/" + id + "/power", { headers: this.jsonHeaders })
      .pipe(catchError(this.handleError));
  }

  getVmIp(id: string): Observable<any> {
    return this.httpClient.get(this.API_SERVER + "/vms/" + id + "/ip", { headers: this.jsonHeaders })
      .pipe(catchError(this.handleError));
  }
}