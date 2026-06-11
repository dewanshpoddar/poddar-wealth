type PopupCallback = () => void;

class PopupCoordinator {
  private active: string | null = null;
  private queue: Array<{ id: string; show: PopupCallback }> = [];
  private lastDismissed: number = 0;

  request(id: string, show: PopupCallback): boolean {
    if (typeof window !== 'undefined' && performance.now() < 10000) return false;
    if (this.active) {
      this.queue.push({ id, show });
      return false;
    }
    if (Date.now() - this.lastDismissed < 5000) {
      setTimeout(() => this.request(id, show), 5000);
      return false;
    }
    this.active = id;
    show();
    return true;
  }

  release(id: string) {
    if (this.active !== id) return;
    this.active = null;
    this.lastDismissed = Date.now();
    if (this.queue.length > 0) {
      const next = this.queue.shift()!;
      setTimeout(() => {
        this.active = next.id;
        next.show();
      }, 5000);
    }
  }

  isActive(): boolean {
    return this.active !== null;
  }
}

export const popupCoordinator = new PopupCoordinator();
