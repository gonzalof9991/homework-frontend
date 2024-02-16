import {Injectable, signal} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  public status = signal<string>('');
}
