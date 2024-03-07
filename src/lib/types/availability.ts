export type AvailabilityBlockType = {
  zotDateIndex: number;
  blockIndex: number;
};

export type SelectionStateType = {
  earlierDateIndex: number;
  laterDateIndex: number;
  earlierBlockIndex: number;
  laterBlockIndex: number;
};

export interface MemberAvailability {
  name: string;
  availableBlocks: number[][];
}
