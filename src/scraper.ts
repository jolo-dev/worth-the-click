import * as cheerio from 'cheerio';

export async function getPage(link: string) {
  console.log('Start scraping and fetching', link);
  try {
    const response = await fetch(link, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      mode: 'no-cors',
    });
    if (response.ok) {
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
