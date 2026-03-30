/**
 * MindHub24 — Scroll Animation Engine
 * GSAP + ScrollTrigger for cinematic section reveals
 * Parallax on images, staggered text, counter animations
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScrollAnimations() {
  // Respect reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // ===== Parallax on images =====
  document.querySelectorAll('[data-parallax]').forEach((el) => {
    const speed = parseFloat((el as HTMLElement).dataset.parallax || '0.15');
    gsap.to(el, {
      y: () => ScrollTrigger.maxScroll(window) * speed * -0.1,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
        invalidateOnRefresh: true,
      },
    });
  });

  // ===== Staggered card reveals (services, steps) =====
  document.querySelectorAll('[data-stagger-parent]').forEach((parent) => {
    const children = parent.querySelectorAll('[data-stagger-child]');
    if (!children.length) return;

    gsap.from(children, {
      y: 60,
      opacity: 0,
      duration: 1,
      stagger: 0.12,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: parent,
        start: 'top 80%',
        once: true,
      },
    });
  });

  // ===== Counter animation =====
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = parseInt((el as HTMLElement).dataset.count || '0', 10);
    const suffix = (el as HTMLElement).dataset.countSuffix || '';
    const obj = { val: 0 };

    gsap.to(obj, {
      val: target,
      duration: 2.5,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
      onUpdate: () => {
        (el as HTMLElement).textContent = Math.round(obj.val).toLocaleString('ru-RU') + suffix;
      },
    });
  });

  // ===== Horizontal text reveal (hero headline) =====
  const heroH1 = document.querySelector('.hero-title-gsap');
  if (heroH1) {
    gsap.from(heroH1, {
      y: 80,
      opacity: 0,
      duration: 1.4,
      ease: 'expo.out',
      delay: 0.3,
    });
  }

  // ===== Pain cards — sequential left-border color wave =====
  const painCards = document.querySelectorAll('[data-pain-card]');
  if (painCards.length) {
    painCards.forEach((card, i) => {
      ScrollTrigger.create({
        trigger: card,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          gsap.to(card, {
            borderLeftColor: 'var(--color-accent)',
            duration: 0.6,
            delay: i * 0.15,
            ease: 'power2.out',
          });
          gsap.to(card, {
            borderLeftColor: 'var(--color-primary)',
            duration: 0.8,
            delay: i * 0.15 + 0.8,
            ease: 'power2.inOut',
          });
        },
      });
    });
  }

  // ===== Voices wall — fade in on scroll =====
  const voiceCards = document.querySelectorAll('[data-voice]');
  if (voiceCards.length) {
    gsap.from(voiceCards, {
      opacity: 0,
      y: 40,
      duration: 1.2,
      stagger: 0.15,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: voiceCards[0],
        start: 'top 80%',
        once: true,
      },
    });
  }

  // ===== Phrases — pop in =====
  const phrases = document.querySelectorAll('[data-phrase]');
  if (phrases.length) {
    gsap.from(phrases, {
      scale: 0.85,
      opacity: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: phrases[0],
        start: 'top 80%',
        once: true,
      },
    });
  }

  // ===== Final CTA — scale up =====
  const finalCta = document.querySelector('[data-final-cta]');
  if (finalCta) {
    gsap.from(finalCta, {
      scale: 0.9,
      opacity: 0,
      duration: 1.2,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: finalCta,
        start: 'top 80%',
        once: true,
      },
    });
  }

  // Refresh on load for accurate calculations
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
