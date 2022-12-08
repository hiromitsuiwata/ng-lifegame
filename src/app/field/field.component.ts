import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css']
})
export class FieldComponent implements AfterViewInit {

  size: number = 3;
  height: number = 200;
  width: number = 200;
  time: number = 100;
  state: boolean[][] = [];
  nextState: boolean[][] = [];
  working: boolean = false;
  steps: number = 0;

  @ViewChild('myCanvas')
  myCanvas: ElementRef  | null;
  context: CanvasRenderingContext2D | null;

  constructor() {
    this.init();
    this.myCanvas = null;
    this.context = null;
  }

  ngAfterViewInit(): void {

    if (this.myCanvas) {
      const canvas = this.myCanvas.nativeElement as HTMLCanvasElement;
      this.context = canvas.getContext('2d');
    }

    this.randomDraw();
    this.tick();
  }

  tick(): void {
    setTimeout(this.tick.bind(this), this.time);
    if (this.working) {
      this.step();
      this.draw();
    }
  }

  step(): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let count = this.countNeighbor(x, y);
        this.nextState[y][x] = this.next(this.state[y][x], count);
      }
    }
    [this.state, this.nextState] = [this.nextState, this.state];
    this.steps++;
  }

  countNeighbor(x: number, y: number): number {
    let count = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (y + dy < 0 || this.height <= y + dy) {
          continue;
        }
        if (x + dx < 0 || this.width <= x + dx) {
          continue;
        }
        if (dy === 0 && dx === 0) {
          continue;
        }
        if (this.state[y + dy][x + dx]) {
          count++;
        }
      }
    }
    return count;
  }

  next(self: boolean, count: number): boolean {
    if (self && (count === 2 || count === 3)) {
      // 生き残る
      return true;
    } else if (!self && count === 3) {
      // 生まれる
      return true;
    } else {
      // 死ぬ
      return false;
    }
  }

  init(): void {
    for (let y = 0; y < this.height; y++) {
      this.state[y] = [];
      this.nextState[y] = [];
      for (let x = 0; x < this.width; x++) {
        this.state[y][x] = false;
        this.nextState[y][x] = false;
      }
    }
  }

  randomDraw(): void {
    this.random();
    this.draw();
  }

  random(): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.state[y][x] = Math.random() < 0.2 ? true : false;
      }
    }
    this.draw();
    this.steps = 0;
  }

  draw(): void {
    const context = this.context;
    if (!context) {
      return;
    }

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        context.fillStyle = this.state[y][x] ? "#0f0": "#000";
        context.fillRect(x * this.size, y * this.size, this.size, this.size);
      }
    }
  }

  getWidth(): string {
    return `${this.width * this.size}`;
  }
  getHeight(): string {
    return `${this.height * this.size}`;
  }

  start(): void{
    this.working = true;
  }
  stop(): void {
    this.working = false;
  }


}
