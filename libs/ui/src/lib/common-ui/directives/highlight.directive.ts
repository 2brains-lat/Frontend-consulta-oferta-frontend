import {
  Directive,
  Input,
  SimpleChanges,
  Renderer2,
  ElementRef,
  OnChanges,
} from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[appHighlight]',
  standalone: true,
})
export class HighlightDirective implements OnChanges {
  @Input() searchedWord!: string;
  @Input() content!: string;
  @Input() classToApply!: string;
  @Input() setTitle = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.content) {
      return;
    }

    if (this.setTitle) {
      this.renderer.setProperty(this.el.nativeElement, 'title', this.content);
    }

    if (!this.searchedWord || !this.searchedWord.length || !this.classToApply) {
      this.renderer.setProperty(
        this.el.nativeElement,
        'innerHTML',
        this.content
      );
      return;
    }

    this.renderer.setProperty(
      this.el.nativeElement,
      'innerHTML',
      this.getFormattedText()
    );
  }

  getFormattedText() {
    const re = new RegExp(`(${this.searchedWord})`, 'gi');
    return ('<div>' + this.content + '</div>').replace(
      re,
      `<span class="${this.classToApply}">$1</span>`
    );
  }
}
