import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {BaseCoreModule, LocalizationModule, PagedResultRequestDto, SubscriptionService} from "@abp/ng.core";
import {UntypedFormGroup} from "@angular/forms";
import {CommonEnumService} from "../../services/common-enum.service";
import {CommonCrudService} from "../../services/common-crud.service";
import {CommonService} from "../../services/common.service";
import {FieldSignatureDto, LabelValuePair, SignatureDataTypeEnum} from "../../models/models";
import {InputSwitchModule} from "primeng/inputswitch";
import {InputNumberModule} from "primeng/inputnumber";
import {DropdownModule} from "primeng/dropdown";
import {CalendarModule} from "primeng/calendar";
import {DialogModule} from "primeng/dialog";

@Component({
  selector: 'app-crud-filter',
  templateUrl: './crud-filter.component.html',
  styleUrls: ['./crud-filter.component.scss'],
  standalone: true,
  imports: [
    LocalizationModule,
    BaseCoreModule,
    InputSwitchModule,
    InputNumberModule,
    DropdownModule,
    CalendarModule,
    DialogModule
  ],
  providers: [SubscriptionService]
})
export class CrudFilterComponent implements OnInit, OnDestroy {
  @Output() closeEvent: EventEmitter<boolean>;
  @Output() filterEvent: EventEmitter<PagedResultRequestDto>;
  @Output() filterElementsEvent: EventEmitter<FieldSignatureDto[]>;
  @Input() filterDto: any;
  @Input() localizationPrefix: string;
  @Input() filterElements: FieldSignatureDto[];

  filterForm: UntypedFormGroup;
  signatureDataTypeEnum: any;
  constructor(private subscriptionService: SubscriptionService,
              public commonService: CommonService,
              private commonEnumService: CommonEnumService,
              private commonCrudService: CommonCrudService) {
    this.closeEvent = new EventEmitter<boolean>();
    this.filterEvent = new EventEmitter<any>();
    this.filterElementsEvent = new EventEmitter<FieldSignatureDto[]>();
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
    this.filterForm = this.commonCrudService.getSignatureForm(this.filterElements , this.filterDto);
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
  * Created On : 5/9/2022
  */
  ngOnDestroy(): void {
    this.subscriptionService.closeAll();
  }

  /*
  * Function Used To emit Filter data
  * Created By : Mahmoud Radwan
  * Created On : 2/17/2023
  */
  filter() {
    this.filterDto = this.filterForm.value;
    if(this.filterElements?.length > 0){
      this.filterElements.forEach(ele => {
        ele.value = this.filterDto[ele.name];
      });
    }
    this.filterEvent.emit(this.filterDto);
    this.filterElementsEvent.emit(this.filterElements);
    this.closeDialog();
  }
}
