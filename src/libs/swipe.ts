import { onCleanup } from 'solid-js';

export const onSwipe = (container: any, accessor: () => (swipeDirection: 'left' | 'right' | 'up' | 'down') => void): void => {
  let initialX: number | null = null;
  let initialY: number | null = null;

  function startTouch(e: TouchEvent) {
    initialX = e.touches[0].clientX;
    initialY = e.touches[0].clientY;
  };

  function moveTouch(e: TouchEvent) {
    if (initialX === null) {
      return;
    }

    if (initialY === null) {
      return;
    }

    let currentX = e.touches[0].clientX;
    let currentY = e.touches[0].clientY;

    let diffX = initialX - currentX;
    let diffY = initialY - currentY;

    const callback = accessor()

    if (Math.abs(diffX) > Math.abs(diffY)) {
      // sliding horizontally
      if (diffX > 0) {
        callback('left');
      } else {
        callback('right');
      }
    } else {
      // sliding vertically
      if (diffY > 0) {
        callback('up')
      } else {
        callback('down');
      }
    }

    initialX = null;
    initialY = null;

    e.preventDefault();
  };

  container.addEventListener("touchstart", startTouch, false);
  container.addEventListener("touchmove", moveTouch, false);

  onCleanup(() => {
    container.removeEventListener("touchstart", startTouch, false);
    container.removeEventListener("touchmove", moveTouch, false);
  });
}

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      onSwipe: (swipeDirection: 'left' | 'right' | 'up' | 'down') => void;
    }
  }
}
