import React from 'react';

interface TextNode {
  type: 'text';
  value: string;
}

interface ParagraphNode {
  type: 'paragraph';
  children: TextNode[];
}

interface RootNode {
  type: 'root';
  children: ParagraphNode[];
}

type RichTextNode = RootNode | ParagraphNode | TextNode;

interface RichTextRendererProps {
  content: RichTextNode | string;
  className?: string;
}

const renderTextNode = (node: TextNode): string => {
  return node.value;
};

const renderParagraphNode = (node: ParagraphNode): React.ReactNode => {
  return (
    <p key={Math.random()}>
      {node.children.map((child, index) => (
        <span key={index}>{renderTextNode(child)}</span>
      ))}
    </p>
  );
};

const renderRootNode = (node: RootNode): React.ReactNode => {
  return (
    <>
      {node.children.map((child) => renderParagraphNode(child))}
    </>
  );
};

export const RichTextRenderer: React.FC<RichTextRendererProps> = ({ 
  content, 
  className = "" 
}) => {
  // If content is a string, try to parse it as JSON first
  if (typeof content === 'string') {
    try {
      // Try to parse as JSON
      const parsedContent = JSON.parse(content);
      
      // Check if it's a rich text structure
      if (parsedContent && typeof parsedContent === 'object' && parsedContent.type === 'root') {
        return (
          <div className={className}>
            {renderRootNode(parsedContent as RootNode)}
          </div>
        );
      }
    } catch {
      // If JSON parsing fails, treat as plain text
      console.log('Content is plain text, not JSON:', content);
    }
    
    // Return as plain text if not JSON or parsing failed
    return <div className={className}>{content}</div>;
  }

  // If content is already a structured object, parse and render it
  if (content && typeof content === 'object') {
    try {
      return (
        <div className={className}>
          {renderRootNode(content as RootNode)}
        </div>
      );
    } catch (error) {
      console.error('Error rendering rich text:', error);
      return <div className={className}>Error rendering content</div>;
    }
  }

  return null;
};

// Utility function to extract plain text from rich text structure
export const extractPlainText = (content: RichTextNode | string): string => {
  if (typeof content === 'string') {
    try {
      // Try to parse as JSON
      const parsedContent = JSON.parse(content);
      
      // Check if it's a rich text structure
      if (parsedContent && typeof parsedContent === 'object' && parsedContent.type === 'root') {
        const rootNode = parsedContent as RootNode;
        return rootNode.children
          .map(paragraph => 
            paragraph.children
              .map(text => text.value)
              .join('')
          )
          .join(' ');
      }
    } catch {
      // If JSON parsing fails, return as plain text
    }
    
    return content;
  }

  if (content && typeof content === 'object') {
    const rootNode = content as RootNode;
    return rootNode.children
      .map(paragraph => 
        paragraph.children
          .map(text => text.value)
          .join('')
      )
      .join(' ');
  }

  return '';
};
