import {Injectable} from '@angular/core';
import {Constants} from "../models/constants";
import * as moment from "moment";


@Injectable({
  providedIn: 'root'
})
export class ConvertersService {
  constants: Constants;
  constructor() {
    this.constants = new Constants();
  }

  /*
  * Function Used To
  * Created By : Mahmoud Radwan
  * Created On : 8/13/2022
  */
  convertStringToDate(str: string): Date {
    if(str){
     const date = new Date(str);
      return new Date(date.toDateString());
    }
    return null;
  }
  /*
  * Function Used To
  * Created By : Mahmoud Radwan
  * Created On : 8/13/2022
  */
  convertDateToString(date: Date): string {
    return moment(date).format(this.constants.standardRequestDateFormat);
  }
}
