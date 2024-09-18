import { Component, AfterViewInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import gsap from 'gsap';
import { isPlatformBrowser } from '@angular/common';   // it is function that checks if codes are running in web browser environment 

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'drowning';

  // Data for the sections
  h1Texts: string[] = ["Pear", "Apple", "Exotic"];
  logoColors: string[] = [
    "var(--pear-logo)",
    "var(--apple-logo)",
    "var(--exotic-logo)"
  ];
  keyframes: string[] = [
    "wave-pear-effect",
    "wave-apple-effect",
    "wave-exotic-effect"
  ];

  currentIndex = 0;
  currentPosition = 0;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Initialize any necessary data or states before view initialization
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.initializeGSAPAnimations();
        this.addEventListeners();
        this.updateSection(); // Initialize the section based on the currentIndex
      }, 100); // Adjust timeout if needed
    }
  }

  initializeGSAPAnimations(): void {
    // Check if elements are available before applying animations
    const fruitImages = document.querySelectorAll(".fruit-image");
    if (fruitImages.length > 0) {
      gsap.from(fruitImages, { y: "-100vh", delay: 0.5 });
      gsap.to(".fruit-image img", {
        x: "random(-20, 20)",
        y: "random(-20, 20)",
        zIndex: 22,
        duration: 2,
        ease: "none",
        yoyo: true,
        repeat: -1
      });
    } else {
      console.warn("No .fruit-image elements found");
    }
  }

  addEventListeners(): void {
    setTimeout(() => {
      const nextButton = document.getElementById("nextButton") as HTMLButtonElement;
      const prevButton = document.getElementById("prevButton") as HTMLButtonElement;
      const caneLabels = document.querySelector<HTMLElement>(".cane-labels");
      const sectionContainer = document.querySelector<HTMLElement>(".section-container");

      if (nextButton && prevButton) {
        nextButton.addEventListener("click", () => this.nextSection(caneLabels, sectionContainer, nextButton, prevButton));
        prevButton.addEventListener("click", () => this.prevSection(caneLabels, sectionContainer, nextButton, prevButton));
      } else {
        console.warn("Navigation buttons not found");
      }
    }, 100); // Adjust timeout if needed
  }

  nextSection(caneLabels: HTMLElement | null, sectionContainer: HTMLElement | null, nextButton: HTMLButtonElement, prevButton: HTMLButtonElement): void {
    if (this.currentIndex < this.h1Texts.length - 1) {
      this.currentIndex++;
      this.currentPosition -= 100;
      if (caneLabels) caneLabels.style.left = `${this.currentPosition}%`;
      if (sectionContainer) sectionContainer.style.left = `${this.currentPosition}%`;
      this.updateSection(nextButton, prevButton);
    }
  }

  prevSection(caneLabels: HTMLElement | null, sectionContainer: HTMLElement | null, nextButton: HTMLButtonElement, prevButton: HTMLButtonElement): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.currentPosition += 100;
      if (caneLabels) caneLabels.style.left = `${this.currentPosition}%`;
      if (sectionContainer) {
        sectionContainer.style.left = `${this.currentPosition}%`;
        sectionContainer.style.transition = `all 0.5s ease-in-out`;
      }
      this.updateSection(nextButton, prevButton);
    }
  }

  updateSection(nextButton?: HTMLButtonElement, prevButton?: HTMLButtonElement): void {
    const h1Element = document.querySelector<HTMLElement>(".h1");

    if (h1Element) {
      h1Element.innerHTML = this.h1Texts[this.currentIndex];
    }

    gsap.from(".h1", { y: "20%", opacity: 0, duration: 0.5 });
    gsap.from(".fruit-image", { y: "-100vh", delay: 0.4, duration: 0.4 });

    if (nextButton && prevButton) {
      nextButton.style.display = this.currentIndex === this.h1Texts.length - 1 ? "none" : "block";
      prevButton.style.display = this.currentIndex === 0 ? "none" : "block";

      if (this.currentIndex + 1 < this.logoColors.length) {
        nextButton.style.color = this.logoColors[this.currentIndex + 1];
        nextButton.style.animationName = this.keyframes[this.currentIndex + 1];
      }

      if (this.currentIndex - 1 >= 0) {
        prevButton.style.color = this.logoColors[this.currentIndex - 1];
        prevButton.style.animationName = this.keyframes[this.currentIndex - 1];
      }
    }
  }
}
