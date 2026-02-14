import {computed, Injectable, signal} from '@angular/core';
import {ICalculatorState} from '../models/calculator.model'

@Injectable({
  providedIn: 'root'
})
export class CalculatorState {

  private state = signal<ICalculatorState>({
    currentValue: 0,
    previousValue: 0,
    operation: null,
    display: '0'
  });


  readonly display = computed(() => this.state().display);
  readonly currentOperation = computed(() => this.state().operation);

  updateDisplay(value: string) {
    this.state.update(state => ({
      ...state,
      display: value
    }));
  }

  setOperation(operation: string) {
    this.state.update(state => ({
      ...state,
      operation,
      previousValue: parseFloat(state.display),
      currentValue: 0
    }));
  }

  reset() {
    this.state.set({
      currentValue: 0,
      previousValue: 0,
      operation: null,
      display: '0'
    });
  }

  getState() {
    return this.state();
  }
}
