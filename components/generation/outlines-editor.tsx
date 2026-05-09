'use client';

import { useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import { nanoid } from 'nanoid';
import { useI18n } from '@/lib/hooks/use-i18n';
import { cn } from '@/lib/utils';
import type { SceneOutline } from '@/lib/types/generation';

interface OutlinesEditorProps {
  outlines: SceneOutline[];
  onChange: (outlines: SceneOutline[]) => void;
  onConfirm: () => void;
  onBack: () => void;
  alwaysReview?: boolean;
  onAlwaysReviewChange?: (enabled: boolean) => void;
  isLoading?: boolean;
}

function normalizeOrder(outlines: SceneOutline[]) {
  return outlines.map((outline, index) => ({
    ...outline,
    order: index + 1,
  }));
}

function useSceneTypeLabel() {
  const { t } = useI18n();

  return (type: SceneOutline['type']) => {
    switch (type) {
      case 'quiz':
        return t('generation.sceneTypeQuiz');
      case 'interactive':
        return t('generation.sceneTypeInteractive');
      case 'pbl':
        return t('generation.sceneTypePbl');
      case 'slide':
      default:
        return t('generation.sceneTypeSlide');
    }
  };
}

export function OutlinesEditor({
  outlines,
  onChange,
  onConfirm,
  onBack,
  alwaysReview = false,
  onAlwaysReviewChange,
  isLoading = false,
}: OutlinesEditorProps) {
  const { t } = useI18n();
  const sceneTypeLabel = useSceneTypeLabel();
  const [activeId, setActiveId] = useState<string | null>(outlines[0]?.id ?? null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const activeOutlineId = outlines.some((outline) => outline.id === activeId)
    ? activeId
    : (outlines[0]?.id ?? null);

  const addOutline = () => {
    const newOutline: SceneOutline = {
      id: nanoid(8),
      type: 'slide',
      title: '',
      description: '',
      keyPoints: [],
      order: outlines.length + 1,
    };
    onChange(normalizeOrder([...outlines, newOutline]));
    setActiveId(newOutline.id);
  };

  const updateOutline = (index: number, updates: Partial<SceneOutline>) => {
    const next = [...outlines];
    next[index] = { ...next[index], ...updates };
    onChange(normalizeOrder(next));
  };

  const removeOutline = (index: number) => {
    const removed = outlines[index];
    const next = normalizeOrder(outlines.filter((_, i) => i !== index));
    onChange(next);
    if (removed?.id === activeOutlineId) {
      setActiveId(next[Math.min(index, next.length - 1)]?.id ?? null);
    }
  };

  const moveOutline = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= outlines.length) return;
    const next = [...outlines];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    onChange(normalizeOrder(next));
    setActiveId(next[targetIndex].id);
  };

  const reorderOutline = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return;
    const next = [...outlines];
    const [item] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, item);
    onChange(normalizeOrder(next));
    setActiveId(item.id);
  };

  const updateKeyPoints = (index: number, keyPointsText: string) => {
    const keyPoints = keyPointsText
      .split('\n')
      .map((point) => point.trim())
      .filter(Boolean);
    updateOutline(index, { keyPoints });
  };

  const handleRowKeyDown = (event: KeyboardEvent<HTMLDivElement>, id: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setActiveId(id);
    }
  };

  return (
    <motion.div
      layoutId="outline-review-surface"
      transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      className="overflow-hidden rounded-lg border border-border/70 bg-background/95 shadow-xl shadow-slate-900/10 backdrop-blur"
    >
      <div className="flex flex-col gap-3 border-b border-border/60 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-5">
        <div className="min-w-0">
          <h2 className="text-base font-semibold md:text-lg">
            {t('generation.outlineEditorTitle')}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('generation.outlineEditorSummary', { count: outlines.length })}
          </p>
        </div>
        <Button variant="outline" onClick={addOutline} disabled={isLoading} className="shrink-0">
          <Plus className="size-4" />
          {t('generation.addScene')}
        </Button>
      </div>

      <div className="max-h-[62vh] overflow-y-auto px-4 py-4 md:px-5">
        {outlines.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border/70 px-6 py-10 text-center">
            <p className="mb-4 text-sm text-muted-foreground">{t('generation.noOutlines')}</p>
            <Button variant="outline" onClick={addOutline} disabled={isLoading}>
              <Plus className="size-4" />
              {t('generation.addFirstScene')}
            </Button>
          </div>
        ) : (
          <div className="relative space-y-3 pl-7">
            <div className="absolute bottom-3 left-[11px] top-3 w-px bg-border" />
            <AnimatePresence initial={false}>
              {outlines.map((outline, index) => {
                const isActive = outline.id === activeOutlineId;
                const keyPointPreview = outline.keyPoints?.filter(Boolean).slice(0, 3) ?? [];

                return (
                  <motion.div
                    key={outline.id}
                    layout
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                    onDragOver={(event) => {
                      event.preventDefault();
                      event.dataTransfer.dropEffect = 'move';
                    }}
                    onDrop={(event) => {
                      event.preventDefault();
                      const sourceId = event.dataTransfer.getData('text/plain') || draggingId;
                      const fromIndex = outlines.findIndex((item) => item.id === sourceId);
                      reorderOutline(fromIndex, index);
                      setDraggingId(null);
                    }}
                    className={cn(
                      'group relative rounded-lg border bg-background transition-colors',
                      isActive
                        ? 'border-blue-500/30 shadow-lg shadow-blue-500/5'
                        : 'border-border/70 hover:border-blue-500/25',
                      draggingId === outline.id && 'opacity-45',
                    )}
                  >
                    <div
                      className={cn(
                        'absolute -left-[30px] top-4 flex size-6 items-center justify-center rounded-full border bg-background text-xs font-semibold',
                        isActive
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : 'border-border text-muted-foreground',
                      )}
                    >
                      {index + 1}
                    </div>

                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setActiveId(outline.id)}
                      onKeyDown={(event) => handleRowKeyDown(event, outline.id)}
                      className="flex cursor-pointer items-start gap-3 px-3 py-3 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span
                        draggable={!isLoading}
                        title={t('generation.dragScene')}
                        onClick={(event) => event.stopPropagation()}
                        onDragStart={(event) => {
                          event.dataTransfer.effectAllowed = 'move';
                          event.dataTransfer.setData('text/plain', outline.id);
                          setDraggingId(outline.id);
                        }}
                        onDragEnd={() => setDraggingId(null)}
                        className="mt-0.5 flex size-5 shrink-0 cursor-grab items-center justify-center text-muted-foreground/50 active:cursor-grabbing"
                      >
                        <GripVertical className="size-4" aria-hidden />
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="min-w-0 truncate text-sm font-medium">
                            {outline.title || t('generation.sceneTitlePlaceholder')}
                          </span>
                          <span className="shrink-0 rounded-full border border-border/70 px-2 py-0.5 text-[10px] uppercase text-muted-foreground">
                            {sceneTypeLabel(outline.type)}
                          </span>
                          {!isActive && <Pencil className="size-3.5 text-muted-foreground/50" />}
                        </div>
                        {!isActive && (
                          <div className="mt-1 space-y-1">
                            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                              {outline.description || t('generation.sceneDescriptionPlaceholder')}
                            </p>
                            {keyPointPreview.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {keyPointPreview.map((point, pointIndex) => (
                                  <span
                                    key={`${outline.id}-point-${pointIndex}`}
                                    className="max-w-full truncate rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                                  >
                                    {point}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex shrink-0 items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          aria-label={t('generation.moveSceneUp')}
                          onClick={(event) => {
                            event.stopPropagation();
                            moveOutline(index, 'up');
                          }}
                          disabled={index === 0 || isLoading}
                        >
                          <ChevronUp className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          aria-label={t('generation.moveSceneDown')}
                          onClick={(event) => {
                            event.stopPropagation();
                            moveOutline(index, 'down');
                          }}
                          disabled={index === outlines.length - 1 || isLoading}
                        >
                          <ChevronDown className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-7 text-muted-foreground hover:text-destructive"
                          aria-label={t('generation.deleteScene')}
                          onClick={(event) => {
                            event.stopPropagation();
                            removeOutline(index);
                          }}
                          disabled={isLoading}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>

                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          key="editor"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 360, damping: 34 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-4 border-t border-border/60 px-3 pb-4 pt-3 md:px-4">
                            <div className="grid gap-3 md:grid-cols-[1fr_140px]">
                              <Input
                                value={outline.title}
                                onChange={(event) =>
                                  updateOutline(index, { title: event.target.value })
                                }
                                placeholder={t('generation.sceneTitlePlaceholder')}
                                disabled={isLoading}
                              />
                              <Select
                                value={outline.type}
                                onValueChange={(value) =>
                                  updateOutline(index, {
                                    type: value as SceneOutline['type'],
                                  })
                                }
                                disabled={isLoading}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="slide">
                                    {t('generation.sceneTypeSlide')}
                                  </SelectItem>
                                  <SelectItem value="quiz">
                                    {t('generation.sceneTypeQuiz')}
                                  </SelectItem>
                                  <SelectItem value="interactive">
                                    {t('generation.sceneTypeInteractive')}
                                  </SelectItem>
                                  <SelectItem value="pbl">
                                    {t('generation.sceneTypePbl')}
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>{t('generation.sceneDescriptionLabel')}</Label>
                              <Textarea
                                value={outline.description}
                                onChange={(event) =>
                                  updateOutline(index, { description: event.target.value })
                                }
                                placeholder={t('generation.sceneDescriptionPlaceholder')}
                                rows={2}
                                disabled={isLoading}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>{t('generation.keyPointsLabel')}</Label>
                              <Textarea
                                value={outline.keyPoints?.join('\n') || ''}
                                onChange={(event) => updateKeyPoints(index, event.target.value)}
                                placeholder={t('generation.keyPointsPlaceholder')}
                                rows={3}
                                disabled={isLoading}
                              />
                            </div>

                            {outline.type === 'quiz' && (
                              <div className="grid gap-3 rounded-md border border-border/70 bg-muted/30 p-3 md:grid-cols-3">
                                <div className="space-y-1">
                                  <Label className="text-xs">
                                    {t('generation.quizQuestionCount')}
                                  </Label>
                                  <Input
                                    type="number"
                                    value={outline.quizConfig?.questionCount || 3}
                                    onChange={(event) =>
                                      updateOutline(index, {
                                        quizConfig: {
                                          ...outline.quizConfig,
                                          questionCount: parseInt(event.target.value) || 3,
                                          difficulty: outline.quizConfig?.difficulty || 'medium',
                                          questionTypes: outline.quizConfig?.questionTypes || [
                                            'single',
                                          ],
                                        },
                                      })
                                    }
                                    min={1}
                                    max={10}
                                    disabled={isLoading}
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-xs">
                                    {t('generation.quizDifficulty')}
                                  </Label>
                                  <Select
                                    value={outline.quizConfig?.difficulty || 'medium'}
                                    onValueChange={(value) =>
                                      updateOutline(index, {
                                        quizConfig: {
                                          ...outline.quizConfig,
                                          difficulty: value as 'easy' | 'medium' | 'hard',
                                          questionCount: outline.quizConfig?.questionCount || 3,
                                          questionTypes: outline.quizConfig?.questionTypes || [
                                            'single',
                                          ],
                                        },
                                      })
                                    }
                                    disabled={isLoading}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="easy">
                                        {t('generation.quizDifficultyEasy')}
                                      </SelectItem>
                                      <SelectItem value="medium">
                                        {t('generation.quizDifficultyMedium')}
                                      </SelectItem>
                                      <SelectItem value="hard">
                                        {t('generation.quizDifficultyHard')}
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-xs">{t('generation.quizType')}</Label>
                                  <Select
                                    value={outline.quizConfig?.questionTypes?.[0] || 'single'}
                                    onValueChange={(value) =>
                                      updateOutline(index, {
                                        quizConfig: {
                                          ...outline.quizConfig,
                                          questionTypes: [value as 'single' | 'multiple' | 'text'],
                                          questionCount: outline.quizConfig?.questionCount || 3,
                                          difficulty: outline.quizConfig?.difficulty || 'medium',
                                        },
                                      })
                                    }
                                    disabled={isLoading}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="single">
                                        {t('generation.quizTypeSingle')}
                                      </SelectItem>
                                      <SelectItem value="multiple">
                                        {t('generation.quizTypeMultiple')}
                                      </SelectItem>
                                      <SelectItem value="text">
                                        {t('generation.quizTypeText')}
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-border/60 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-5">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <Checkbox
            checked={alwaysReview}
            onCheckedChange={(checked) => onAlwaysReviewChange?.(checked === true)}
            disabled={isLoading}
            aria-label={t('generation.alwaysReviewOutlines')}
          />
          <span>{t('generation.alwaysReviewOutlines')}</span>
        </label>

        <div className="grid gap-2 md:flex md:justify-end">
          <Button
            variant="outline"
            onClick={onBack}
            disabled={isLoading}
            className="w-full md:w-auto"
          >
            {t('generation.backToRequirements')}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading || outlines.length === 0}
            className="w-full md:w-auto"
          >
            {isLoading ? (
              t('generation.generatingInProgress')
            ) : (
              <>
                <CheckCircle2 className="size-4" />
                {t('generation.confirmAndGenerateCourse')}
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
