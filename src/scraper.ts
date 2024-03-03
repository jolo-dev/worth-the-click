import * as cheerio from 'cheerio';

export async function getPage(link: string) {
  console.log('Start scraping and fetching', JSON.stringify({ link }));
  try {
    const response = await fetch('http://localhost:8787', {
      method: 'POST',
      body: JSON.stringify({ link }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer honoiscool',
      },
    });
    console.log('Response', response);

    if (response.status === 200) {
      const html = await response.text();
      return html;
    }
  } catch (error) {
    console.error(error);
    throw new Error(`Cannot fetch ${link}: ${error}`);
  }
}

export function parseHtml(html: string): string {
  const $ = cheerio.load(html);
  const content: string =
    $('article').text() || $('main').text() || $('body').text();
  return content.replace('\n\n', '').replace('  ', ' ').trim();
}

export async function getPageContent(link: string) {
  const html = await getPage(link);
  if (html === undefined) {
    const tooltip = document.querySelector(`[data-url="${link}"]`);
    if (tooltip) {
      tooltip.innerHTML = '<b>Cannot fetch the page</b>';
    }
    throw new Error('Cannot fetch the page');
  }
  const content = parseHtml(html);
  return content;
}
