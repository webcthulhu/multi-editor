import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-color-selector',
  templateUrl: './color-selector.component.html',
  styleUrls: ['./color-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorSelectorComponent {
  static readonly COLORS_PER_PAGE = 18;
  @Input() set palette(colors: string[]) {
    this.colors = [];
    for (let i = 0, j = colors.length; i < j; i += ColorSelectorComponent.COLORS_PER_PAGE) {
      this.colors.push(colors.slice(i, i + ColorSelectorComponent.COLORS_PER_PAGE));
    }
    this.max = this.colors.length - 1;
    this.selection = this.colors[this.index];
  }
  @Input() label: string;
  @Input() color: string;
  @Output() change = new EventEmitter<string>();
  colors: string[][] = [];
  selection: string[];
  index: number;
  min: number;
  max: number;
  constructor() {
    this.color = '';
    this.index = 0;
    this.label = 'select color';
    this.min = 0;
  }
  isChecked(value: string): boolean {
    return this.color && value.toLowerCase() === this.color.toLowerCase();
  }
  setColor(value: string): void {
    this.change.emit(value);
  }
}
