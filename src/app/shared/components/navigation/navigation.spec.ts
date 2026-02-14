import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Navigation } from './navigation';
import { describe, it, expect, beforeEach } from 'vitest';
import { provideRouter } from '@angular/router';

describe('Navigation', () => {
  let component: Navigation;
  let fixture: ComponentFixture<Navigation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navigation],
      providers: [
        provideRouter([
          { path: '', component: Navigation },
          { path: 'calculator', component: Navigation },
          { path: 'weather', component: Navigation }
        ])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Navigation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have mobileMenuOpen set to false initially', () => {
      expect(component.mobileMenuOpen).toBe(false);
    });

    it('should render app title', () => {
      const compiled = fixture.nativeElement;
      const title = compiled.querySelector('h1');
      expect(title?.textContent).toBe('Jaka App');
    });

    it('should render navigation element', () => {
      const compiled = fixture.nativeElement;
      const nav = compiled.querySelector('nav');
      expect(nav).toBeTruthy();
    });
  });

  describe('toggleMobileMenu', () => {
    it('should toggle mobileMenuOpen from false to true', () => {
      component.mobileMenuOpen = false;

      component.toggleMobileMenu();

      expect(component.mobileMenuOpen).toBe(true);
    });

    it('should toggle mobileMenuOpen from true to false', () => {
      component.mobileMenuOpen = true;

      component.toggleMobileMenu();

      expect(component.mobileMenuOpen).toBe(false);
    });

    it('should toggle multiple times correctly', () => {
      expect(component.mobileMenuOpen).toBe(false);

      component.toggleMobileMenu();
      expect(component.mobileMenuOpen).toBe(true);

      component.toggleMobileMenu();
      expect(component.mobileMenuOpen).toBe(false);

      component.toggleMobileMenu();
      expect(component.mobileMenuOpen).toBe(true);
    });
  });

  describe('closeMobileMenu', () => {
    it('should set mobileMenuOpen to false when it is true', () => {
      component.mobileMenuOpen = true;

      component.closeMobileMenu();

      expect(component.mobileMenuOpen).toBe(false);
    });

    it('should keep mobileMenuOpen false when it is already false', () => {
      component.mobileMenuOpen = false;

      component.closeMobileMenu();

      expect(component.mobileMenuOpen).toBe(false);
    });
  });

  describe('Template Integration', () => {
    it('should have mobile menu button', () => {
      const button = fixture.nativeElement.querySelector('button');
      expect(button).toBeTruthy();
    });

    it('should call toggleMobileMenu when button is clicked', () => {
      const button = fixture.nativeElement.querySelector('button');
      const initialState = component.mobileMenuOpen;

      button.click();

      expect(component.mobileMenuOpen).toBe(!initialState);
    });

    it('should have navigation links', () => {
      const links = fixture.nativeElement.querySelectorAll('a');
      expect(links.length).toBeGreaterThan(0);
    });
  });
});
