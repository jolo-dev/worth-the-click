import van from 'vanjs-core';

const { div } = van.tags;
const Tooltip = ({ link }: { link: string }) =>
  div(
    {
      class: 'tooltip',
      'data-url': link,
      style:
        'display: block; position: absolute; top: 0px; left: 0px; background-color: white; color: black;',
    },
    div({ class: 'avatar' }),
    div({ class: 'line' }),
    div({ class: 'line' }),
  );

export function createTooltip(link: HTMLAnchorElement) {
  const tooltip = Tooltip({ link: link.href });
  createTooltipAction(link, tooltip);
  van.add(document.body, tooltip);
  createTooltipSkeleton();
  return tooltip;
}

export function createTooltipAction(
  link: HTMLAnchorElement,
  tooltip: HTMLDivElement,
) {
  function onMouseMove(event: MouseEvent) {
    console.log('onMouseMove');
    tooltip.style.display = 'block';
    tooltip.style.top = `${event.pageY + 10}px`;
    tooltip.style.left = `${event.pageX - 100}px`;
  }

  function onMouseLeave() {
    console.log('onMouseLeave');
    tooltip.style.display = 'none';
  }

  link.addEventListener('mousemove', onMouseMove);
  link.addEventListener('mouseleave', onMouseLeave);

  return {
    destroy() {
      link.removeEventListener('mousemove', onMouseMove);
      link.removeEventListener('mouseleave', onMouseLeave);
    },
  };
}

function createTooltipSkeleton() {
  const linkElement = document.createElement('style');
  linkElement.innerHTML = `
      .tooltip {
        width: 300px;
        height: 80px;
        border-radius: 5px;
        padding: 10px;
        z-index: 999;
      }
      .tooltip .avatar {
        float: left;
        width: 52px;
        height: 52px;
        background-color: #ccc;
        border-radius: 25%;
        margin: 8px;
        background-image: linear-gradient(90deg, #ddd 0px, #e8e8e8 40px, #ddd 80px);
        background-size: 600px;
        animation: shine-avatar 1.6s infinite linear;
      }
      .tooltip .line {
        float: left;
        width: 140px;
        height: 16px;
        margin-top: 12px;
        border-radius: 7px;
        background-image: linear-gradient(90deg, #ddd 0px, #e8e8e8 40px, #ddd 80px);
        background-size: 600px;
        animation: shine-lines 1.6s infinite linear;
      }
      .tooltip .avatar + .line {
        margin-top: 11px;
        width: 100px;
      }
      .tooltip .line ~ .line {
        background-color: #ddd;
      }
      
      @keyframes shine-lines {
        0% {
          background-position: -100px;
        }
        40%, 100% {
          background-position: 140px;
        }
      }
      @keyframes shine-avatar {
        0% {
          background-position: -32px;
        }
        40%, 100% {
          background-position: 208px;
        }
      }
      `;
  // Append the link element to the head of the document
  document.getElementsByTagName('head')[0].appendChild(linkElement);
}
