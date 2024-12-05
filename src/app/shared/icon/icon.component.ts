import { Component, HostBinding, Input, OnChanges, ChangeDetectionStrategy } from "@angular/core";
import { IconName } from "./icon-name";

type IconSizePresetKey =
  | "smaller"
  | "small"
  | "medium-small"
  | "default"
  | "medium-large"
  | "large"
  | "larger"
  | "largest";

@Component({
  selector: "icon",
  templateUrl: "./icon.component.html",
  styleUrls: ["./icon.component.scss"],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent implements OnChanges {
  private static iconsBasePath = "/assets/icons/";

  link = "";

  private sccSizes = new Map<IconSizePresetKey, string>([
    ["small", "0.9rem"],
    ["medium-small", "1.25rem"],
    ["default", "1.5rem"],
    ["medium-large", "1.75rem"],
    ["large", "2rem"],
    ["larger", "2.5rem"],
    ["largest", "3.5rem"],
  ]);

  @Input() size: IconSizePresetKey = "default";
  @Input({required: true}) type!: IconName;
  @Input() color = "currentColor";

  /** inline = true => size will be ignored, icon will be inlined and centered to the text */
  @HostBinding("class.inline-icon") @Input() inline: boolean = false;

  @HostBinding("style.width") styleWidth = "1.5rem";
  @HostBinding("style.height") styleHeight = "1.5rem";
  @HostBinding("style.min-width") styleMinWidth = "1.5rem";
  @HostBinding("style.min-height") styleMinHeight = "1.5rem";

  ngOnChanges(): void {
    this.link = IconComponent.iconsBasePath + `${this.type}.svg#${this.type}`;
    if(this.inline) {
      this.styleWidth = "1em";
      this.styleHeight = "1em";
      this.styleMinWidth = "1em";
      this.styleMinHeight = "1em";
    } else {
      const cssSize: string = this.sccSizes.get(this.size)!;
      this.styleWidth = cssSize;
      this.styleHeight = cssSize;
      this.styleMinWidth = cssSize;
      this.styleMinHeight = cssSize;
    }
  }
}