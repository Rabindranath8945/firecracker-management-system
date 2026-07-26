export interface BackupMetadata {
  version: string;
  checksum: string;
  createdAt: Date;
  createdBy: string;
}

export function buildMetadata(data: {
  version: string;
  checksum: string;
  createdBy: string;
}): BackupMetadata {
  return {
    version: data.version,
    checksum: data.checksum,
    createdAt: new Date(),
    createdBy: data.createdBy,
  };
}
