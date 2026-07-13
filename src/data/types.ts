export type ExternalLink = {
  label: string;
  url: string;
  description: string;
};

export type SkillCategory = {
  title: string;
  emoji: string;
  summary: string;
  items: string[];
};

export type Project = {
  title: string;
  emoji: string;
  description: string;
  tags: string[];
};

export type WritingTheme = {
  theme: string;
  emoji: string;
  description: string;
  examples: string[];
};

export type Interest = {
  title: string;
  emoji: string;
  description: string;
};
