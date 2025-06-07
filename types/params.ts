export type DynamicParams<K extends string> = {
  params: Promise<{
    [key in K]: string;
  }>;
};
