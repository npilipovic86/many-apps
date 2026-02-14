import { Injectable, signal } from '@angular/core';
import { ICalculation } from '../models/calculator.model';

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {
  private historySignal = signal<ICalculation[]>(this.loadHistory());

  readonly history = this.historySignal.asReadonly();

  calculate(operand1: number, operand2: number, operation: string): number {
    switch (operation) {
      case '+':
        return operand1 + operand2;
      case '-':
        return operand1 - operand2;
      case '*':
        return operand1 * operand2;
      case '/':
        return operand2 !== 0 ? operand1 / operand2 : 0;
      default:
        return 0;
    }
  }

  saveCalculation(calc: ICalculation): void {
    const currentHistory = this.historySignal();
    const newHistory = [...currentHistory, calc];
    localStorage.setItem('calculator-history', JSON.stringify(newHistory));
    this.historySignal.set(newHistory);
  }

  getCalculationHistory(): ICalculation[] {
    return this.historySignal();
  }

  private loadHistory(): ICalculation[] {
    const history = localStorage.getItem('calculator-history');
    return history ? JSON.parse(history) : [];
  }
}
