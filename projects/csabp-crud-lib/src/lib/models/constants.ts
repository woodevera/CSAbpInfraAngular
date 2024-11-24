

export class Constants {
  public constructor() {
    this.init();
  }

  public standardPickerDateFormat;
  public standardPipeDateFormat;
  public standardRequestDateFormat;


  init() {
    this.standardPickerDateFormat = 'dd/mm/yy'; // : 'yy/mm/dd';
    this.standardPipeDateFormat = 'dd/MM/YYYY' ; // : 'YYYY/MM/dd';
    this.standardRequestDateFormat = 'YYYY-MM-DD';
  }
}
