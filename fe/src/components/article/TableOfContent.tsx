import React, { useEffect, useState } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

const TableOfContents: React.FC<{ contentRef: React.RefObject<HTMLDivElement> }> = ({ contentRef }) => {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const generateId = (text: string, level: number, index: number): string => {
    return `heading-${level}-${index}-`;
  };

  useEffect(() => {
    if (contentRef.current) {
      const headingElements = contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const newHeadings: Heading[] = [];

      headingElements.forEach((heading, index) => {
        const element = heading as HTMLElement;

        if (!element.id) {
          element.id = generateId(element.innerText, parseInt(element.tagName.substring(1)), index);
        }

        newHeadings.push({
          id: element.id,
          text: element.innerText,
          level: parseInt(element.tagName.substring(1)),
        });
      });

      setHeadings(newHeadings);

      const currentHash = window.location.hash.substring(1);
      if (currentHash) {
        const activeHeading = newHeadings.find(heading => heading.id === currentHash);
        if (activeHeading) {
          setActiveId(currentHash);
          const element = document.getElementById(currentHash);
          if (element) {
            const offset = 60;
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }
      }
    }
  }, [contentRef]);

  useEffect(() => {
    const handleScroll = () => {
      if (headings.length === 0) return;

      let activeId = headings[0].id;
      const offset = 60;
      const fromTop = window.scrollY + offset;

      for (let i = 0; i < headings.length; i++) {
        const element = document.getElementById(headings[i].id);
        if (element && element.offsetTop <= fromTop) {
          activeId = headings[i].id;
        } else {
          break;
        }
      }

      setActiveId(activeId);
      window.history.pushState(null, '', `#${activeId}`);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [headings]);

  const handleClick = (id: string) => {
    setActiveId(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 60;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      window.history.pushState(null, '', `#${id}`);
    }
  };

  return (
    <div className='table-of-content'>
      <nav>
        <ul>
          {headings.map((heading) => (
            <li key={heading.id} style={{ paddingLeft: (heading.level - 1) * 8 + 5, borderLeft: activeId === heading.id ? "3px solid #03a9f4" : "none" }}>
              <a
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleClick(heading.id);
                }}
                style={{ color: activeId === heading.id ? 'blue' : 'black' }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default TableOfContents;
