import { PersonaFieldType, Prisma } from '@prisma/client';

export type PersonaSchemaSeedQuestion = {
  name: string;
  fieldType: PersonaFieldType;
  label: string;
  isRequired: boolean;
  fieldConfig?: Prisma.InputJsonValue;
};

export type PersonaSchemaSeedSubComponent = {
  slug: string;
  label: string;
  title?: string;
  sideTitle?: string;
  description?: string;
  sideInfo?: string;
  sidePanelShortInfo?: string;
  sortOrder: number;
  personaQuestions?: PersonaSchemaSeedQuestion[];
};

export type PersonaSchemaSeedComponent = {
  slug: string;
  label: string;
  title?: string;
  sortOrder: number;
  personaSubComponents?: PersonaSchemaSeedSubComponent[];
};

export type PersonaSchemaSeed = {
  schemaVersion: number;
  description: string;
  personaComponents: PersonaSchemaSeedComponent[];
};
