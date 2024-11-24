import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {LazyLoadEvent} from 'primeng/api';
import * as _ from 'lodash';
import {FieldSignatureDto, SignatureDataTypeEnum} from "../models/models";

@Injectable({
  providedIn: 'root'
})
export class CommonGridService {
  defaultRows: number = 10;
  defaultRowsOptions = [10,25,50];
  totalCount: number = 20;
  currentRows: number;
  maxResult: number;
  currentFirst: number;
  loading = false;

  loadDataEvent:BehaviorSubject<LazyLoadEvent>;

  constructor() {
    this.currentFirst = 0;
    this.currentRows = this.defaultRows;
    this.maxResult = 1000;
    this.loadDataEvent = new BehaviorSubject<LazyLoadEvent>(null);
  }

  next() {
    this.loadDataEvent.next({
      first: this.currentFirst + this.currentRows,
      rows: this.currentRows
    });
  }
  prev() {
    this.loadDataEvent.next({
      first: this.currentFirst - this.currentRows,
      rows: this.currentRows
    });
  }
  reset() {
    this.loadDataEvent.next({
      first: 0,
      rows: this.currentRows
    });
  }
  isLastPage(): boolean {
    return this.totalCount <= ( this.currentFirst + this.currentRows);
  }
  isFirstPage(): boolean {
    return this.currentFirst === 0;
  }

  removeFilter(key: string , filter:any) {
    _.set(filter , key , null);
    this.loadDataEvent.next({
      first: 0,
      rows: this.currentRows
    });
  }

  removeCrudFilter(key: string , filter:any , filterElements: FieldSignatureDto[]): FieldSignatureDto[]{
    const element = filterElements.find(x=> x.name === key);

    _.set(filter , key , null);
    element.value = null;

    this.loadDataEvent.next({
      first: 0,
      rows: this.currentRows
    });
    return filterElements;
  }

}
