export class PlankSessions {
  time: number = 0;

  getTime(): number {
    return this.time;
  }

  incrementTime(): number {
    return (this.time += 1);
  }

  resetTime(): number {
    return (this.time = 0);
  }
}
