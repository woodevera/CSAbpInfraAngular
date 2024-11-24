import {EventEmitter, Injectable} from '@angular/core';
import {isObject, LocalizationService} from '@abp/ng.core';
import {UntypedFormGroup} from '@angular/forms';
import {Constants} from "../models/constants";
import {ConvertersService} from "./converters.service";
import {ConfirmationService} from "primeng/api";
import {AlertMessage, AlertTypeEnum} from "../models/models";
import {BehaviorSubject} from "rxjs";


@Injectable({
  providedIn: 'root',
})
export class CommonService {

  public passwordMediumRegex = '^(?=.*[a-zA-Z])(?=.*\\d)[A-Za-z\\d#$@!%&*?]{6,20}$';
  public passwordStrongRegex = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})';
  constants: Constants;
  alertSubject: BehaviorSubject<AlertMessage>;

  constructor(private localizationService: LocalizationService , public converter: ConvertersService) {
    this.constants = new Constants();
    this.alertSubject = new BehaviorSubject<AlertMessage>(null);
  }

  /*
  * Function Used To Mark all controls as dirty
  * Created By : Mahmoud Radwan
  * Created On : 5/4/2022
  */
  markFormAsDirty(form: UntypedFormGroup) {
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if(control?.constructor?.name === 'FormGroup'){
        this.markFormAsDirty(control as UntypedFormGroup);
      } else {
        control.markAsDirty();
      }
    });
  }

  /*
  * Function Used To reset Form validation
  * Created By : Mahmoud Radwan
  * Created On : 10/30/2022
  */
  resetFormValidation(formGroup: UntypedFormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if(control?.constructor?.name === 'FormGroup'){
        this.resetFormValidation(control as UntypedFormGroup);
      } else {
        control.setErrors(null);
      }
    });
  }

  /*
  * Function Used To enable all form controls
  * Created By : Mahmoud Radwan
  * Created On : 7/25/2022
  */
  enableAllFormControls(fg: UntypedFormGroup){
    Object.keys(fg.controls).forEach(key => {
      fg.controls[key].enable();
    });
  }

  getFormDto(formDto: any , dto: any) : any {
    /* loop over dto data and find if any property not exist in formDto then add it */
    for (const prop in dto) {
      if (!formDto.hasOwnProperty(prop)) {
        formDto[prop] = dto[prop];
      }
      else if (isObject(formDto[prop]) && isObject(dto[prop])) {
        formDto[prop] = this.getFormDto(formDto[prop] , dto[prop]);
      }
    }
    return formDto;
  }

  /*
  * Function Used To enable set of controls
  * Created By : Mahmoud Radwan
  * Created On : 9/2/2022
  */
  enableSetFormControls(fg: UntypedFormGroup , keys: string[]){
    Object.keys(fg.controls).forEach(key => {
      fg.controls[key].enable();
    });
  }

  /*
  * Function Used To general delete confirmation function
  * Created By : Mahmoud Radwan
  * Created On : 10/29/2022
  */
  confirmDelete(confirmService: ConfirmationService): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      confirmService.confirm({
        message: this.localizationService.instant('::deleteConfirm'),
        header: this.localizationService.instant('::deleteConfirmTitle'),
        icon: 'pi pi-info-circle',
        accept: () => {
          resolve(true);
        },
        reject: () => {
          resolve(false);
        },
        key: "deleteDialog",
        rejectLabel: this.localizationService.instant('::cancel'),
        acceptLabel: this.localizationService.instant('::ok'),
        acceptButtonStyleClass: 'p-button-danger'
      });
    });
  }

  /*
  * Function Used To encapsulated Saved Success message
  * Created By : Mahmoud Radwan
  * Created On : 5/7/2022
  */
  showSuccessToast(messageKey:string = null) {
    this.alertSubject.next(new class implements AlertMessage {
      alertType = AlertTypeEnum.Success
      messageKey = messageKey;
    });
  }

  /*
  * Function Used To encapsulated Saved Success message
  * Created By : Mahmoud Radwan
  * Created On : 5/7/2022
  */
  showErrorToast(messageKey:string = null) {
    this.alertSubject.next(new class implements AlertMessage {
      alertType = AlertTypeEnum.Error
      messageKey = messageKey;
    });
  }
  /*
  * Function Used To encapsulate warning messages
  * Created By : Mahmoud Radwan
  * Created On : 5/7/2022
  */
  showInfoToast(messageKey:string) {
    this.alertSubject.next(new class implements AlertMessage {
      alertType = AlertTypeEnum.Info
      messageKey = messageKey;
    });
  }
  /*
  * Function Used To encapsulate warning message
  * Created By : Mahmoud Radwan
  * Created On : 5/7/2022
  */
  showWarningToast(messageKey: string){
    this.alertSubject.next(new class implements AlertMessage {
      alertType = AlertTypeEnum.Warning
      messageKey = messageKey;
    });
  }


  /*
  * Function Used To change types that don't match in back end contract
  * like DateTime that is waited to be string , etc
  * Created By : Mahmoud Radwan
  * Created On : 8/13/2022
  */
  prepareDtoForRequest(data: any): any {
    for (const [key, value] of Object.entries(data)) {
      if(value instanceof Date) {
        data[key] = this.converter.convertDateToString(value);
      }
    }
    return data;
  }

  /*
  * Function Used To extract Flag value from Array ( in multiselect )
  * Created By : Mahmoud Radwan
  * Created On : 9/10/2022
  */
  extractFlagFromArray(data: [any]) {
    let flagValue;
    data?.forEach(ele => {
      flagValue = flagValue | ele;
    });
    return flagValue;
  }
  /*
  * Function Used To convert file to byte array
  * Created By : Mahmoud Radwan
  * Created On : 12/31/2022
  */
  fileToByteArray(file): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      try {
        let reader = new FileReader();
        let fileByteArray = [];
        reader.readAsArrayBuffer(file);
        reader.onloadend = (evt) => {
          if (evt.target.readyState == FileReader.DONE) {
            const arrayBuffer = evt.target.result as ArrayBuffer;
            const array = new Uint8Array(arrayBuffer);
            for (const byte of array) {
              fileByteArray.push(byte);
            }
          }
          resolve(fileByteArray);
        }
      }
      catch (e) {
        reject(e);
      }
    })
  }

  /*
  * Function Used To convert file to Url
  * Created By : Mahmoud Radwan
  * Created On : 12/31/2022
  */
  fileToUrl(file): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {
        let reader = new FileReader();
        let result = '';
        reader.readAsDataURL(file);
        reader.onloadend = (evt) => {
          if (evt.target.readyState == FileReader.DONE) {
            result = evt.target.result as string;
          }
          resolve(result);
        }
      }
      catch (e) {
        reject(e);
      }
    })
  }

  /*
  * Function Used To convert byte array to Url
  * Created By : Mahmoud Radwan
  * Created On : 12/31/2022
  */
  arrayToImageUrl(arrayBuffer: any[]): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {
        const base64String = 'data:image/;base64,' + btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        resolve(base64String);
      }
      catch (e) {
        reject(e);
      }
    })
  }
  

}

export function nameof<T>(name: keyof T)
{
  return name;
}

