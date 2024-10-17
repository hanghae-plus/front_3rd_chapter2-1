import { styleClass } from '@basic/style';

/**
 * 지정된 태그와 props로 DOM 요소 생성
 * @param {string} tagName 태그 이름
 * @param {{ [key: string]: string }} props 속성
 * @returns {HTMLElement}
 */
export const createElementWithProps = (
  tagName: string,
  props: { [key: string]: string } = {}
) => {
  const element = document.createElement(tagName);

  // styleClass를 전역에서 정의하고 각 클래스 매핑
  if (props?.className) {
    const classList = props.className.split(' ');
    const applyTailwind = classList.map(
      (className) => (styleClass as any)[className] || className
    );
    props.className = applyTailwind.join(' ');
  }

  updateAttributes(element, props);

  return element;
};

/**
 * 부모 요소에 여러 자식 요소를 추가
 * @param {HTMLElement} parent 부모 요소
 * @param {HTMLElement | Array<HTMLElement>} children 자식 요소
 */
export const appendChildren = (
  parent: HTMLElement,
  children: HTMLElement | Array<HTMLElement>
) => {
  const elements = Array.isArray(children) ? children : [children];
  elements.forEach((child) => {
    if (child instanceof Node) {
      parent.appendChild(child);
    } else {
      const message = 'appendChildren: Provided child is not a valid DOM node.';
      throw new Error(message);
    }
  });
};

/**
 * 요소에 속성 업데이트
 * @param {HTMLElement} element 속성 적용할 DOM 요소
 * @param {{ [key: string]: string }} props 속성 객체
 */
export const updateAttributes = (
  element: HTMLElement,
  props: { [key: string]: string }
) => {
  try {
    Object.entries(props).forEach(([key, value]) => {
      const isFunction = key.startsWith('on') && typeof value === 'function';

      // 이벤트 등록
      if (isFunction) {
        const eventType = key.slice(2).toLowerCase();
        element.addEventListener(eventType, value);
        return;
      }

      // class 설정
      if (key === 'className') {
        element.className = value;
        return;
      }

      // 그 외 attribute 설정
      element.setAttribute(key, value);
    });
  } catch (error) {
    console.error('Error updating attributes:', error);
  }
};
