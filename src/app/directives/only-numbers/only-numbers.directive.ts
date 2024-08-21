import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlyNumbers]'
})
export class OnlyNumbersDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const initialValue = input.value;

    input.value = initialValue.replace(/[^0-9]*/g, '');
    if (initialValue !== input.value) {
      event.stopPropagation();
    }
  }
}
