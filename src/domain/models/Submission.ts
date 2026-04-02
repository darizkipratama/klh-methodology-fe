export interface Submission {
  _id: string;
  title: string;
  description: string;
  publisherId: {
    _id: string;
    username: string;
    email: string;
  };
  submissionType: string;
  metadata: {
    author_name: string;
    publish_date: string;
    document_type: string;
  };
  openKmDocumentId: string;
  openKmPath: string;
  openKmPublishStatus: string;
  internalReviewStatus: string;
  reviewerId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  comments: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface SubmissionResponse {
  success: boolean;
  data: Submission[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SingleSubmissionResponse {
  success: boolean;
  data: Submission;
}
