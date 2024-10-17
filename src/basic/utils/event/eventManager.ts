const eventMap = new Map<string, Map<HTMLElement, EventListener>>();

let rootElement: HTMLElement;

/**
 * 렌더링 후, 이벤트 등록
 * @param {HTMLElement} root
 */
export function setEventListeners(root: HTMLElement) {
  rootElement = root;

  const eventKeys = eventMap.keys();
  Array.from(eventKeys).forEach((eventType) => {
    removeEvent(eventType, rootElement, handleEvent);
    rootElement.addEventListener(eventType, handleEvent);
  });
}

/**
 * 이벤트 함수
 * @param {Event} event
 */
function handleEvent(event: Event) {
  const { target, type } = event;
  const handlers = eventMap.get(type);

  // 함수가 없으면 return
  if (!handlers) return;

  for (const [element, handler] of handlers) {
    // element가 HTML ELEMENT 일 때
    if (typeof element === 'object' && element === target) {
      event.preventDefault();
      handler(event);
      break;
    }
  }
}

/**
 * 이벤트 등록
 * @param {string} eventType
 * @param {HTMLElement} element
 * @param {EventListener} handler
 * @returns
 */
export function addEvent(
  eventType: string,
  element: HTMLElement,
  handler: EventListener
) {
  // 기존에 등록되지 않은 eventType이면 eventMap에 등록
  if (!eventMap.has(eventType)) eventMap.set(eventType, new Map());

  // 이벤트가 등록된 element
  const elementMap = eventMap.get(eventType)!;

  // 등록된 이벤트와 handler가 같으면 return
  if (elementMap.get(element) === handler) return;

  // handler 등록
  elementMap.set(element, handler);
}

/**
 * 이벤트 제거
 * @param {string} eventType
 * @param {HTMLElement} element
 * @param {EventListener} handler
 */
function removeEvent(
  eventType: string,
  element: HTMLElement,
  handler: EventListener
) {
  // 등록된 eventType이 있는지 체크
  if (eventMap.has(eventType)) {
    const elementMap = eventMap.get(eventType)!;

    // event 등록되어 있는 element들 제거
    if (elementMap.has(element)) elementMap.delete(element);

    // event 등록되어 있는 element가 없으면 eventType 제거
    if (elementMap.size === 0) eventMap.delete(eventType);

    rootElement.removeEventListener(eventType, handler);
  }
}
