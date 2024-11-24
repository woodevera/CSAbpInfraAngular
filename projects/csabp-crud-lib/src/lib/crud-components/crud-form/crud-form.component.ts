import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {DialogModule} from "primeng/dialog";
import {BaseCoreModule, LocalizationModule, SubscriptionService} from "@abp/ng.core";
import {ConfirmationService} from "primeng/api";
import {FieldSignatureDto, FormModeEnum, SignatureDataTypeEnum} from "../../models/models";
import {CommonCrudService} from "../../services/common-crud.service";
import {CommonEnumService} from "../../services/common-enum.service";
import {CommonService} from "../../services/common.service";
import {AbpInfraService} from "../../services/abp-infra.service";
import {InputSwitchModule} from "primeng/inputswitch";
import {InputNumberModule} from "primeng/inputnumber";
import {DropdownModule} from "primeng/dropdown";
import {CalendarModule} from "primeng/calendar";
import {ConfirmPopupModule} from "primeng/confirmpopup";

@Component({
  selector: 'app-crud-form',
  templateUrl: './crud-form.component.html',
  styleUrls: ['./crud-form.component.scss'],
  providers: [SubscriptionService, ConfirmationService],
  imports: [
    LocalizationModule,
    BaseCoreModule,
    InputSwitchModule,
    InputNumberModule,
    DropdownModule,
    CalendarModule,
    DialogModule,
    ConfirmPopupModule
  ],
  standalone: true
})
export class CrudFormComponent implements OnInit , OnDestroy {

  @Output() closeEvent: EventEmitter<boolean>;
  @Output() saveEvent: EventEmitter<boolean>;
  @Input() dto: any;
  @Input() formService: any;
  @Input() formMode: FormModeEnum;
  @Input() localizationPrefix: string;
  @Input() formElements: FieldSignatureDto[];

  @Input() viewTitle: string;
  @Input() viewSubTitle: string;
  @Input() addTitle: string;
  @Input() addSubTitle: string;
  @Input() editTitle: string;
  @Input() editSubTitle: string;

  formGroup: UntypedFormGroup;
  signatureDataTypeEnum: any;

  constructor(private fb: UntypedFormBuilder,
              public commonService: CommonService,
              public commonEnumService: CommonEnumService,
              private commonCrudService: CommonCrudService,
              private utilitiesService: AbpInfraService,
              private subscriptionService: SubscriptionService) {
    this.closeEvent = new EventEmitter<boolean>();
    this.saveEvent = new EventEmitter<boolean>();
    this.signatureDataTypeEnum = SignatureDataTypeEnum;
  }


  ngOnInit(): void {
    this.initForm();
  }


  /*
  * Function Used To main function used to init form
  * Created By : Mahmoud Radwan
  * Created On : 5/7/2022
  */
  initForm() {
    this.formGroup = this.commonCrudService.getSignatureForm(this.formElements , this.dto , this.formMode);
  }

  /*
  * Function Used To change form mode to edit
  * Created By : Mahmoud Radwan
  * Created On : 7/25/2022
  */
  edit() {
    this.formMode = FormModeEnum.Edit;
    this.commonService.enableAllFormControls(this.formGroup);
  }

  /*
  * Function Used To Save form data , validate it first then creates Dto , then post Create or Update
  * Created By : Mahmoud Radwan
  * Created On : 5/7/2022
  */
  save() {
    if(this.formGroup.invalid) {
      this.commonService.markFormAsDirty(this.formGroup);
      return;
    }
    this.dto = this.commonService.getFormDto(this.formGroup.getRawValue() , this.dto);
    if(!this.dto.id) {
      this.postCreate();
    } else {
      this.postUpdate();
    }
  }

  /*
  * Function Used To post create keduStage dto
  * Created By : Mahmoud Radwan
  * Created On : 5/7/2022
  */
  private postCreate() {
    this.subscriptionService.addOne(this.formService.create(this.dto) , res => {
      const resData = res as any;
      if(resData && resData.id) {
        this.afterSaveSuccess(resData);
      }
    });
  }
  /*
  * Function Used To post update keduStage dto
  * Created By : Mahmoud Radwan
  * Created On : 5/7/2022
  */
  private postUpdate() {
    this.subscriptionService.addOne(this.formService.update(this.dto) , res => {
      const resData = res as any;
      if(resData && resData.id) {
        this.afterSaveSuccess(resData);
      }
    });
  }
  /*
  * Function Used To be executed ( set dto , show success fire events ) after save ( insert / update ) success
  * Created By : Mahmoud Radwan
  * Created On : 5/7/2022
  */
  afterSaveSuccess(res: any){
    this.dto = res;
    this.commonService.showSuccessToast();
    this.saveEvent.emit(true);
    this.closeDialog();
  }

  /*
  * Function Used To fire event that is used to close popup
  * Created By : Mahmoud Radwan
  * Created On : 5/7/2022
  */
  closeDialog() {
    this.closeEvent.emit(true);
  }
  /*
  * Function Used To un subscribe all subscription while destroying component
  * Created By : Mahmoud Radwan
  * Created On : 5/7/2022
  */
  ngOnDestroy(): void {
    this.subscriptionService.closeAll();
  }


}
