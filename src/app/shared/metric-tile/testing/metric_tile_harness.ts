import { ComponentHarness } from '@angular/cdk/testing';

export class MetricTileHarness extends ComponentHarness {
  // Selector matching the host element
  static readonly hostSelector = 'app-metric-tile';

  // Locators for internal semantic elements
  private readonly serviceNameEl = this.locatorFor('.name');
  private readonly badgeEl = this.locatorFor('.status-tag');
  private readonly errorAlertEl = this.locatorForOptional('.error-message');
  private readonly tileContainer = this.locatorFor('.raw-tile');

  /** Gets the displayed service name. */
  async getServiceName(): Promise<string> {
    const serviceNameEl = await this.serviceNameEl();
    return serviceNameEl.text();
  }

  /** Gets the text of the status badge. */
  async getStatusBadgeText(): Promise<string> {
    const badgeEl = await this.badgeEl();
    return badgeEl.text();
  }

  /** Checks whether the error alert banner is rendered in the DOM. */
  async hasErrorAlert(): Promise<boolean> {
    const errorAlertEl = await this.errorAlertEl();
    return errorAlertEl !== null;
  }

  /** Checks whether the tile has the active 'selected' CSS class. */
  async isSelected(): Promise<boolean> {
    const tileContainer = await this.tileContainer();
    return tileContainer.hasClass('selected');
  }

  /** Checks if the tile currently has the active 'selected' CSS class. */
  async click(): Promise<void> {
    const tileContainer = await this.tileContainer();
    await tileContainer.click();
  }
}
