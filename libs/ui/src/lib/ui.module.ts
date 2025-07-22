import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ScreenResumenComponent } from './common-ui/features/offers-to-offer/screen-resumen/screen-resumen.component';
import { CheckboxComponent } from './common-ui/components/checkbox/checkbox.component';
import { CardProductComponent } from './common-ui/components/card-product/card-product.component';
import { MessageEscComponent } from './common-ui/features/message-esc/message-esc.component';
import { StrategyResultComponent } from './common-ui/features/strategy-result/strategy-result.component';

@NgModule({
  imports: [CommonModule, BrowserAnimationsModule],
  declarations: [
    ScreenResumenComponent,
    CheckboxComponent,
    CardProductComponent,
    MessageEscComponent,
    StrategyResultComponent,
  ],
  providers: [],
})
export class UiModule {}
