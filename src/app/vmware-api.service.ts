import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VmwareApiService {

  private API_SERVER = "/vmware"; // ← Spring Boot proxy, not VMware directly

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

  // ← no more Basic auth — JWT interceptor handles Authorization automatically
  private get headers(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  getVmList(): Observable<any> {
    return this.httpClient.get(this.API_SERVER + "/vms", { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  getVmById(id: string): Observable<any> {
    return this.httpClient.get(this.API_SERVER + "/vms/" + id, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  addVm(nom: string, template_vm_id: string): Observable<any> {
    const body = { name: nom, parentId: template_vm_id };
    return this.httpClient.post(this.API_SERVER + "/vms", body, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  updateVm(id: string, cpu: number, ram: number): Observable<any> {
    const body = { processors: cpu, memory: ram };
    return this.httpClient.put(this.API_SERVER + "/vms/" + id, body, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  deleteVm(id: string): Observable<any> {
    return this.httpClient.delete(this.API_SERVER + "/vms/" + id, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  powerVmOn(id: string): Observable<any> {
    return this.httpClient.put(this.API_SERVER + "/vms/" + id + "/power", "on", { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  powerVmOff(id: string): Observable<any> {
    return this.httpClient.put(this.API_SERVER + "/vms/" + id + "/power", "off", { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  getVmPowerState(id: string): Observable<any> {
    return this.httpClient.get(this.API_SERVER + "/vms/" + id + "/power", { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  getVmIp(id: string): Observable<any> {
    return this.httpClient.get(this.API_SERVER + "/vms/" + id + "/ip", { headers: this.headers })
      .pipe(catchError(this.handleError));
  }
}