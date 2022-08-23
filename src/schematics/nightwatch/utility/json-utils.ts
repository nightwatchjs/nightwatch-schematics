import { JsonValue } from '@angular-devkit/core';
import { UpdateRecorder } from '@angular-devkit/schematics';
import { Node } from 'jsonc-parser';

function _buildIndent(count: number): string {
  return '\n' + new Array(count + 1).join(' ');
}

export function appendPropertyInAstObject(
  recorder: UpdateRecorder,
  node: Node,
  propertyName: string,
  value: JsonValue,
  indent: number
) {
  const indentStr = _buildIndent(indent);

  if (node.parent?.children && node.parent.children.length > 0) {
    // Insert comma.
    recorder.insertLeft(node.offset + node.length, ',');
  }

  if (node.parent) {
    recorder.insertRight(
      node.offset + node.length,
      indentStr +
        `"${propertyName}": ${JSON.stringify(value, null, 2).replace(/\n/g, indentStr)}` +
        indentStr.slice(0, -2)
    );
  } else {
    throw new Error(`Cannot append property [${propertyName}] in root.`);
  }
}

export function insertPropertyInAstObjectInOrder(
  recorder: UpdateRecorder,
  node: Node,
  propertyName: string,
  value: JsonValue,
  indent: number
) {
  if (node.children === undefined) {
    throw new Error(`Failed to insert JSON property ${propertyName}`);
  }

  //Find insertion info.
  let insertAfterProp: Node | null = null;
  let prev: Node | null = null;
  let isLastProp = false;
  const last = node.children[node.children.length - 1];
  for (const prop of node.children) {
    if (prop.children === undefined) continue;

    if (prop.children[0].value > propertyName) {
      if (prev) {
        insertAfterProp = prev;
      }
      break;
    }
    if (prop === last) {
      isLastProp = true;
      insertAfterProp = last;
    }
    prev = prop;
  }

  if (isLastProp) {
    appendPropertyInAstObject(recorder, last, propertyName, value, indent);

    return;
  }

  const indentStr = _buildIndent(indent);

  const insertIndex =
    insertAfterProp === null
      ? node.offset + 1
      : insertAfterProp.offset + insertAfterProp.length + 1;

  const insertString =
    `${indentStr}"${propertyName}": ${JSON.stringify(value, null, 2).replace(/\n/g, indentStr)}` +
    (node.children && node.children.length > 0 ? ',' : '\n');
  recorder.insertRight(insertIndex, insertString);
}
