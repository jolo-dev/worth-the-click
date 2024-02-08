import React, { render } from 'preact';
import Tooltip from './Tooltip.tsx';

const links = Array.from(document.querySelectorAll('a')).filter((link) =>
  link.hasAttribute('href'),
);

for (const link of links) {
  link.addEventListener('mouseenter', () => {
    // Start a timer when the mouse enters the link
    const timer = setTimeout(() => {
      // Perform your desired action based on the duration
      // Create a tooltip element and append it to the body
      const tooltip = document.querySelector<HTMLElement>(
        `[data-url="${link.href}"]`,
      );
      if (tooltip === null) {
        const foo = <Tooltip link={link} />;
        render(foo, document.body);
        console.log('Tooltip created');
      }
    }, 3000); // Adjust the time (in milliseconds) as needed

    link.addEventListener('mouseleave', () => {
      // Clear the timer if the mouse leaves the link before the specified time
      clearTimeout(timer);
    });
  });
}
