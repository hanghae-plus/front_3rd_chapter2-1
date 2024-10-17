export function appendChild({ parent, children }) {
	if (!parent || !children) throw new Error('부모요소와 자식요소는 있어야 합니다.');

	if (parent instanceof HTMLElement === false) throw new Error('부모요소는 HTMLElement이어야 합니다.');

	const childrenAry = Array.isArray(children) ? children : [children];
	childrenAry.forEach((child) => {
		if (parent instanceof HTMLElement === false) throw new Error('자식요소는 HTMLElement이어야 합니다.');
		parent.appendChild(child);
	});
}
