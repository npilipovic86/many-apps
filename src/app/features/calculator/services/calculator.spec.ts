import { TestBed } from '@angular/core/testing';
import { CalculatorService } from './calculator';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ICalculation } from '../models/calculator.model';

describe('CalculatorService', () => {
    let service: CalculatorService;

    beforeEach(() => {
        localStorage.clear();
        TestBed.configureTestingModule({
            providers: [CalculatorService]
        });
        service = TestBed.inject(CalculatorService);
    });

    afterEach(() => {
        localStorage.clear();
    });

    describe('calculate', () => {
        describe('Addition', () => {
            it('should add two positive numbers', () => {
                expect(service.calculate(5, 3, '+')).toBe(8);
            });

            it('should add positive and negative numbers', () => {
                expect(service.calculate(10, -5, '+')).toBe(5);
            });

            it('should add two negative numbers', () => {
                expect(service.calculate(-5, -3, '+')).toBe(-8);
            });

            it('should add decimal numbers', () => {
                expect(service.calculate(1.5, 2.3, '+')).toBeCloseTo(3.8);
            });
        });

        describe('Subtraction', () => {
            it('should subtract two positive numbers', () => {
                expect(service.calculate(10, 3, '-')).toBe(7);
            });

            it('should subtract negative from positive', () => {
                expect(service.calculate(10, -5, '-')).toBe(15);
            });

            it('should subtract positive from negative', () => {
                expect(service.calculate(-10, 5, '-')).toBe(-15);
            });

            it('should subtract decimal numbers', () => {
                expect(service.calculate(5.5, 2.2, '-')).toBeCloseTo(3.3);
            });
        });

        describe('Multiplication', () => {
            it('should multiply two positive numbers', () => {
                expect(service.calculate(6, 7, '*')).toBe(42);
            });

            it('should multiply positive and negative', () => {
                expect(service.calculate(5, -3, '*')).toBe(-15);
            });

            it('should multiply two negative numbers', () => {
                expect(service.calculate(-4, -5, '*')).toBe(20);
            });

            it('should multiply by zero', () => {
                expect(service.calculate(10, 0, '*')).toBe(0);
            });

            it('should multiply decimal numbers', () => {
                expect(service.calculate(2.5, 4, '*')).toBe(10);
            });
        });

        describe('Division', () => {
            it('should divide two positive numbers', () => {
                expect(service.calculate(20, 4, '/')).toBe(5);
            });

            it('should divide positive by negative', () => {
                expect(service.calculate(20, -4, '/')).toBe(-5);
            });

            it('should divide negative by positive', () => {
                expect(service.calculate(-20, 4, '/')).toBe(-5);
            });

            it('should handle division by zero', () => {
                expect(service.calculate(10, 0, '/')).toBe(0);
            });

            it('should divide decimal numbers', () => {
                expect(service.calculate(7.5, 2.5, '/')).toBe(3);
            });
        });

        describe('Invalid Operations', () => {
            it('should return 0 for unknown operation', () => {
                expect(service.calculate(5, 3, '%')).toBe(0);
            });

            it('should return 0 for empty operation', () => {
                expect(service.calculate(5, 3, '')).toBe(0);
            });
        });
    });

    describe('saveCalculation', () => {
        it('should save calculation to localStorage', () => {
            const calculation: ICalculation = {
                operand1: 10,
                operand2: 5,
                operation: '+',
                result: 15
            };

            service.saveCalculation(calculation);

            const history = service.getCalculationHistory();
            expect(history.length).toBe(1);
            expect(history[0]).toEqual(calculation);
        });

        it('should append to existing history', () => {
            const calc1: ICalculation = {
                operand1: 10,
                operand2: 5,
                operation: '+',
                result: 15
            };
            const calc2: ICalculation = {
                operand1: 20,
                operand2: 10,
                operation: '-',
                result: 10
            };

            service.saveCalculation(calc1);
            service.saveCalculation(calc2);

            const history = service.getCalculationHistory();
            expect(history.length).toBe(2);
            expect(history[0]).toEqual(calc1);
            expect(history[1]).toEqual(calc2);
        });

        it('should persist calculations in localStorage', () => {
            const calculation: ICalculation = {
                operand1: 7,
                operand2: 3,
                operation: '*',
                result: 21
            };

            service.saveCalculation(calculation);

            const stored = localStorage.getItem('calculator-history');
            expect(stored).toBeTruthy();
            const parsed = JSON.parse(stored!);
            expect(parsed[0]).toEqual(calculation);
        });
    });

    describe('getCalculationHistory', () => {
        it('should return empty array when no history exists', () => {
            const history = service.getCalculationHistory();
            expect(history).toEqual([]);
        });

        it('should retrieve saved calculations', () => {
            const calculations: ICalculation[] = [
                { operand1: 5, operand2: 3, operation: '+', result: 8 },
                { operand1: 10, operand2: 2, operation: '/', result: 5 }
            ];

            calculations.forEach(calc => service.saveCalculation(calc));

            const history = service.getCalculationHistory();
            expect(history).toEqual(calculations);
        });

        it('should handle corrupted localStorage data during initialization', () => {
            localStorage.setItem('calculator-history', 'invalid json');

            // Should throw during initialization because of JSON.parse
            expect(() => new CalculatorService()).toThrow();
        });
    });
});
