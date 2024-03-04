import { createRef } from 'preact';

export default function Tooltip(props: { link: HTMLAnchorElement }) {
  console.log('Tooltip', props.link.href);
  const tooltip = createRef();
  createTooltipSkeleton();
  function onMouseMove(event: MouseEvent) {
    console.log('onMouseMove');
    tooltip.current.style.backgroundColor = 'white';
    tooltip.current.style.color = 'black';
    tooltip.current.style.display = 'block';
    tooltip.current.style.position = 'absolute';
    tooltip.current.style.top = `${event.pageY - 100}px`;
    tooltip.current.style.left = `${event.pageX - 100}px`;
  }

  function onMouseLeave() {
    console.log('onMouseLeave');
    tooltip.current.style.display = 'none';
  }

  props.link.addEventListener('mousemove', onMouseMove);
  props.link.addEventListener('mouseleave', onMouseLeave);
  return (
    <div className='tooltip' data-url={props.link.href} ref={tooltip}>
      <div className='avatar' />
      <div className='line' />
      <div className='line' />
    </div>
  );
}

function createTooltipSkeleton() {
  const linkElement = document.createElement('style');
  linkElement.innerHTML = `
    .tooltip {
      width: 220px;
      height: 80px;
      border-radius: 5px;
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
