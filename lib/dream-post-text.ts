import type { ImageItem } from '@/types/image';

export type DreamPostText = {
  title: string;
  teaser: string;
  body: string;
};

const TOPIC_LABELS: Record<string, string> = {
  sport: 'Sports',
  people: 'People',
  office: 'Office',
  technology: 'Tech',
  nature: 'Nature',
  abstract: 'Abstract',
  food: 'Food',
  science: 'Science',
};

const normalize = (value: string) => value.trim().toLowerCase();

const titleCase = (value: string) =>
  value.length === 0 ? value : value[0]!.toUpperCase() + value.slice(1);

const displayTopic = (topic: string) => {
  const key = normalize(topic);
  return TOPIC_LABELS[key] ?? titleCase(key);
};

const slugify = (value: string) =>
  normalize(value)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 24);

const hash = (value: string) => {
  let out = 0;
  for (let i = 0; i < value.length; i += 1) {
    out = (out * 33 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(out);
};

const pick = <T,>(options: readonly T[], seed: number) =>
  options[seed % options.length] ?? options[0]!;

const TITLE = [
  (topic: string) => `Saved: ${topic}`,
  (topic: string) => `${topic} snapshot`,
  (topic: string) => `${topic} for later`,
] as const;

const TEASER = [
  (topic: string) => `${topic}, quick and simple.`,
  (topic: string) => `Adding this to the ${topic} pile.`,
  (topic: string) => `One more ${topic} idea.`,
] as const;

const BODY = [
  (topic: string) => `Posting this as a small ${topic} moment.`,
  (topic: string) => `Kept it because the ${topic} vibe stuck with me.`,
  (topic: string) => `No big story — just ${topic}.`,
] as const;

export const getDreamPostText = (image: ImageItem): DreamPostText => {
  const topic = displayTopic(image.topic);
  const seed = hash(`${image.id}:${normalize(image.topic)}`);

  const hashtag = slugify(image.topic);
  const tags = hashtag ? `#${hashtag} #dreammode` : '#dreammode';

  return {
    title: pick(TITLE, seed)(topic),
    teaser: pick(TEASER, seed >> 2)(topic),
    body: `${pick(BODY, seed >> 4)(topic)} ${tags}`,
  };
};
