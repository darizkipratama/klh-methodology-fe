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
    kategoriSektor?: string;
    sumberAcuan?: string;
    publisherId?: string;
    document_type?: string;
    author_name?: string;
    publish_date?: string;
    metadata?: string;
  };
  openKmDocumentId: string;
  openKmPath: string;
  openKmPublishStatus: string;
  internalReviewStatus: string;
  reviewerId?: string;
  parentSubmissionId?: string | null;
  comments: Array<{
    comment: string;
    commenterId: {
      _id: string;
      username: string;
      role: string;
    };
    createdAt: string;
    _id: string;
  }>;
  publicComments: Array<{
    comment: string;
    commenterId?: {
      _id: string;
      username: string;
      role: string;
    };
    createdAt?: string;
    _id?: string;
  }>;
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
