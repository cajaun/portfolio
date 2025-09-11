import type { Root, Element, Content } from "hast";

export function rehypeWrapH2Sections() {
  return (tree: Root) => {
    const children: Content[] = tree.children;
    const newChildren: Element[] = [];

    let sectionNodes: Content[] = [];

    for (const node of children) {
      if (node.type === "element" && (node as Element).tagName === "h2") {
        // push previous section if exists
        if (sectionNodes.length > 0) {
          newChildren.push({
            type: "element",
            tagName: "section",
            properties: { className: ["blog-section", "mb-16"] },
            children: sectionNodes,
          } as Element);
        }
        sectionNodes = [node];
      } else {
        sectionNodes.push(node);
      }
    }

    // push last section
    if (sectionNodes.length > 0) {
      newChildren.push({
        type: "element",
        tagName: "section",
        properties: { className: ["blog-section", "mb-16"] },
        children: sectionNodes,
      } as Element);
    }

    tree.children = newChildren;
  };
}
