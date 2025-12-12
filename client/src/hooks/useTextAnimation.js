// Custom hook for text slide-up animation using GSAP and SplitType
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

const useTextAnimation = () => {
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      // Initialize SplitType for all elements with text-split attribute
      const elements = document.querySelectorAll('[data-text-split]');
      
      if (elements.length === 0) return;

      const typeSplit = new SplitType('[data-text-split]', {
        types: 'words, chars',
        tagName: 'span'
      });

      // Function to create scroll trigger for timeline
      function createScrollTrigger(triggerElement, timeline) {
        // Reset timeline when scroll out of view past bottom of screen
        ScrollTrigger.create({
          trigger: triggerElement,
          start: 'top bottom',
          onLeaveBack: () => {
            timeline.progress(0);
            timeline.pause();
          }
        });

        // Play timeline when scrolled into view (60% from top of screen)
        ScrollTrigger.create({
          trigger: triggerElement,
          start: 'top 60%',
          onEnter: () => timeline.play()
        });
      }

      // Apply animation to all elements with letters-slide-up attribute
      const animElements = document.querySelectorAll('[data-letters-slide-up]');
      const timelines = [];

      animElements.forEach((element) => {
        const tl = gsap.timeline({ paused: true });
        const chars = element.querySelectorAll('.char');
        
        if (chars.length > 0) {
          // Set initial state
          gsap.set(chars, { yPercent: 100 });
          
          tl.to(chars, {
            yPercent: 0,
            duration: 0.3,
            ease: 'power2.out',
            stagger: { amount: 0.8 }
          });

          createScrollTrigger(element, tl);
          timelines.push(tl);
        }
      });

      return () => {
        timelines.forEach(tl => tl.kill());
        ScrollTrigger.getAll().forEach(st => st.kill());
        if (typeSplit) {
          typeSplit.revert();
        }
      };
    }, 100);

    return () => clearTimeout(timer);
  }, []);
};

export default useTextAnimation;
