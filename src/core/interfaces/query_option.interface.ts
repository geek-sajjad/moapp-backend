export interface SampleQueryOptions {
  relations?: string[];
  where?: {
    phoneNumber?: string;
  };
  skip?: number;
  take?: number;
}
