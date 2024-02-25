import { getSummary, readFromStream } from './openai.ts';
import { getPageContent } from './scraper.ts';
import { createTooltip } from './tooltip.ts';

setTimeout(() => {
  const links = Array.from(document.querySelectorAll('a')).filter((link) =>
    link.hasAttribute('href'),
  );

  console.log(links);

  for (const link of links) {
    link.addEventListener('mouseenter', async (event: MouseEvent) => {
      // Start a timer when the mouse enters the link
      const timer = setTimeout(async () => {
        // Perform your desired action based on the duration
        // Create a tooltip element and append it to the body
        const tooltip = document.querySelector<HTMLElement>(
          `[data-url="${link.href}"]`,
        );
        if (tooltip === null) {
          const tooltip = createTooltip(link);
          tooltip.style.display = 'block';
          tooltip.style.top = `${event.pageY + 10}px`;
          tooltip.style.left = `${event.pageX - 100}px`;
          const externalSite = await getPageContent(link.href);
          // console.log(externalSite);
          const summary = await getSummary(externalSite);
          if (
            summary === undefined &&
            summary === '<b>Probably, too big to fetch</b>'
          )
            return;
          await readFromStream(summary as ReadableStream, link.href);
        }
      }, 3000); // Adjust the time (in milliseconds) as needed

      link.addEventListener('mouseleave', () => {
        // Clear the timer if the mouse leaves the link before the specified time
        clearTimeout(timer);
      });
    });
  }
}, 2000);
