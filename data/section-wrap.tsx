import type { Root, Element, RootContent } from "hast";

export function rehypeSections() {
  return (tree: Root) => {
    const children: RootContent[] = tree.children;
    const newChildren: Element[] = [];
    let sectionNodes: RootContent[] = [];


    let delay = 180; 
    const increment = 90;

    for (const node of children) {
      if (node.type === "element" && (node as Element).tagName === "h2") {
        if (sectionNodes.length > 0) {
          newChildren.push({
            type: "element",
            tagName: "section",
            properties: {
              className: ["blog-section", "mb-16", "animate-slide-down-fade", "px-2"],
              style: `animation-delay: ${delay}ms;`,
            },
            children: sectionNodes,
          } as Element);

          delay += increment; 
        }
        sectionNodes = [node];
      } else {
        sectionNodes.push(node);
      }
    }

    if (sectionNodes.length > 0) {
      newChildren.push({
        type: "element",
        tagName: "section",
        properties: {
          className: ["blog-section", "mb-16", "animate-slide-down-fade", "px-2"],
          style: `animation-delay: ${delay}ms;`,
        },
        children: sectionNodes,
      } as Element);
    }

    tree.children = newChildren;
  };
}
