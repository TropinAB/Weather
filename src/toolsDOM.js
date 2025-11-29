export function createElementWithClassAndText(tagName, className, text) {
  const newEl = document.createElement(tagName);
  if (Array.isArray(className)) {
    className.forEach((classNm) => newEl.classList.add(classNm));
  } else {
    newEl.classList.add(className);
  }
  newEl.innerText = text;
  return newEl;
}

export function addInfoElement(parentEl, description, value) {
  const divEl = document.createElement("div");
  divEl.append(
    createElementWithClassAndText(
      "label",
      "info-description",
      `${description}:`,
    ),
  );
  divEl.append(createElementWithClassAndText("label", "info-value", value));
  parentEl.append(divEl);
}
