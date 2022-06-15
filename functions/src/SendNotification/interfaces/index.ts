export interface IFile {
  type: string;
  url: string;
}

export interface IUserData {
  studentId: string;
  files: IFile[];
}

export interface IDocumentFile {
  contentType: string;
  email: string;
  fileName: string;
  fileType: string;
  mediaLink: string;
  status: string;
}
