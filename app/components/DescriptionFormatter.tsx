"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SlateNode {
  type: string;
  children: Array<{ text: string }>;
}

interface Props {
  content: string;
  maxLength?: number;
}

const DescriptionFormatter = ({ content, maxLength = 300 }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const isSlateFormat = (str: string): boolean => {
    try {
      const parsed = JSON.parse(str);
      return (
        Array.isArray(parsed) &&
        parsed.every((node) => "type" in node && "children" in node)
      );
    } catch {
      return false;
    }
  };

  const renderSlateContent = (nodes: SlateNode[]) => {
    return nodes.map((node, index) => {
      switch (node.type) {
        case "heading-one":
          return (
            <h1 key={index} className="text-2xl font-bold mb-4">
              {node.children[0].text}
            </h1>
          );
        case "heading-two":
          return (
            <h2 key={index} className="text-xl font-bold mb-3">
              {node.children[0].text}
            </h2>
          );
        case "paragraph":
          return (
            <p key={index} className="mb-4 text-gray-700">
              {node.children[0].text}
            </p>
          );
        case "bulleted-list":
          return (
            <ul key={index} className="list-disc ml-6 mb-4">
              {node.children.map((child, i) => (
                <li key={i} className="mb-2">
                  {child.text}
                </li>
              ))}
            </ul>
          );
        default:
          return (
            <p key={index} className="mb-4 text-gray-700">
              {node.children[0].text}
            </p>
          );
      }
    });
  };

  const renderContent = () => {
    try {
      let renderedContent;
      if (isSlateFormat(content)) {
        renderedContent = (
          <div className="description-content">
            {renderSlateContent(JSON.parse(content))}
          </div>
        );
      } else {
        renderedContent = (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        );
      }

      const wrapper = document.createElement("div");
      wrapper.innerHTML = content;
      const textContent = wrapper.textContent || wrapper.innerText;

      if (textContent.length > maxLength) {
        return (
          <>
            <div className={!isExpanded ? "line-clamp-3" : ""}>
              {renderedContent}
            </div>
            <Button
              variant="link"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-800 hover:text-gray-900 font-medium mt-2"
            >
              {isExpanded ? "Read less" : "Read more"}
            </Button>
          </>
        );
      }

      return renderedContent;
    } catch (error) {
      return <p className="text-gray-700">{content}</p>;
    }
  };

  return <div className="description-content">{renderContent()}</div>;
};

export default DescriptionFormatter;
