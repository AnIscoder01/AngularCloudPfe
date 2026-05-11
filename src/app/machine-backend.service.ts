import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Machine } from './machine';

@Injectable({
  providedIn: 'root'
})
export class MachineBackendService {

  private API_SERVER = ""; 

  constructor(private httpClient: HttpClient) { }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown Error.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => errorMessage);
  }

  // ✅ ALL MACHINES
getAllMachines(): Observable<Machine[]> {
  return this.httpClient.get<Machine[]>(this.API_SERVER + "/api/machines")  // ← no trailing slash
    .pipe(catchError(this.handleError));
}

  // ✅ COUNT MACHINES  ⭐ FIXED
  getMachinesNumber(): Observable<number> {
    return this.httpClient.get<number>(this.API_SERVER + "/api/nbrmachines")
      .pipe(catchError(this.handleError));
  }

  // (optional but good)
  getMachineById(id: string): Observable<Machine> {
    return this.httpClient.get<Machine>(this.API_SERVER + "/api/machines/" + id)
      .pipe(catchError(this.handleError));
  }

  getMyMachines(): Observable<any[]> {
  return this.httpClient.get<any[]>(this.API_SERVER + "/api/machines/my")
    .pipe(catchError(this.handleError));
}

  addMachine(machine: Machine): Observable<any> {
    return this.httpClient.post(this.API_SERVER + "/api/machines", machine)
      .pipe(catchError(this.handleError));
  }
}