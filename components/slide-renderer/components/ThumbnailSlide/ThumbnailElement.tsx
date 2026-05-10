import { useMemo } from 'react';
import { ElementTypes, type PPTElement, type PPTVideoElement } from '@/lib/types/slides';
import { isMediaPlaceholder } from '@/lib/store/media-generation';

import { BaseImageElement } from '../element/ImageElement/BaseImageElement';
import { BaseTextElement } from '../element/TextElement/BaseTextElement';
import { BaseShapeElement } from '../element/ShapeElement/BaseShapeElement';
import { BaseLineElement } from '../element/LineElement/BaseLineElement';
import { BaseChartElement } from '../element/ChartElement/BaseChartElement';
import { BaseLatexElement } from '../element/LatexElement/BaseLatexElement';
import { BaseTableElement } from '../element/TableElement/BaseTableElement';

interface ThumbnailElementProps {
  readonly elementInfo: PPTElement;
  readonly elementIndex: number;
}

function ThumbnailVideoElement({ elementInfo }: { readonly elementInfo: PPTVideoElement }) {
  const src = elementInfo.src && !isMediaPlaceholder(elementInfo.src) ? elementInfo.src : undefined;

  return (
    <div
      className="element-content absolute"
      data-video-element
      style={{
        top: `${elementInfo.top}px`,
        left: `${elementInfo.left}px`,
        width: `${elementInfo.width}px`,
        height: `${elementInfo.height}px`,
      }}
    >
      <div className="w-full h-full" style={{ transform: `rotate(${elementInfo.rotate}deg)` }}>
        {src ? (
          <video
            className="w-full h-full"
            style={{ objectFit: 'contain' }}
            src={src}
            poster={elementInfo.poster}
            preload="metadata"
            muted
            playsInline
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black/10 rounded">
            <svg
              className="w-12 h-12 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Thumbnail element component
 *
 * Renders the corresponding Base component based on element type
 */
export function ThumbnailElement({ elementInfo, elementIndex }: ThumbnailElementProps) {
  const CurrentElementComponent = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- element components have varying prop signatures
    const elementTypeMap: Record<string, any> = {
      [ElementTypes.IMAGE]: BaseImageElement,
      [ElementTypes.TEXT]: BaseTextElement,
      [ElementTypes.SHAPE]: BaseShapeElement,
      [ElementTypes.LINE]: BaseLineElement,
      [ElementTypes.CHART]: BaseChartElement,
      [ElementTypes.LATEX]: BaseLatexElement,
      [ElementTypes.TABLE]: BaseTableElement,
      // TODO: Add other element types
      [ElementTypes.VIDEO]: ThumbnailVideoElement,
      // [ElementTypes.AUDIO]: BaseAudioElement,
    };
    return elementTypeMap[elementInfo.type] || null;
  }, [elementInfo.type]);

  if (!CurrentElementComponent) {
    return null;
  }

  return (
    <div
      className={`base-element base-element-${elementInfo.id}`}
      style={{
        zIndex: elementIndex,
      }}
    >
      <CurrentElementComponent elementInfo={elementInfo} target="thumbnail" />
    </div>
  );
}
