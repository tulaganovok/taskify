import { create } from 'zustand';

type AddWorkspaceStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useAddWorkspace = create<AddWorkspaceStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
